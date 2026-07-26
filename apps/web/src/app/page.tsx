import { Navbar } from "@/components/landing/Navbar";
import { Hero, VideoPlaceholder } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { FinalCta, Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="lp">
      <Navbar />
      <main>
        <Hero />
        <VideoPlaceholder />
        <HowItWorks />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
