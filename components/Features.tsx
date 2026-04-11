"use client";

import { motion } from "framer-motion";
import { LineChart, UserCheck, KeySquare } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "ATS Score Analysis",
      description: "Get an instant score based on industry-standard Application Tracking Systems. Know exactly where your resume stands.",
      icon: <LineChart className="w-8 h-8 text-neutral-200" />,
      color: "from-blue-500/20 to-transparent",
    },
    {
      title: "Role-based Suggestions",
      description: "Tailor your resume for specific job titles with AI-driven recommendations that match recruiter expectations.",
      icon: <UserCheck className="w-8 h-8 text-neutral-200" />,
      color: "from-purple-500/20 to-transparent",
    },
    {
      title: "Keyword Optimization",
      description: "Discover missing keywords and phrases from job descriptions to significantly boost your callback rate.",
      icon: <KeySquare className="w-8 h-8 text-neutral-200" />,
      color: "from-emerald-500/20 to-transparent",
    },
  ];

  return (
    <section id="features" className="py-32 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 perspective-[1000px]">
          <motion.h2 
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 tracking-tight drop-shadow-sm"
          >
            Powerful Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl font-medium"
          >
            Everything you need to bypass the algorithms and get your resume into the hands of real humans.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10" style={{ perspective: "1000px" }}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 10,
                rotateY: -10,
                z: 50,
                boxShadow: "0 30px 60px -12px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.3), inset 0 -4px 12px rgba(0,0,0,0.8)",
              }}
              className="bg-neutral-950/80 border border-white/10 rounded-3xl p-8 relative group cursor-pointer backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Vibrant Top Glow on Hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out`} />
              
              <motion.div 
                className="mb-8 inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                whileHover={{ rotateZ: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10 drop-shadow-md">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed relative z-10 font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background radial gradient sweeps */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 blur-[150px] rounded-full pointer-events-none translate-x-[50%] -translate-y-[50%]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none -translate-x-[50%] translate-y-[50%]" />
    </section>
  );
}
