"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,        // increased from 0.08
      smoothWheel: true,
      syncTouch: false,  // disable on mobile to prevent lag
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);  // properly cancel on unmount
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}