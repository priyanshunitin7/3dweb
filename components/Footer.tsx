"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(150deg, #ffffff 0%, #fff8f4 50%, #fff2e8 100%)",
        
      }}
    >
      {/* Ambient glow (same as other sections) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          right: "-10%",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(232,93,30,0.10), transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%",
          left: "-10%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(26,31,60,0.06), transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="CVDekho"
              width={120}
              height={40}
              style={{ height: 40, width: "auto" }}
            />
          </Link>

          {/* Links (minimal) */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/#features"
              className="text-[#5a6080] hover:text-[#1a1f3c] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-[#5a6080] hover:text-[#1a1f3c] transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-10"
          style={{
            height: 1,
            background: "rgba(26,31,60,0.08)",
          }}
        />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          
          {/* Copyright */}
          <p className="text-[#8a8fa8] font-medium">
            © {new Date().getFullYear()} CVDekho. All rights reserved.
          </p>

          {/* Optional micro text */}
          <p className="text-[#8a8fa8] text-xs">
            Built to help you land more interviews.
          </p>
        </div>
      </div>
    </footer>
  );
}