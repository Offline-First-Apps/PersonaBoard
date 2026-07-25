import { Navbar } from "@/components/landing/Navbar";
import { Hero, VideoPlaceholder } from "@/components/landing/Hero";
import { CtaBand, Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="lp">
      <Navbar />
      <main>
        <Hero />
        <VideoPlaceholder />
        <Features />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
