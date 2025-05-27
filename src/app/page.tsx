import Header from "@/components/header"
import AboutSection from "@/components/about-section"
import NgoSection from "@/components/ngo-section"
import VolunteerSection from "@/components/volunteer-section"
import HowItWorks from "@/components/how-it-works"
import CtaSection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <AboutSection />
        <NgoSection />
        <VolunteerSection />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
