"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24 md:py-40 bg-transparent relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center perspective-[1000px] w-full">
        <motion.div
           initial={{ opacity: 0, rotateX: 20, y: 100, scale: 0.9 }}
           whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, type: "spring", bounce: 0.3 }}
           className="bg-black/40 border border-white/10 rounded-[3rem] p-12 md:p-24 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_2px_2px_rgba(255,255,255,0.1)] relative overflow-hidden"
        >
          {/* Inner Highlight Reflection */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <h2 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 tracking-tight mb-8">
            Unlock your <br className="hidden md:block"/> career potential.
          </h2>
          
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12">
            Join thousands of professionals landing interviews faster with AI-optimized resumes.
          </p>
          
          <motion.div
            style={{ perspective: "1000px" }}
            className="mt-6"
          >
            <motion.button
              onClick={() => {/* route */}}
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
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/5 blur-[150px] rounded-full pointer-events-none flex-shrink-0" />
    </section>
  );
}
