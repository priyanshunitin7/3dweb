"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ─── Brand tokens (exact match with Hero.tsx) ─────────────────────────────────
const B = {
  orange:     "#e85d1e",
  orangeHot:  "#ff7c3a",
  amber:      "#f5a623",
  navy:       "#1a1f3c",
  navyMid:    "#3b6bda",
  coral:      "#d4450f",
  muted:      "#5a6080",
  faint:      "#8a8fa8",
  bgBase:     "#ffffff",
  bgWarm:     "#fff8f4",
  bgDeep:     "#fff2e8",
  green:      "#22c55e",
  greenDark:  "#16a34a",
  red:        "#ef4444",
  yellow:     "#f59e0b",
};

const gradOrange = `linear-gradient(135deg, ${B.orange} 0%, ${B.orangeHot} 60%, ${B.amber} 100%)`;
const gradBg     = `linear-gradient(150deg, ${B.bgBase} 0%, ${B.bgWarm} 45%, ${B.bgDeep} 100%)`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const KEYWORDS = [
  { word: "React",      matched: true  },
  { word: "TypeScript", matched: true  },
  { word: "Node.js",    matched: true  },
  { word: "REST API",   matched: true  },
  { word: "GraphQL",    matched: false },
  { word: "Docker",     matched: false },
  { word: "CI/CD",      matched: true  },
  { word: "Testing",    matched: true  },
  { word: "Agile",      matched: false },
  { word: "AWS",        matched: false },
];

const SECTIONS = [
  { label: "Work Experience", score: 92, color: B.green,  feedback: "Strong impact verbs and quantified achievements. Excellent." },
  { label: "Skills",          score: 78, color: B.yellow, feedback: "Add Docker, GraphQL, and AWS to better match the JD." },
  { label: "Education",       score: 95, color: B.green,  feedback: "Well-formatted and clearly presented." },
  { label: "Summary",         score: 61, color: B.red,    feedback: "Too generic. Tailor it directly to the target role." },
  { label: "Projects",        score: 85, color: B.green,  feedback: "Good detail. Consider adding live links." },
];

const SUGGESTIONS = [
  { icon: "✦", title: "Tailor your summary",   body: 'Replace your generic objective with a 2-line statement targeting "{role}" specifically.',           accent: B.orange    },
  { icon: "✦", title: "Add missing keywords",  body: "GraphQL, Docker, and AWS appear in 80%+ of similar job listings — add them if applicable.",         accent: B.coral     },
  { icon: "✦", title: "Quantify more",         body: "Your Projects section lacks metrics. Add numbers: users, performance gains, load time reductions.",  accent: B.navyMid   },
  { icon: "✦", title: "One-page format",       body: "Your resume is 2 pages. Most ATS systems prefer a single page for < 5 years of experience.",        accent: B.amber     },
];

// ─── Background ambient layer ─────────────────────────────────────────────────
function AmbientBg() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Top-right warm orb — mirrors Hero */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.10, 0.16, 0.10] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "-12%", right: "-8%", width: 640, height: 640,
          background: `radial-gradient(ellipse, rgba(232,93,30,0.22) 0%, transparent 65%)`, borderRadius: "50%" }}
      />
      {/* Bottom-left navy orb */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.06, 0.12, 0.06] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        style={{ position: "absolute", bottom: "-8%", left: "-6%", width: 500, height: 500,
          background: `radial-gradient(ellipse, rgba(26,31,60,0.09) 0%, transparent 65%)`, borderRadius: "50%" }}
      />
      {/* Center amber glow */}
      <motion.div
        animate={{ scale: [1, 1.14, 1], opacity: [0.05, 0.10, 0.05] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        style={{ position: "absolute", top: "35%", left: "22%", width: 400, height: 400,
          background: `radial-gradient(ellipse, rgba(245,166,35,0.13) 0%, transparent 65%)`, borderRadius: "50%" }}
      />
      {/* Subtle dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(rgba(232,93,30,0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r    = 80;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? B.green : score >= 60 ? B.yellow : B.red;
  const label = score >= 80 ? "Strong" : score >= 60 ? "Good" : "Needs work";

  return (
    <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
      <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={100} cy={100} r={r} fill="none" stroke="rgba(26,31,60,0.07)" strokeWidth={14} />
        <motion.circle
          cx={100} cy={100} r={r} fill="none" stroke={color}
          strokeWidth={14} strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 10px ${color}88)` }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
          style={{ fontSize: 52, fontWeight: 900, color: B.navy, lineHeight: 1, letterSpacing: "-0.03em" }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: 12, color: B.faint, fontWeight: 600 }}>/ 100</span>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          style={{ fontSize: 11, fontWeight: 800, color, textTransform: "uppercase",
            letterSpacing: "0.08em", marginTop: 3 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
}

// ─── Section bar (expandable) ─────────────────────────────────────────────────
function SectionBar({ label, score, color, feedback, delay }: {
  label: string; score: number; color: string; feedback: string; delay: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{ marginBottom: 10 }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer", padding: "13px 16px", borderRadius: 14,
          background: "rgba(255,255,255,0.72)",
          border: `1px solid ${open ? `${B.orange}28` : "rgba(26,31,60,0.07)"}`,
          backdropFilter: "blur(10px)",
          transition: "border-color 0.2s, background 0.2s",
          boxShadow: open ? `0 4px 20px rgba(232,93,30,0.07)` : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: B.navy }}>{label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 800, color,
              background: `${color}14`, padding: "2px 10px", borderRadius: 99,
              border: `1px solid ${color}28`,
            }}>
              {score}%
            </span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ color: B.faint, fontSize: 10, display: "inline-block" }}
            >
              ▼
            </motion.span>
          </div>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: "rgba(26,31,60,0.07)", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.1, ease: [0.34, 1.56, 0.64, 1], delay: delay + 0.2 }}
            style={{ height: "100%", borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}55` }}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              style={{ fontSize: 12, color: B.muted, lineHeight: 1.55, overflow: "hidden" }}
            >
              {feedback}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Scan animation (analyzing state) ────────────────────────────────────────
function ScanDoc() {
  return (
    <div style={{
      position: "relative", width: 130, height: 162, margin: "0 auto 36px",
      background: "rgba(255,255,255,0.80)", backdropFilter: "blur(12px)",
      border: `1.5px solid rgba(232,93,30,0.22)`, borderRadius: 18, overflow: "hidden",
      boxShadow: "0 20px 60px rgba(232,93,30,0.12)",
    }}>
      {/* Corner accents */}
      {[
        { top: 0, left: 0,   borderTop: `2px solid ${B.orange}`, borderLeft: `2px solid ${B.orange}` },
        { top: 0, right: 0,  borderTop: `2px solid ${B.orange}`, borderRight: `2px solid ${B.orange}` },
        { bottom: 0, left: 0,  borderBottom: `2px solid ${B.orange}`, borderLeft: `2px solid ${B.orange}` },
        { bottom: 0, right: 0, borderBottom: `2px solid ${B.orange}`, borderRight: `2px solid ${B.orange}` },
      ].map((s, i) => (
        <motion.div key={i} animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
          style={{ position: "absolute", width: 14, height: 14, borderRadius: 2, ...s }}
        />
      ))}
      {/* Fake text lines */}
      {[18, 32, 46, 60, 74, 88, 102, 116, 130].map((top, i) => (
        <motion.div key={i}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.09, duration: 0.3}}
          style={{
            position: "absolute", top, left: 14,
            right: i % 3 === 2 ? 40 : 14,
            height: 5, borderRadius: 99,
            transformOrigin: "left",
            background: i === 0
              ? gradOrange
              : `rgba(26,31,60,${0.07 + (i % 3) * 0.04})`,
          }}
        />
      ))}
      {/* Scanner beam */}
      <motion.div
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{
          position: "absolute", left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, transparent, ${B.orange}, ${B.amber}, transparent)`,
          boxShadow: `0 0 14px ${B.orange}99`,
        }}
      />
    </div>
  );
}

// ─── Orbiting dots on dropzone ────────────────────────────────────────────────
function DropOrbit({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", inset: -20, pointerEvents: "none" }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: [i * 60, i * 60 + 360] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", inset: 0, transformOrigin: "center" }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  position: "absolute",
                  top: i % 2 === 0 ? "2%" : "50%",
                  left: i % 3 === 0 ? "2%" : i % 3 === 1 ? "50%" : "98%",
                  width: 7, height: 7, borderRadius: "50%",
                  background: i % 2 === 0 ? B.orange : B.amber,
                  boxShadow: `0 0 10px ${i % 2 === 0 ? B.orange : B.amber}`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Stage = "idle" | "ready" | "analyzing" | "results";

export default function AnalyzePage() {
    // ✅ ADD THIS BLOCK HERE
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  const [stage, setStage]       = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [role, setRole]         = useState("");
  const [dragging, setDragging] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext || "")) return;
    if (file.size > 10 * 1024 * 1024) return; // 10MB
    setFileName(file.name);
    setStage("ready");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setDragCount(0);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleAnalyze = () => {
    if (!role.trim()) {
  console.warn("Role is required");
  return;
}
    setStage("analyzing");
    setTimeout(() => setStage("results"), 3000);
  };

  const isDragging = dragCount > 0 || dragging;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${B.bgWarm}; }

        ::placeholder { color: ${B.faint}; }

        .kw-pill-match {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 99px; font-size: 12px;
          font-weight: 700; font-family: var(--font-geist-sans);
          background: rgba(34,197,94,0.10);
          border: 1px solid rgba(34,197,94,0.25);
          color: ${B.greenDark};
        }
        .kw-pill-miss {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 99px; font-size: 12px;
          font-weight: 700; font-family: var(--font-geist-sans);
          background: rgba(239,68,68,0.09);
          border: 1px solid rgba(239,68,68,0.22);
          color: #dc2626;
        }

        .sugg-card {
          padding: 22px; border-radius: 20px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(14px);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          cursor: default;
        }
        .sugg-card:hover { transform: translateY(-4px); }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes shimmer {
          from { transform: translateX(-120%) skewX(-20deg); }
          to   { transform: translateX(220%) skewX(-20deg); }
        }
      `}</style>

      <main style={{
        minHeight: "100vh",
        background: gradBg,
        fontFamily: "var(--font-geist-sans)",
        position: "relative",
      }}>
        <AmbientBg />

        {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100, height: 66,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 36px",
          background: "rgba(255,252,248,0.78)", backdropFilter: "blur(22px)",
          borderBottom: `1px solid rgba(232,93,30,0.09)`,
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image src="/logo.png" alt="logo" width={120} height={32} />
          </Link>

          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "9px 20px", borderRadius: 99,
            background: gradOrange, color: "#fff",
            fontWeight: 700, fontSize: 13, textDecoration: "none",
            boxShadow: `0 6px 24px rgba(232,93,30,0.35)`,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04) translateY(-1px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 10px 32px rgba(232,93,30,0.50)`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 24px rgba(232,93,30,0.35)`;
            }}
          >
            ← Home
          </Link>
        </nav>

        {/* ── PAGE CONTENT ───────────────────────────────────────────────── */}
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "68px 24px 100px", position: "relative", zIndex: 10 }}>
          <AnimatePresence mode="wait">

            {/* ════════════════════════════════════════════════════════════
                UPLOAD STAGE
            ════════════════════════════════════════════════════════════ */}
            {(stage === "idle" || stage === "ready") && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28, scale: 0.97 }}
                transition={{ duration: 0.55 }}
              >
                {/* Page header */}
                <div style={{ textAlign: "center", marginBottom: 52 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "rgba(232,93,30,0.08)",
                      border: `1px solid rgba(232,93,30,0.22)`,
                      color: B.coral, fontSize: 11, fontWeight: 800,
                      letterSpacing: "0.10em", textTransform: "uppercase",
                      padding: "6px 16px", borderRadius: 99, marginBottom: 22,
                    }}
                  >
                    <span style={{
                      width: 7, height: 7, background: B.orange, borderRadius: "50%",
                      display: "inline-block", animation: "pulse-dot 1.8s ease-in-out infinite",
                    }} />
                    AI-Powered ATS Analysis
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    style={{
                      fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                      fontWeight: 900, color: B.navy,
                      lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 16,
                    }}
                  >
                    Make your resume{" "}
                    <span style={{
                      background: gradOrange,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                      impossible
                    </span>{" "}
                    to ignore
                  </motion.h1>

                  {/* Underline — same as Hero */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 0.68, 0, 1.2] }}
                    style={{
                      width: 140, height: 3, background: `linear-gradient(90deg, ${B.orange}, ${B.amber})`,
                      borderRadius: 99, margin: "0 auto 20px", transformOrigin: "left",
                    }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: B.muted, fontSize: 16, fontWeight: 500, lineHeight: 1.65, maxWidth: 480, margin: "0 auto" }}
                  >
                    Get a detailed ATS breakdown, keyword analysis, and section-by-section feedback — tailored to your dream role.
                  </motion.p>
                </div>

                {/* ── Main card ── */}
                <motion.div
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  style={{
                    background: "rgba(255,255,255,0.78)",
                    backdropFilter: "blur(30px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    borderRadius: 32, padding: "36px 36px 40px",
                    boxShadow: `0 2px 0 rgba(255,255,255,0.9) inset, 0 40px 100px rgba(232,93,30,0.08), 0 8px 32px rgba(0,0,0,0.05)`,
                    position: "relative", overflow: "hidden",
                  }}
                >
                  {/* Decorative blobs inside card */}
                  <div style={{ position: "absolute", top: -70, right: -70, width: 240, height: 240, borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(232,93,30,0.09) 0%, transparent 68%)`, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 68%)`, pointerEvents: "none" }} />

                  {/* Role input */}
                  <div style={{ marginBottom: 26, position: "relative", zIndex: 2 }}>
                    <label style={{
                      display: "block", fontSize: 11, fontWeight: 800, color: B.orange,
                      letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 9,
                    }}>
                      Target Role
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        style={{
                          width: "100%", padding: "15px 18px 15px 46px",
                          borderRadius: 14,
                          border: `1.5px solid rgba(232,93,30,0.18)`,
                          fontSize: 15, fontFamily: "var(--font-geist-sans)",
                          fontWeight: 600, color: B.navy,
                          background: "rgba(255,248,244,0.70)",
                          outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = B.orange;
                          e.target.style.boxShadow = `0 0 0 4px rgba(232,93,30,0.10)`;
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = "rgba(232,93,30,0.18)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <span style={{
                        position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                        fontSize: 18,
                      }}>🎯</span>
                    </div>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDragEnter={e => {
  e.preventDefault();
  setDragging(true);
  setDragCount(c => c + 1);
}}

onDragLeave={() => {
  setDragCount(c => {
    const newCount = Math.max(0, c - 1);
    if (newCount === 0) setDragging(false);
    return newCount;
  });
}}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => stage !== "ready" && fileInputRef.current?.click()}
                    style={{
                      position: "relative",
                      border: `2px dashed ${isDragging ? B.orange : stage === "ready" ? B.green : "rgba(232,93,30,0.22)"}`,
                      borderRadius: 22, padding: "52px 24px", textAlign: "center",
                      cursor: stage === "ready" ? "default" : "pointer",
                      background: isDragging
                        ? "rgba(232,93,30,0.04)"
                        : stage === "ready"
                        ? "rgba(34,197,94,0.03)"
                        : "rgba(255,252,248,0.60)",
                      transition: "all 0.25s ease",
                      overflow: "hidden",
                    }}
                  >
                    <DropOrbit active={isDragging} />

                    <AnimatePresence mode="wait">
                      {stage === "idle" ? (
                        <motion.div key="idle"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                          <motion.div
                            animate={isDragging
                              ? { y: [-8, 8, -8], scale: 1.12 }
                              : { y: [0, -7, 0], scale: 1 }
                            }
                            transition={{ duration: isDragging ? 0.9 : 3.2, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                              width: 68, height: 68, borderRadius: 20,
                              background: isDragging ? gradOrange : `rgba(232,93,30,0.10)`,
                              border: isDragging ? "none" : `1.5px solid rgba(232,93,30,0.18)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              margin: "0 auto 18px", fontSize: 30,
                              boxShadow: isDragging ? `0 14px 40px rgba(232,93,30,0.40)` : "none",
                              transition: "all 0.3s",
                            }}
                          >
                            {isDragging ? "📂" : "📄"}
                          </motion.div>

                          <motion.h3
                            animate={{ color: isDragging ? B.orange : B.navy }}
                            style={{ fontSize: 19, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.02em" }}
                          >
                            {isDragging ? "Release to upload!" : "Drop your resume here"}
                          </motion.h3>
                          <p style={{ color: B.faint, fontSize: 13, marginBottom: 22 }}>
                            or{" "}
                            <span
                              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                              style={{ color: B.orange, fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}
                            >
                              browse your files
                            </span>
                          </p>
                          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                            {["PDF", "DOC", "DOCX"].map(fmt => (
                              <span key={fmt} style={{
                                padding: "4px 13px", borderRadius: 99,
                                background: "rgba(232,93,30,0.07)",
                                border: `1px solid rgba(232,93,30,0.16)`,
                                fontSize: 11, fontWeight: 800, color: B.coral, letterSpacing: "0.06em",
                              }}>
                                {fmt}
                              </span>
                            ))}
                            <span style={{
                              padding: "4px 13px", borderRadius: 99,
                              background: "rgba(26,31,60,0.05)",
                              border: "1px solid rgba(26,31,60,0.09)",
                              fontSize: 11, fontWeight: 600, color: B.faint,
                            }}>
                              Max 10 MB
                            </span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="ready"
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                        >
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{
                              width: 64, height: 64, borderRadius: 18,
                              background: `linear-gradient(135deg, ${B.green}, ${B.greenDark})`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              margin: "0 auto 16px", fontSize: 28,
                              boxShadow: `0 12px 36px rgba(34,197,94,0.38)`,
                            }}
                          >
                            ✓
                          </motion.div>
                          <h3 style={{ fontSize: 18, fontWeight: 900, color: B.navy, marginBottom: 5 }}>
                            {fileName}
                          </h3>
                          <p style={{ color: B.green, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                            Ready to analyse
                          </p>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setStage("idle");
                              setFileName("");
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            style={{
                              background: "none", border: "none",
                              color: B.faint, fontSize: 12, cursor: "pointer",
                              textDecoration: "underline", padding: 0,
                            }}
                          >
                            Remove & choose different file
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <input
                    ref={fileInputRef} type="file" accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />

                  {/* Analyse CTA */}
                  <AnimatePresence>
                    {stage === "ready" && (
                      <motion.div
                        key="cta"
                        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                        style={{ marginTop: 24 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleAnalyze}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          style={{
                            position: "relative", overflow: "hidden",
                            width: "100%", padding: "17px",
                            borderRadius: 16, background: gradOrange,
                            color: "#fff", border: "none",
                            fontFamily: "var(--font-geist-mono)",
                            fontWeight: 900, fontSize: 16, cursor: "pointer",
                            letterSpacing: "0.04em",
                            boxShadow: `0 14px 42px rgba(232,93,30,0.44), 0 2px 0 rgba(255,255,255,0.22) inset`,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                          }}
                        >
                          {/* shimmer sweep */}
                          <motion.div
                            animate={{ x: ["-120%", "220%"] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
                            style={{
                              position: "absolute", inset: 0,
                              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
                              transform: "skewX(-20deg)", pointerEvents: "none",
                            }}
                          />
                          <span style={{ position: "relative", zIndex: 1 }}>✦</span>
                          <span style={{ position: "relative", zIndex: 1 }}>Analyse My Resume</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                            style={{ position: "relative", zIndex: 1, fontSize: 18 }}
                          >
                            →
                          </motion.span>
                        </motion.button>
                        <p style={{ textAlign: "center", marginTop: 11, fontSize: 12, color: B.faint }}>
                          Takes ~3 seconds · Completely private · Never stored
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Trust row */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 36, flexWrap: "wrap" }}
                >
                  {[
                    { icon: "🔒", text: "100% Private" },
                    { icon: "⚡", text: "Instant Results" },
                    { icon: "🎯", text: "Role-tailored" },
                    { icon: "🆓", text: "Always Free" },
                  ].map(({ icon, text }) => (
                    <div key={text} style={{
                      display: "flex", alignItems: "center", gap: 7,
                      fontSize: 13, color: B.faint, fontWeight: 600,
                    }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      {text}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                ANALYZING STAGE
            ════════════════════════════════════════════════════════════ */}
            {stage === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", padding: "56px 0" }}
              >
                {/* Badge */}
                <motion.div
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(232,93,30,0.08)", border: `1px solid rgba(232,93,30,0.20)`,
                    color: B.coral, fontSize: 11, fontWeight: 800,
                    letterSpacing: "0.10em", textTransform: "uppercase",
                    padding: "6px 16px", borderRadius: 99, marginBottom: 36,
                  }}
                >
                  <span style={{
                    width: 6, height: 6, background: B.orange, borderRadius: "50%",
                    display: "inline-block", animation: "pulse-dot 1s ease-in-out infinite",
                  }} />
                  AI Analysing…
                </motion.div>

                <ScanDoc />

                <motion.h2
                  style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, color: B.navy, marginBottom: 10, letterSpacing: "-0.02em" }}
                >
                  Analysing for{" "}
                  <span style={{ background: gradOrange, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {role}
                  </span>
                </motion.h2>
                <p style={{ color: B.muted, fontSize: 15, marginBottom: 32 }}>
                  Scanning keywords, structure, and ATS compatibility…
                </p>

                {/* Bouncing dots */}
                <div style={{ display: "flex", justifyContent: "center", gap: 9, marginBottom: 40 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                      style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: i === 0 ? B.orange : i === 1 ? B.amber : B.coral,
                        boxShadow: `0 0 10px ${i === 0 ? B.orange : i === 1 ? B.amber : B.coral}88`,
                      }}
                    />
                  ))}
                </div>

                {/* Step labels */}
                <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
                  {["Parsing document", "Matching keywords", "Scoring sections"].map((s, i) => (
                    <motion.div key={s}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.55 }}
                      style={{ display: "flex", alignItems: "center", gap: 7,
                        fontSize: 13, color: B.muted, fontWeight: 600 }}
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
                        style={{ display: "inline-block", fontSize: 15, color: B.orange }}
                      >
                        ⟳
                      </motion.span>
                      {s}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ════════════════════════════════════════════════════════════
                RESULTS STAGE
            ════════════════════════════════════════════════════════════ */}
            {stage === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.55 }}
              >
                {/* Results header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "5px 16px", borderRadius: 99,
                      background: "rgba(34,197,94,0.10)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      fontSize: 12, fontWeight: 800, color: B.greenDark,
                      letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16,
                    }}
                  >
                    <span>✓</span> Analysis Complete
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{
                      fontSize: "clamp(1.8rem, 4vw, 2.9rem)",
                      fontWeight: 900, color: B.navy,
                      letterSpacing: "-0.03em", marginBottom: 12,
                    }}
                  >
                    Your results for{" "}
                    <span style={{ background: gradOrange, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {role}
                    </span>
                  </motion.h2>

                  {/* Underline accent */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                      width: 120, height: 3,
                      background: `linear-gradient(90deg, ${B.orange}, ${B.amber})`,
                      borderRadius: 99, margin: "0 auto", transformOrigin: "left",
                    }}
                  />
                </div>

                {/* ── Score hero card ── */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    background: "rgba(255,255,255,0.82)", backdropFilter: "blur(24px)",
                    border: `1.5px solid rgba(232,93,30,0.12)`, borderRadius: 28,
                    padding: "40px 36px", marginBottom: 22,
                    boxShadow: "0 24px 70px rgba(232,93,30,0.09), 0 4px 20px rgba(0,0,0,0.05)",
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 40, alignItems: "center",
                  }}
                >
                  <ScoreRing score={84} />
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: 24, color: B.navy, marginBottom: 8, letterSpacing: "-0.02em" }}>
                      Strong ATS Match
                    </h3>
                    <p style={{ color: B.muted, fontSize: 15, lineHeight: 1.65, marginBottom: 22 }}>
                      Your resume scores well for <strong style={{ color: B.navy }}>{role}</strong>. A few targeted improvements could push you into the top 10% of applicants.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {[
                        { label: "ATS Score", val: "84/100", color: B.green  },
                        { label: "Keywords",  val: "6/10",   color: B.yellow },
                        { label: "Format",    val: "Pass",   color: B.orange },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          padding: "10px 18px", borderRadius: 13,
                          background: "rgba(255,248,244,0.80)",
                          border: `1.5px solid ${stat.color}28`, textAlign: "center",
                        }}>
                          <div style={{ fontSize: 19, fontWeight: 900, color: stat.color, letterSpacing: "-0.02em" }}>
                            {stat.val}
                          </div>
                          <div style={{ fontSize: 10, color: B.faint, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Two-col grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 22 }}>

                  {/* Keywords */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 }}
                    style={{
                      background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)",
                      border: `1px solid rgba(232,93,30,0.09)`, borderRadius: 24,
                      padding: "26px 24px",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                      <h4 style={{ fontWeight: 900, fontSize: 16, color: B.navy, letterSpacing: "-0.01em" }}>
                        Keyword Match
                      </h4>
                      <span style={{
                        fontSize: 12, fontWeight: 800, color: B.yellow,
                        background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.28)",
                        padding: "3px 11px", borderRadius: 99,
                      }}>
                        6 / 10
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {KEYWORDS.map(({ word, matched }) => (
                        <span key={word} className={matched ? "kw-pill-match" : "kw-pill-miss"}>
                          {matched ? "✓" : "✕"} {word}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Section scores */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 }}
                    style={{
                      background: "rgba(255,255,255,0.82)", backdropFilter: "blur(20px)",
                      border: `1px solid rgba(232,93,30,0.09)`, borderRadius: 24,
                      padding: "26px 24px",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h4 style={{ fontWeight: 900, fontSize: 16, color: B.navy, letterSpacing: "-0.01em", marginBottom: 16 }}>
                      Section Breakdown
                    </h4>
                    {SECTIONS.map((s, i) => (
                      <SectionBar key={s.label} {...s} delay={0.38 + i * 0.08} />
                    ))}
                  </motion.div>
                </div>

                {/* ── Suggestions ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.48 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                    <h4 style={{ fontWeight: 900, fontSize: 18, color: B.navy, letterSpacing: "-0.02em" }}>
                      Improvement Suggestions
                    </h4>
                    <span style={{
                      padding: "3px 12px", borderRadius: 99, fontSize: 11, fontWeight: 800,
                      background: "rgba(232,93,30,0.09)", border: `1px solid rgba(232,93,30,0.20)`,
                      color: B.coral, letterSpacing: "0.06em",
                    }}>
                      {SUGGESTIONS.length} actions
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {SUGGESTIONS.map((s, i) => (
                      <motion.div
                        key={s.title}
                        className="sugg-card"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.52 + i * 0.09 }}
                        style={{
                          borderLeft: `4px solid ${s.accent}`,
                          border: `1.5px solid rgba(26,31,60,0.07)`,
                          borderLeftWidth: 4,
                          borderLeftColor: s.accent,
                          boxShadow: `0 4px 20px ${s.accent}0e`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `${s.accent}16`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, color: s.accent, flexShrink: 0, fontWeight: 800,
                          }}>
                            {s.icon}
                          </div>
                          <div>
                            <h5 style={{ fontWeight: 800, fontSize: 14, color: B.navy, marginBottom: 5, letterSpacing: "-0.01em" }}>
                              {s.title}
                            </h5>
                            <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.55 }}>
                              {s.body.replace("{role}", role)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Action buttons ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  style={{ textAlign: "center", marginTop: 48, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setStage("idle"); setFileName(""); setRole(""); }}
                    style={{
                      padding: "14px 36px", borderRadius: 99,
                      background: gradOrange, color: "#fff", border: "none",
                      fontFamily: "var(--font-geist-mono)",
                      fontWeight: 800, fontSize: 14, cursor: "pointer",
                      boxShadow: `0 10px 36px rgba(232,93,30,0.38)`,
                      display: "inline-flex", alignItems: "center", gap: 8,
                    }}
                  >
                    ↑ Analyse Another
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "13px 28px", borderRadius: 99,
                      background: "transparent", color: B.navy,
                      fontFamily: "var(--font-geist-sans)",
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                      border: `1.5px solid rgba(26,31,60,0.18)`,
                      display: "inline-flex", alignItems: "center", gap: 8,
                    }}
                  >
                    ↓ Download Report
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </>
  );
}