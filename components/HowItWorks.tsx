"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { UploadCloud, Target, Sparkles, ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function HowItWorks() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const steps = [
    {
      num: "01",
      title: "Upload Resume",
      description: "Simply drop your current PDF or Word resume into our secure, high-speed platform.",
      icon: <UploadCloud className="w-8 h-8 text-neutral-200" />,
    },
    {
      num: "02",
      title: "Select Role",
      description: "Tell us the specific job title or paste the description of the role you're targeting.",
      icon: <Target className="w-8 h-8 text-neutral-200" />,
    },
    {
      num: "03",
      title: "Get AI Feedback",
      description: "Receive an actionable, paragraph-by-paragraph analysis delivered in seconds.",
      icon: <Sparkles className="w-8 h-8 text-neutral-200" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-40 bg-transparent border-t border-white/5 relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center perspective-[1000px]">
          
          <motion.div 
            className="w-full lg:w-1/2"
            style={{ y: yTransform }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neutral-600 tracking-tight mb-8 drop-shadow-md">
                Streamlined for success.
              </h2>
              <p className="text-neutral-400 text-lg md:text-xl max-w-md font-medium leading-relaxed mb-10">
                In just three steps, transform your generic resume into a highly targeted application scientifically designed to outsmart ATS algorithms and win interviews.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05, gap: "12px" }}
                className="flex items-center gap-2 text-white font-semibold group"
              >
                Learn more about our engine
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              </motion.button>
            </motion.div>
          </motion.div>

          <div className="w-full lg:w-1/2">
            <div className="space-y-6 lg:space-y-10" style={{ perspective: "1000px" }}>
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: 50, rotateX: 10 }}
                  whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: -10, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
                    backgroundColor: "rgba(255,255,255,0.05)"
                  }}
                  className="flex gap-6 relative group p-6 rounded-3xl border border-transparent hover:border-white/10 transition-colors backdrop-blur-sm"
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center relative z-10 group-hover:border-white/30 transition-colors shadow-inner">
                    {step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-bold text-neutral-600 font-mono tracking-widest">{step.num}</span>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{step.title}</h3>
                    </div>
                    <p className="text-neutral-400 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative architectural grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
    </section>
  );
}
