import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Grain from './components/ui/Grain'
import Cursor from './components/ui/Cursor'
import Marquee from './components/sections/Marquee'
import Heritage from './components/sections/Heritage'
import Process from './components/sections/Process'
import Products from './components/sections/Products'
import Scale from './components/sections/Scale'
import Quality from './components/sections/Quality'
import Bulk from './components/sections/Bulk'
import Testimonials from './components/sections/Testimonials'
import Faq from './components/sections/Faq'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'
import { useLenis } from './lib/useLenis'

export default function App() {
  useLenis()

  // overflow-x-clip, not -hidden: `hidden` makes this a scroll container,
  // which would break the hero's position: sticky.
  return (
    <div className="min-h-screen bg-paper overflow-x-clip">
      <Grain />
      <Cursor />
      <Navbar />
      <Hero />
      <main>
        <Marquee />
        <Heritage />
        <Process />
        <Products />
        <Scale />
        <Quality />
        <Bulk />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
