import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import FloatingBackground from "@/components/FloatingBackground";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 overflow-hidden relative">
      <Navbar />
      <Hero />
      <div className="relative w-full z-10 bg-transparent">
        <FloatingBackground />
        <Features />
        <HowItWorks />
        <CTA />
      </div>
    </main>
  );
}
