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

      {/* Single shared dark container — hero + all sections share one bg */}
      <div className="relative w-full">
        <FloatingBackground />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </div>

    </main>
  );
}