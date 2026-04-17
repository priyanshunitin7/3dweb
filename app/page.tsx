import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import FloatingBackground from "@/components/FloatingBackground";
import Footer from "@/components/Footer";

export default function Home() {
  return (
<main className="min-h-screen text-black selection:bg-black/20 overflow-hidden relative">
      <Navbar />

      {/* Single shared dark container — hero + all sections share one bg */}
      <div className="relative w-full">
        
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </div>
      <Footer />
    </main>
  );
}