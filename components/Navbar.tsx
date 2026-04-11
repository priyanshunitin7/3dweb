"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
      className="fixed top-8 left-0 right-0 z-50 w-full flex justify-center pointer-events-none px-4"
    >
      <div className="w-full max-w-6xl flex items-center justify-between p-3 px-6 rounded-full border border-white/5 bg-black/50 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-auto relative overflow-hidden group">
        
        {/* Light tracking sweep on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-in-out" />

        {/* Brand Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="w-8 h-8 rounded-[0.4rem] bg-gradient-to-br from-white to-neutral-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <span className="text-black font-black text-xs">CD</span>
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-white drop-shadow-sm">CvDekho</Link>
        </motion.div>
        
        {/* Animated Links Area */}
        <div className="hidden lg:block relative z-10">
          <NavLinks />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 relative z-10">
          <Link
            href="/lets-talk"
            className="hidden sm:inline-flex text-sm font-medium text-neutral-400 hover:text-white transition-colors relative group/link"
          >
            Let's Talk
            <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left duration-300" />
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/#get-started"
              className="relative overflow-hidden px-7 py-2.5 rounded-full text-sm font-bold text-black bg-white border border-white transition-all flex items-center gap-2 group/btn shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_5px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_30px_rgba(255,255,255,0.3)] hover:text-black"
            >
              Sign In
              <span className="group-hover/btn:-rotate-45 group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const links = [
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" }
  ];

  return (
    <div className="flex items-center gap-3">
      {links.map((link, i) => (
        <Link 
          key={i} 
          href={link.href}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="relative px-6 py-2.5 text-sm font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          {hoveredIndex === i && (
            <motion.div 
              layoutId="nav-highlight"
              className="absolute inset-0 bg-white/10 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10"
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            />
          )}
          {link.name}
        </Link>
      ))}
    </div>
  );
}
