"use client";

import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";


// ─── Types ────────────────────────────────────────────────────────
type Stat = { label: string; end: number; suffix: string; decimal?: number; dur: number };

// ─── Ambient Three.js particle field (softer than hero) ──────────
function AmbientCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const isMobile = window.innerWidth < 768;

    renderer.setPixelRatio(
    isMobile
    ? Math.min(window.devicePixelRatio, 1.2)
    : Math.min(window.devicePixelRatio, 1.8)
);

    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const resize = () => {
      const w = mountRef.current?.offsetWidth ?? window.innerWidth;
      const h = mountRef.current?.offsetHeight ?? window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const isLowPower = navigator.hardwareConcurrency <= 4;

const COUNT = isMobile
  ? (isLowPower ? 2500 : 3500)
  : (isLowPower ? 6000 : 9000);
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);

    const palette = [
      new THREE.Color("#e85d1e"),
      new THREE.Color("#ff9a5c"),
      new THREE.Color("#f5a623"),
      new THREE.Color("#1a1f3c"),
      new THREE.Color("#3b6bda"),
      new THREE.Color("#ffd166"),
      new THREE.Color("#d4450f"),
    ];

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);

    const clock = new THREE.Clock();
    let rafId: number;
let isVisible = true;

const observer = new IntersectionObserver(
  ([entry]) => {
    isVisible = entry.isIntersecting;
  },
  { threshold: 0.1 }
);

if (mountRef.current) observer.observe(mountRef.current);

const tick = () => {
  rafId = requestAnimationFrame(tick);

  if (!isVisible) return; 

  const t = clock.getElapsedTime();
  pts.rotation.y = t * 0.012 + mouse.x * 0.03;
  pts.rotation.x = mouse.y * 0.02;

  renderer.render(scene, camera);
};

tick();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      const mount = mountRef.current;
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

// ─── Animated counter hook ────────────────────────────────────────
function useCounter(end: number, dur: number, decimal?: number, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(ease(p) * end);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end, dur, decimal]);
  return decimal ? val.toFixed(decimal) : Math.round(val);
}

// ─── Stat chip ────────────────────────────────────────────────────
function StatChip({ stat, active }: { stat: Stat; active: boolean }) {
  const val = useCounter(stat.end, stat.dur, stat.decimal, active);
  return (
    <div className="flex-1 py-8 px-6 text-center border-r last:border-r-0"
      style={{ borderColor: "rgba(26,31,60,0.07)" }}>
      <div className="text-4xl font-black tracking-tight mb-1"
        style={{
          background: "linear-gradient(135deg,#e85d1e,#f5a623)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
        }}>
        {val}{stat.suffix}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#8a8fa8" }}>
        {stat.label}
      </div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────
type CardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
  tagLabel: string;
  lineGradient: string;
  num: string;
  lifted?: boolean;
  badge?: string;
  delay: number;
};

const FeatureCard = React.memo(function FeatureCard({
  title, description, icon, glowColor, accentColor, accentBg,
  accentText, tagLabel, lineGradient, num, lifted, badge, delay,
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);

  const startShimmer = () => {
    hoveredRef.current = true;
    const step = () => {
      if (!hoveredRef.current) return;
      setAngle(a => (a + 0.8) % 360);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };
  const stopShimmer = () => {
    hoveredRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: 12 }}
      whileInView={{ opacity: 1, y: lifted ? -14 : 0, rotateY: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 0.68, 0, 1.2] }}
      whileHover={{
        y: lifted ? -24 : -10,
        scale: 1.015,
        boxShadow: "0 28px 72px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
      onHoverStart={() => { setHovered(true); startShimmer(); }}
      onHoverEnd={() => { setHovered(false); stopShimmer(); }}
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(18px)",
        border: lifted ? "1.5px solid rgba(232,93,30,0.22)" : "1px solid rgba(26,31,60,0.10)",
        borderRadius: 28,
        padding: "40px 32px 36px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 28,
        background: `radial-gradient(circle at 40% 30%, ${glowColor} 0%, transparent 65%)`,
        opacity: hovered ? 1 : 0, transition: "opacity .5s ease", pointerEvents: "none",
      }} />

      {/* Conic shimmer border */}
      <div style={{
        position: "absolute", inset: -1, borderRadius: 29,
        background: `conic-gradient(from ${angle}deg, transparent 60%, rgba(232,93,30,0.32) 80%, transparent 100%)`,
        opacity: hovered ? 1 : 0, transition: "opacity .3s", pointerEvents: "none",
      }} />

      {/* Sliding bottom line */}
      <motion.div animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1.2] }}
        style={{
          position: "absolute", bottom: 0, left: 0, height: 3,
          background: lineGradient, borderRadius: 99, zIndex: 3,
        }} />

      {/* Number watermark */}
      <span style={{
        position: "absolute", top: 24, right: 24, zIndex: 2,
        fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1,
        color: hovered ? "rgba(26,31,60,0.06)" : "rgba(26,31,60,0.035)",
        transition: "color .3s", userSelect: "none",
      }}>
        {num}
      </span>

      {/* Badge */}
      {badge && (
        <div style={{
          position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg,#e85d1e,#f5a623)", color: "#fff",
          fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase",
          padding: "4px 12px", borderRadius: 99, zIndex: 5, whiteSpace: "nowrap",
          boxShadow: "0 4px 14px rgba(232,93,30,.3)",
        }}>
          ★ {badge}
        </div>
      )}

      {/* Icon */}
      <motion.div
        animate={hovered ? { rotate: 8, scale: 1.12 } : { rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          position: "relative", zIndex: 2,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 62, height: 62, borderRadius: 18,
          marginBottom: 28, marginTop: badge ? 44 : 0,
          border: `1px solid ${accentBg}`,
          background: `${accentBg.replace('0.08', '0.07')}`,
        }}
      >
        {icon}
      </motion.div>

      {/* Text */}
      <h3 style={{
        position: "relative", zIndex: 2,
        fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em",
        color: "#1a1f3c", marginBottom: 12, lineHeight: 1.2,
      }}>
        {title}
      </h3>
      <p style={{
        position: "relative", zIndex: 2,
        fontSize: 14.5, color: "#5a6080", lineHeight: 1.75, fontWeight: 500,
      }}>
        {description}
      </p>

      {/* Tag pill */}
      <motion.span
        animate={{ x: hovered ? 5 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          position: "relative", zIndex: 2,
          display: "inline-flex", alignItems: "center", gap: 5,
          marginTop: 24, padding: "5px 12px", borderRadius: 99,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          background: accentBg, color: accentText,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <circle cx="5" cy="5" r="4" stroke={accentColor} strokeWidth="1.5"/>
          <polyline points="3,5 4.5,6.5 7,3.5" stroke={accentColor} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {tagLabel}
      </motion.span>
    </motion.div>
  );
});

// ─── Main export ──────────────────────────────────────────────────
export default function Features() {
  const textControls = useAnimation();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textControls.start((i) => ({
      opacity: 1, y: 0,
      transition: {
        delay: i * 0.045 + 0.2,
        duration: 0.6,
        ease: [0.22, 0.68, 0, 1.2],
      },
    }));
  }, [textControls]);

  // Stats counter trigger
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const headingWords = ["Powerful", "Features"];

  const features: CardProps[] = [
    {
      title: "ATS Score Analysis",
      description: "Get an instant score based on industry-standard Applicant Tracking Systems. Know exactly where your resume stands before it ever reaches a recruiter.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polyline points="4,20 10,12 14,16 18,8 24,10" stroke="#e85d1e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="24" cy="10" r="2.5" fill="#e85d1e" opacity=".3"/>
          <rect x="3" y="22" width="22" height="2" rx="1" fill="#e85d1e" opacity=".18"/>
        </svg>
      ),
      glowColor: "rgba(232,93,30,0.12)",
      accentColor: "#e85d1e",
      accentBg: "rgba(232,93,30,0.08)",
      accentText: "#c44d10",
      tagLabel: "Instant results",
      lineGradient: "linear-gradient(90deg,#e85d1e,#ff9a5c)",
      num: "01",
      delay: 0.1,
    },
    {
      title: "Role-Based Suggestions",
      description: "Tailor your resume for specific job titles with AI-driven recommendations that match what recruiters at top companies are actively searching for.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="9" r="4.5" stroke="#3b6bda" strokeWidth="2"/>
          <path d="M5 23c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#3b6bda" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 11l2.5 2.5-2.5 2.5" stroke="#3b6bda" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
        </svg>
      ),
      glowColor: "rgba(59,107,218,0.12)",
      accentColor: "#3b6bda",
      accentBg: "rgba(59,107,218,0.08)",
      accentText: "#1a4da8",
      tagLabel: "AI-powered",
      lineGradient: "linear-gradient(90deg,#3b6bda,#6b9aff)",
      num: "02",
      lifted: true,
      badge: "Most Loved",
      delay: 0.22,
    },
    {
      title: "Keyword Optimisation",
      description: "Discover missing keywords and high-value phrases from job descriptions to significantly boost your callback rate and visibility in recruiter searches.",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="7"    width="20" height="3" rx="1.5" fill="#f5a623" opacity=".25"/>
          <rect x="4" y="12.5" width="14" height="3" rx="1.5" fill="#f5a623" opacity=".5"/>
          <rect x="4" y="18"   width="17" height="3" rx="1.5" fill="#f5a623"/>
          <circle cx="22" cy="19.5" r="3.5" stroke="#f5a623" strokeWidth="1.8"/>
          <line x1="24.5" y1="22" x2="27" y2="24.5" stroke="#f5a623" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      glowColor: "rgba(245,166,35,0.13)",
      accentColor: "#f5a623",
      accentBg: "rgba(245,166,35,0.10)",
      accentText: "#9a6600",
      tagLabel: "Boosts callbacks",
      lineGradient: "linear-gradient(90deg,#f5a623,#ffd166)",
      num: "03",
      delay: 0.34,
    },
  ];

  const stats: Stat[] = [
    { label: "ATS Pass Rate",       end: 91,  suffix: "%",  dur: 1600 },
    { label: "Resumes Scored",      end: 2400,suffix: "+",  dur: 2000 },
    { label: "Avg. Analysis Time",  end: 8,   suffix: "s",  dur: 1200 },
    { label: "Callback Increase",   end: 3.4, suffix: "x",  decimal: 1, dur: 1400 },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #ffffff 0%, #fff8f4 50%, #fff2e8 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Three.js ambient field */}
      <AmbientCanvas />

      {/* Ambient CSS glows */}
      <div className="absolute pointer-events-none" style={{ top: "-8%", right: "-4%", width: 560, height: 560, background: "radial-gradient(ellipse at center,rgba(232,93,30,0.09) 0%,transparent 65%)", borderRadius: "50%" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "0%", left: "-8%", width: 480, height: 480, background: "radial-gradient(ellipse at center,rgba(26,31,60,0.055) 0%,transparent 65%)", borderRadius: "50%" }} />
      <div className="absolute pointer-events-none" style={{ top: "35%", left: "22%", width: 320, height: 320, background: "radial-gradient(ellipse at center,rgba(245,166,35,0.07) 0%,transparent 65%)", borderRadius: "50%" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-28">

        {/* ── Heading block ── */}
        <div className="mb-24">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(232,93,30,0.08)", border: "1px solid rgba(232,93,30,0.22)",
              color: "#c44d10", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "6px 16px", borderRadius: 99, marginBottom: 28,
            }}
          >
            <span style={{
              width: 7, height: 7, background: "#e85d1e", borderRadius: "50%",
              display: "inline-block",
              animation: "pulse 1.8s ease-in-out infinite",
            }} />
            What we offer
          </motion.div>

          {/* Character-by-character headline */}
          <h2
            className="font-black tracking-tighter"
            style={{ fontSize: "clamp(3rem,6vw,5rem)", lineHeight: 1.05, marginBottom: 0 }}
            aria-label={headingWords.join(" ")}
          >
            {headingWords.map((word, wi) => (
              <span key={wi} style={{ display: "inline-block", marginRight: 10 }}>
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    custom={wi * 10 + ci}
                    initial={{ opacity: 0, y: 50, rotate: 5 }}
                    animate={textControls}
                    style={{
                      display: "inline-block",
                      ...(wi === 1
                        ? {
                            background: "linear-gradient(135deg,#e85d1e 0%,#ff9a5c 50%,#f5a623 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : { color: "#1a1f3c" }),
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </h2>

          {/* Underline accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 0.68, 0, 1.2] }}
            style={{
              width: 160, height: 3,
              background: "linear-gradient(90deg,#e85d1e,#f5a623)",
              borderRadius: 99, margin: "20px 0 28px",
              transformOrigin: "left",
            }}
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
            style={{
              fontSize: "clamp(1rem,1.6vw,1.1rem)", color: "#5a6080",
              maxWidth: 480, lineHeight: 1.75, fontWeight: 500,
            }}
          >
            Everything you need to bypass the algorithms and get your resume into the hands of{" "}
            <strong style={{ color: "#1a1f3c", fontWeight: 700 }}>real humans.</strong>
          </motion.p>
        </div>

        {/* ── Feature cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 28,
            perspective: "1200px",
            alignItems: "start",
          }}
          className="feat-grid"
        >
          {features.map((f) => (
            <FeatureCard key={f.num} {...f} />
          ))}
        </div>

        {/* ── Stats strip ── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          style={{
            display: "flex",
            marginTop: 64,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(26,31,60,0.08)",
            borderRadius: 24,
            overflow: "hidden",
          }}
          className="feat-stats"
        >
          {stats.map((s) => (
            <StatChip key={s.label} stat={s} active={statsVisible} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}