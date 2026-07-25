import { Navbar } from "@/components/landing/Navbar";
import { Hero, VideoPlaceholder } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { FinalCta, Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="lp">
      <Navbar />
      <main>
        <Hero />
        <VideoPlaceholder />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
