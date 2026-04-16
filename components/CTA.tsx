"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

export default function CTA() {
  const textControls = useAnimation();

  useEffect(() => {
    textControls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.055 + 0.35, // ✅ exact hero timing
        duration: 0.9,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }));
  }, [textControls]);

  const words = ["Unlock", "your", "career", "potential."];

  return (
    <section
      className="py-24 md:py-40 relative overflow-hidden flex items-center justify-center min-h-[70vh]"
      style={{
        background:
          "linear-gradient(150deg, #ffffff 0%, #fff8f4 45%, #fff2e8 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center w-full">
        
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(26,31,60,0.12)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.08)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(232,93,30,0.14), transparent 65%)",
            }}
          />

          {/* HERO STYLE HEADLINE */}
          <h2
            className="font-black tracking-tighter leading-[1.06] mb-6"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
            }}
          >
            {words.map((word, wi) => (
              <span key={wi} style={{ display: "inline-block", marginRight: 10 }}>
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    custom={wi * 10 + ci}
                    initial={{ opacity: 0, y: 40 }}
                    animate={textControls}
                    style={{
                      display: "inline-block",
                      ...(wi >= 2 // "career potential."
                        ? {
                            background:
                              "linear-gradient(135deg, #e85d1e 0%, #ff9a5c 50%, #f5a623 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                        : {
                            color: "#1a1f3c",
                          }),
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="text-lg md:text-xl max-w-2xl mx-auto font-medium mb-10"
            style={{ color: "#5a6080" }}
          >
            Join thousands of professionals landing interviews faster with AI-optimized resumes.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <Link href="/analyze">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow:
                    "0 20px 50px rgba(232,93,30,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset",
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="group relative px-10 py-4 text-sm font-bold tracking-widest uppercase rounded-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #e85d1e 0%, #ff7c3a 60%, #f5a623 100%)",
                  color: "#fff",
                }}
              >
                {/* Shine */}
                <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                </div>

                <span className="relative z-10 flex items-center gap-2 justify-center">
                  Get started
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 400,
          background:
            "radial-gradient(circle, rgba(232,93,30,0.18), transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* Smooth transition to footer */}
<div
  className="absolute bottom-0 left-0 w-full pointer-events-none"
  style={{
    height: 200,
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff2e8 50%, #ffffff 100%)",
  }}
/>
    </section>
  );
}