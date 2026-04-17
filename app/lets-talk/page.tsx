"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function LetsTalk() {
  return (
    <main className="min-h-screen bg-[#fff8f4] text-[#1a1f3c] overflow-hidden">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Let us talk.
          </h1>

          <p className="text-sm text-[#5a6080] mb-10">
            Tell us what you need — we will get back to you
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs mb-2 text-[#5a6080] uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-sm outline-none focus:border-[#e85d1e] transition"
              />
            </div>

            <div>
              <label className="block text-xs mb-2 text-[#5a6080] uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-sm outline-none focus:border-[#e85d1e] transition"
              />
            </div>

            <div>
              <label className="block text-xs mb-2 text-[#5a6080] uppercase tracking-wide">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Write your message..."
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-sm outline-none focus:border-[#e85d1e] transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#1a1f3c] text-white text-sm font-medium hover:opacity-90 active:scale-[0.99] transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}