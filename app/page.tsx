import { Hero } from '@/components/home/Hero'
import { Stats } from '@/components/home/Stats'
import { Features } from '@/components/home/Features'
import { PlatformGrid } from '@/components/home/PlatformGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Testimonials } from '@/components/home/Testimonials'
import { CTASection } from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <PlatformGrid />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  )
}
