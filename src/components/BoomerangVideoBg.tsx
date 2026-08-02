import { useEffect, useRef, useState, type RefObject } from 'react'
import { useIsMobile } from '../lib/motion'

/**
 * Capture budget, per form factor. Phones get their own portrait cut of the
 * film rather than a cropped landscape one.
 *
 * Every stored frame costs width*height*4 bytes, so the cache is capped in
 * bytes and not only in width: the portrait cut is nearly three times the
 * pixels of the landscape master at the same width, and 48 frames of it at
 * 640px would be ~140MB — enough for iOS Safari to kill the tab. Within that
 * cap, frames trade against resolution: the counts below land at roughly one
 * frame per 14px of scroll on desktop and 19px on a phone, which the LERP
 * smoothing carries without looking stepped.
 */
const DESKTOP_BUDGET = {
  src: '/hero.mp4',
  width: 960,
  frames: 96,
  bytes: 200 * 1024 * 1024,
}
const MOBILE_BUDGET = {
  src: '/hero-mobile.mp4',
  width: 640,
  frames: 32,
  bytes: 48 * 1024 * 1024,
}
/** Below this viewport width, use the mobile budget. */
const MOBILE_BREAKPOINT = 768

const MIN_FRAMES = 24
const FRAMES_PER_SECOND = 12
/** How hard the scrubbed position chases the scroll position each frame. */
const LERP = 0.12

/**
 * Frames captured before the scrub goes live. Waiting for the full set left
 * the hero frozen and ignoring scroll for the whole extraction; this makes it
 * responsive almost immediately and the rest stream in behind it.
 */
const WARMUP_FRAMES = 8

/**
 * A cached still. ImageBitmap is GPU-resident and blits without a
 * canvas-to-canvas copy; the canvas form is the fallback for browsers that
 * lack createImageBitmap.
 */
type Frame = ImageBitmap | HTMLCanvasElement

const supportsBitmap = typeof createImageBitmap === 'function'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/** Resolve once the video has seeked to (near) `time`. */
function seekTo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      video.removeEventListener('seeked', done)
      clearTimeout(timer)
      resolve()
    }
    // Guard against a `seeked` event that never arrives.
    const timer = setTimeout(done, 2000)
    video.addEventListener('seeked', done)
    video.currentTime = time
  })
}

interface BoomerangVideoBgProps {
  /**
   * The hero's scroll wrapper. Its own scroll range maps to 0→1 of the video,
   * so scrolling anywhere else on the page leaves the scrub alone.
   */
  scrubRef: RefObject<HTMLElement | null>
}

export default function BoomerangVideoBg({ scrubRef }: BoomerangVideoBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  /** Captured frames, filled progressively while the scrub is already live. */
  const framesRef = useRef<Frame[]>([])
  /**
   * How many frames the capture pass intends to produce. The scrub maps
   * scroll against this, not against what has arrived, so an early scroll
   * holds the last captured frame instead of showing the wrong moment.
   */
  const totalRef = useRef(0)

  const [framesReady, setFramesReady] = useState(false)
  /**
   * Live, not read once at mount: a window that starts under the breakpoint —
   * docked devtools, a half-width window, display scaling — would otherwise
   * lock the phone cut in for the whole session and never recover.
   */
  const mobile = useIsMobile(MOBILE_BREAKPOINT)

  // ---- Capture pass: seek an offscreen video, never play it. ----
  // Nothing is ever rendered as a playing <video>, so the page opens static.
  useEffect(() => {
    let disposed = false
    const budget = mobile ? MOBILE_BUDGET : DESKTOP_BUDGET

    const video = document.createElement('video')
    video.src = budget.src
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const drawInto = (canvas: HTMLCanvasElement, frame: Frame) => {
      canvas.width = frame.width
      canvas.height = frame.height
      canvas.getContext('2d')?.drawImage(frame, 0, 0)
    }

    const extract = async () => {
      await new Promise<void>((resolve) => {
        if (video.readyState >= 1) return resolve()
        video.addEventListener('loadedmetadata', () => resolve(), { once: true })
        video.addEventListener('error', () => resolve(), { once: true })
      })
      if (disposed) return

      const duration = video.duration
      const iw = video.videoWidth
      const ih = video.videoHeight
      if (!duration || !isFinite(duration) || !iw || !ih) return

      const count = Math.min(
        budget.frames,
        Math.max(MIN_FRAMES, Math.round(duration * FRAMES_PER_SECOND)),
      )

      // Start from the width cap, then shrink further if the whole cache at
      // that size would exceed the byte budget. Solving for area keeps the
      // aspect ratio, whatever shape the source is.
      const widthScale = Math.min(1, budget.width / iw)
      const byteScale = Math.sqrt(budget.bytes / (count * iw * ih * 4))
      const scale = Math.min(widthScale, byteScale)

      const w = Math.round(iw * scale)
      const h = Math.round(ih * scale)
      totalRef.current = count

      // One scratch canvas, reused for every capture, rather than one per
      // frame. Each frame then leaves as a GPU-resident bitmap.
      const scratch = document.createElement('canvas')
      scratch.width = w
      scratch.height = h
      const sctx = scratch.getContext('2d')
      if (!sctx) return

      for (let i = 0; i < count; i++) {
        if (disposed) return
        await seekTo(video, (i / (count - 1)) * (duration - 0.05))
        if (disposed) return

        sctx.drawImage(video, 0, 0, w, h)

        let frame: Frame
        if (supportsBitmap) {
          frame = await createImageBitmap(scratch)
        } else {
          const copy = document.createElement('canvas')
          copy.width = w
          copy.height = h
          copy.getContext('2d')?.drawImage(scratch, 0, 0)
          frame = copy
        }
        if (disposed) {
          if ('close' in frame) frame.close()
          return
        }
        framesRef.current.push(frame)

        // Paint the very first frame immediately so the hero is never blank,
        // then hand over to the scrub as soon as there is enough to move
        // through — the rest keep arriving behind it.
        if (i === 0 && canvasRef.current) drawInto(canvasRef.current, frame)
        if (i + 1 === Math.min(WARMUP_FRAMES, count)) setFramesReady(true)
      }
    }

    void extract()

    return () => {
      disposed = true
      video.removeAttribute('src')
      video.load()
      // Bitmaps hold GPU memory that the collector will not reclaim for us.
      for (const frame of framesRef.current) {
        if ('close' in frame) frame.close()
      }
      framesRef.current = []
      totalRef.current = 0
      // Stops the scrub until the other cut has warmed up, so it can't keep
      // painting frames that have just been closed.
      setFramesReady(false)
    }
  }, [mobile])

  // ---- Playback pass: scrub the captured frames from the hero's scroll range. ----
  // Scrolling down advances the video; scrolling up runs it backward.
  useEffect(() => {
    if (!framesReady) return
    const canvas = canvasRef.current
    const frames = framesRef.current
    if (!canvas || frames.length < 2) return

    canvas.width = frames[0].width
    canvas.height = frames[0].height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let smoothed = 0
    let lastIndex = -1
    let raf = 0

    const readProgress = () => {
      const el = scrubRef.current
      if (!el) return 0
      const rect = el.getBoundingClientRect()
      // How far the wrapper has travelled through its own pinned range.
      const scrollable = rect.height - window.innerHeight
      if (scrollable <= 0) return 0
      return clamp01(-rect.top / scrollable)
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)

      // Ease toward the scroll position so the scrub glides instead of snapping.
      smoothed += (readProgress() - smoothed) * LERP

      // Against the intended total, then clamped to what has actually been
      // captured. Scrolling ahead of the capture pass holds the newest frame
      // and catches up as more land, rather than showing the wrong moment.
      const total = totalRef.current || frames.length
      const wanted = Math.max(0, Math.round(smoothed * (total - 1)))
      const index = Math.min(wanted, frames.length - 1)

      if (index === lastIndex) return
      lastIndex = index
      ctx.drawImage(frames[index], 0, 0)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [framesReady, scrubRef])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* No scale here on purpose: any oversize crops the frame. */}
      <div className="w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  )
}
