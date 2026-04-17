"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { UploadCloud, Target, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const textControls = useAnimation();

  useEffect(() => {
    textControls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04 + 0.2,
        duration: 0.7,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }));
  }, [textControls]);

  const headingWords = ["Streamlined", "for", "success."];

  const steps = [
    {
      num: "01",
      title: "Upload Resume",
      description:
        "Simply drop your current PDF or Word resume into our secure, high-speed platform.",
      icon: <UploadCloud className="w-8 h-8" style={{ color: "#e85d1e" }} />,
    },
    {
      num: "02",
      title: "Select Role",
      description:
        "Tell us the specific job title or paste the description of the role you're targeting.",
      icon: <Target className="w-8 h-8" style={{ color: "#3b6bda" }} />,
    },
    {
      num: "03",
      title: "Get AI Feedback",
      description:
        "Receive an actionable, paragraph-by-paragraph analysis delivered in seconds.",
      icon: <Sparkles className="w-8 h-8" style={{ color: "#f5a623" }} />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-40 relative overflow-hidden"
      style={{
        borderTop: "1px solid rgba(26,31,60,0.08)",
      }}
    >
      {/* ✅ LIGHT OVERLAY (lets particles show) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.22) 0%, rgba(255,248,244,0.18) 50%, rgba(255,242,232,0.22) 100%)",
          }}
        />

        {/* ✅ Contrast layer for particles */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.06), transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          {/* LEFT */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {/* HEADING */}
              <h2
                className="font-black tracking-tighter leading-[1.06] mb-8"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                }}
              >
                {headingWords.map((word, wi) => (
                  <span key={wi} style={{ display: "inline-block", marginRight: 10 }}>
                    {word.split("").map((char, ci) => (
                      <motion.span
                        key={ci}
                        custom={wi * 10 + ci}
                        initial={{ opacity: 0, y: 40 }}
                        animate={textControls}
                        style={{
                          display: "inline-block",
                          ...(wi === 2
                            ? {
                                background:
                                  "linear-gradient(135deg, #e85d1e 0%, #ff9a5c 50%, #f5a623 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                textShadow: "0 2px 6px rgba(0,0,0,0.08)",
                              }
                            : {
                                color: "#0f172a", // darker for clarity
                              }),
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h2>

              {/* SUBTEXT */}
              <p
                className="text-lg md:text-xl max-w-md font-medium leading-relaxed mb-10"
                style={{ color: "#475569" }}
              >
                In just three steps, transform your generic resume into a highly
                targeted application scientifically designed to outsmart ATS
                algorithms and win interviews.
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 font-semibold group"
                style={{ color: "#1a1f3c" }}
              >
                Learn more about our engine
                <ArrowRight
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  style={{ color: "#e85d1e" }}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-6 lg:space-y-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{
                    scale: 1.02,
                    x: -8,
                    boxShadow:
                      "0 20px 50px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                  className="flex gap-6 relative group p-6 rounded-3xl"
                  style={{
                    background: "rgba(255,255,255,0.85)", // ✅ no blur fog
                    border: "1px solid rgba(26,31,60,0.12)",
                  }}
                >
                  {/* ICON */}
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(26,31,60,0.1)",
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span
                        className="text-sm font-bold font-mono tracking-widest"
                        style={{ color: "#c44d10" }}
                      >
                        {step.num}
                      </span>

                      <h3
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: "#0f172a" }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <p
                      className="leading-relaxed font-medium"
                      style={{ color: "#475569" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AMBIENT GLOWS */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          right: "-5%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(232,93,30,0.10), transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "0%",
          left: "-10%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(26,31,60,0.06), transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </section>
  );
}