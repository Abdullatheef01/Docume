import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { HERO_DEFAULT_MARKDOWN } from './data/documeData.js'
import { Navbar } from './components/Navbar.jsx'
import { Hero } from './components/Hero.jsx'
import { DemoSection } from './components/DemoSection.jsx'
import { BeforeAfter } from './components/BeforeAfter.jsx'
import { FeaturesModes } from './components/FeaturesModes.jsx'
import { MoreFeatures } from './components/MoreFeatures.jsx'
import { HowItWorks } from './components/HowItWorks.jsx'
import { TemplatesGallery } from './components/TemplatesGallery.jsx'
import { FaqSection } from './components/FaqSection.jsx'
import { FinalCta } from './components/FinalCta.jsx'
import { Footer } from './components/Footer.jsx'
import './landing.css'

const goApp = () => window.location.assign('/app')
const goLegal = (doc) => window.location.assign(`/${doc}`)

export default function Landing() {
  const [markdown, setMarkdown] = useState(HERO_DEFAULT_MARKDOWN)

  // Smooth anchor scrolling only on this page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  // After OAuth the server sends the user to "/?login=..." -> hand over to the app.
  // Already logged-in users also go straight to the app.
  useEffect(() => {
    if (window.location.search.includes('login=')) {
      window.location.replace('/app' + window.location.search)
      return
    }
    let off = false
    api
      .me()
      .then((user) => {
        if (!off && user) window.location.replace('/app')
      })
      .catch(() => {})
    return () => {
      off = true
    }
  }, [])

  return (
    <div className="landing-root">
      <Navbar onOpenAuth={goApp} />
      <main>
        <Hero markdown={markdown} onChangeMarkdown={setMarkdown} onOpenAuth={goApp} />
        <DemoSection />
        <BeforeAfter />
        <FeaturesModes />
        <MoreFeatures />
        <HowItWorks />
        <TemplatesGallery onSelectTemplate={setMarkdown} />
        <FaqSection />
        <FinalCta onOpenAuth={goApp} />
      </main>
      <Footer onOpenLegal={goLegal} />
    </div>
  )
}
