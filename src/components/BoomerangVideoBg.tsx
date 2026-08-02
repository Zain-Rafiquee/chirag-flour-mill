import { useEffect, useRef, useState, type RefObject } from 'react'

const VIDEO_SRC = '/hero.mp4'

/**
 * Capture budget. Every stored frame costs width*height*4 bytes, so the totals
 * matter: 96 frames at 960px is ~200MB, which a phone will not tolerate — iOS
 * Safari kills the tab well before that. Small screens get a smaller, shorter
 * cache (~44MB), which is also plenty given how few pixels they display.
 */
const DESKTOP_BUDGET = { width: 960, frames: 96 }
const MOBILE_BUDGET = { width: 640, frames: 48 }
/** Below this viewport width, use the mobile budget. */
const MOBILE_BREAKPOINT = 768

const MIN_FRAMES = 24
const FRAMES_PER_SECOND = 12
/** How hard the scrubbed position chases the scroll position each frame. */
const LERP = 0.12

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
  /** Captured frames, each an offscreen canvas. */
  const framesRef = useRef<HTMLCanvasElement[]>([])

  const [framesReady, setFramesReady] = useState(false)

  // ---- Capture pass: seek an offscreen video, never play it. ----
  // Nothing is ever rendered as a playing <video>, so the page opens static.
  useEffect(() => {
    let disposed = false
    const video = document.createElement('video')
    video.src = VIDEO_SRC
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const drawInto = (canvas: HTMLCanvasElement, frame: HTMLCanvasElement) => {
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

      const budget =
        window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_BUDGET : DESKTOP_BUDGET

      const count = Math.min(
        budget.frames,
        Math.max(MIN_FRAMES, Math.round(duration * FRAMES_PER_SECOND)),
      )
      const scale = Math.min(1, budget.width / iw)
      const w = Math.round(iw * scale)
      const h = Math.round(ih * scale)

      for (let i = 0; i < count; i++) {
        if (disposed) return
        await seekTo(video, (i / (count - 1)) * (duration - 0.05))
        if (disposed) return

        const frame = document.createElement('canvas')
        frame.width = w
        frame.height = h
        const ctx = frame.getContext('2d')
        if (!ctx) return
        ctx.drawImage(video, 0, 0, w, h)
        framesRef.current.push(frame)

        // Paint the very first frame immediately so the hero is never blank.
        if (i === 0 && canvasRef.current) drawInto(canvasRef.current, frame)
      }

      if (disposed) return
      setFramesReady(true)
    }

    void extract()

    return () => {
      disposed = true
      video.removeAttribute('src')
      video.load()
      framesRef.current = []
    }
  }, [])

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

      const index = Math.min(
        frames.length - 1,
        Math.max(0, Math.round(smoothed * (frames.length - 1))),
      )
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
