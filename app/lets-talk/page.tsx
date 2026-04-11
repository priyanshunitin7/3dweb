"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import { useEffect, useRef } from "react";

export default function LetsTalk() {
  const splineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScrollCapture = () => {
      if (splineRef.current && splineRef.current.style.pointerEvents !== "none") {
        splineRef.current.style.pointerEvents = "none";
      }
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (splineRef.current) splineRef.current.style.pointerEvents = "auto";
      }, 150);
    };

    window.addEventListener("wheel", handleScrollCapture, { capture: true, passive: true });
    window.addEventListener("touchmove", handleScrollCapture, { capture: true, passive: true });

    return () => {
      window.removeEventListener("wheel", handleScrollCapture, { capture: true });
      window.removeEventListener("touchmove", handleScrollCapture, { capture: true });
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-hidden relative">
      <Navbar />

      {/* Single, restrained ambient light — one source, not two */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-blue-600/[0.06] blur-[180px] rounded-full" />
      </div>

      {/* Full-height layout — Spline and form share the viewport */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        {/* LEFT — form, takes 45% on desktop */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-14 lg:px-20 pt-32 pb-16 lg:py-0">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow */}
            <p className="text-[11px] tracking-[0.2em] text-white/30 uppercase mb-6 font-medium">
              Contact
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white mb-5">
              Let's build<br />
              <span className="text-white/35">the future.</span>
            </h1>

            <p className="text-[15px] text-white/40 leading-relaxed mb-12 max-w-sm font-normal">
              Tell us where you're headed. We'll help you get there faster.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/30 tracking-[0.12em] uppercase mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/30 tracking-[0.12em] uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/30 tracking-[0.12em] uppercase mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-white text-black text-sm font-medium tracking-wide
                  hover:bg-white/90 active:scale-[0.99] transition-all duration-200 mt-2"
              >
                Send message
              </button>

            </form>

            {/* Quiet social proof — no border, no card */}
            <p className="text-[12px] text-white/20 mt-8 font-normal">
              Average response time · 2 hours
            </p>
          </motion.div>
        </div>

        {/* RIGHT — Spline, takes 55%, completely borderless and free */}
        <motion.div
          ref={splineRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="w-full lg:w-[55%] h-[60vh] lg:h-screen relative"
        // No border. No overflow-hidden. No overlay. No rounded corners.
        // Spline bleeds to the edge of the viewport — that IS the design.
        >
          <Spline
            scene="https://prod.spline.design/uuxGSSsH9CQ7SfHM/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Soft left fade — blends Spline into the bg, no hard edge */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none" />
        </motion.div>

      </div>
    </main>
  );
}