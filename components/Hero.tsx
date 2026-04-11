"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function Hero() {
  const splineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Globally capture wheel/touch events before Spline's internal camera logic intercepts them.
    const handleScrollCapture = () => {
      if (splineRef.current && splineRef.current.style.pointerEvents !== "none") {
        // Instantly disable pointers on the Spline canvas so the browser natively hands 
        // the scroll velocity directly over to the Lenis smoothing engine without hesitation.
        splineRef.current.style.pointerEvents = "none";
      }
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Restore fully interactive 3D physics 150ms after scrolling stops
        if (splineRef.current) {
          splineRef.current.style.pointerEvents = "auto";
        }
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
    <section className="relative w-full h-screen bg-black overflow-hidden">

      {/* Dynamic Event Wrapper */}
      <div ref={splineRef} className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/byLS30jKxiXDt4YT/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* 3D Premium Button */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10" style={{ perspective: "1000px" }}>
        <motion.button
          onClick={() => {/* your route */ }}
          whileHover={{ 
            scale: 1.05, 
            rotateX: 12,
            boxShadow: "0 30px 60px rgba(0,0,0,0.8), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -4px 12px rgba(0,0,0,0.9)"
          }}
          whileTap={{ 
            scale: 0.95, 
            rotateX: 0,
            boxShadow: "0 5px 10px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.8)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="group relative px-10 py-5 text-sm font-bold tracking-widest uppercase text-white
            bg-gradient-to-b from-white/20 to-white/5 
            border border-white/20 rounded-full
            shadow-[0_15px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-2px_6px_rgba(0,0,0,0.8)]
            backdrop-blur-2xl
            overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3 drop-shadow-lg text-white">
            Get started
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>

          {/* Shine Sweep Effect */}
          <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </div>
        </motion.button>
      </div>

    </section>
  );
}