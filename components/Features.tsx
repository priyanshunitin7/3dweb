"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { LineChart, UserCheck, KeySquare } from "lucide-react";

export default function Features() {
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

  const headingWords = ["Powerful", "Features"];

  const features = [
    {
      title: "ATS Score Analysis",
      description:
        "Get an instant score based on industry-standard Application Tracking Systems. Know exactly where your resume stands.",
      icon: <LineChart className="w-8 h-8" style={{ color: "#e85d1e" }} />,
      color: "from-[#e85d1e]/15 to-transparent",
    },
    {
      title: "Role-based Suggestions",
      description:
        "Tailor your resume for specific job titles with AI-driven recommendations that match recruiter expectations.",
      icon: <UserCheck className="w-8 h-8" style={{ color: "#3b6bda" }} />,
      color: "from-[#3b6bda]/15 to-transparent",
    },
    {
      title: "Keyword Optimization",
      description:
        "Discover missing keywords and phrases from job descriptions to significantly boost your callback rate.",
      icon: <KeySquare className="w-8 h-8" style={{ color: "#f5a623" }} />,
      color: "from-[#f5a623]/15 to-transparent",
    },
  ];

  return (
    <section
      id="features"
      className="py-32 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(150deg, #ffffff 0%, #fff8f4 50%, #fff2e8 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-24 perspective-[1000px]">
          
          {/* HERO-STYLE ANIMATED HEADING */}
          <h2
            className="font-black tracking-tighter leading-[1.06]"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              marginBottom: 16,
            }}
          >
            {headingWords.map((word, wi) => (
              <span key={wi} style={{ display: "inline-block", marginRight: 12 }}>
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    custom={wi * 10 + ci}
                    initial={{ opacity: 0, y: 40 }}
                    animate={textControls}
                    style={{
                      display: "inline-block",
                      ...(wi === 1 // "Features" highlighted
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: "easeOut",
            }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl font-medium"
            style={{ color: "#5a6080" }}
          >
            Everything you need to bypass the algorithms and get your resume into the hands of real humans.
          </motion.p>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
          style={{ perspective: "1000px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  "0 25px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
              className="rounded-3xl p-8 relative group cursor-pointer backdrop-blur-xl"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(26,31,60,0.12)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
              />

              {/* Icon */}
              <motion.div
                className="mb-8 inline-flex p-4 rounded-2xl relative z-10"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(26,31,60,0.1)",
                }}
                whileHover={{ rotateZ: 10, scale: 1.1 }}
              >
                {feature.icon}
              </motion.div>

              {/* Title */}
              <h3
                className="text-2xl font-bold mb-4 relative z-10 tracking-tight"
                style={{ color: "#1a1f3c" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed relative z-10 font-medium"
                style={{ color: "#5a6080" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ambient glows */}
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