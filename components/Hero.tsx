"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation} from "framer-motion";
import * as THREE from "three";
import Link from "next/link";

// ─── Three.js woven particle canvas (light-theme, brand colours) ─────────────
function WovenCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const PARTICLE_COUNT = 38000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const sourcePositions = torusKnot.attributes.position;

    // Brand palette: orange, amber, navy, coral, warm gold
    const brandColors = [
      new THREE.Color("#e85d1e"),
      new THREE.Color("#ff9a5c"),
      new THREE.Color("#f5a623"),
      new THREE.Color("#1a1f3c"),
      new THREE.Color("#3b6bda"),
      new THREE.Color("#ff6b35"),
      new THREE.Color("#ffb347"),
      new THREE.Color("#d4450f"),
      new THREE.Color("#ffd166"),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const vi = i % sourcePositions.count;
      const x = sourcePositions.getX(vi);
      const y = sourcePositions.getY(vi);
      const z = sourcePositions.getZ(vi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const col = brandColors[Math.floor(Math.random() * brandColors.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.020,
      vertexColors: true,
      blending: THREE.NormalBlending,
      transparent: true,
      opacity: 0.80,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      renderer.domElement.style.pointerEvents = "none";
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        renderer.domElement.style.pointerEvents = "auto";
      }, 150);
    };
    window.addEventListener("wheel", handleScroll, { capture: true, passive: true });
    window.addEventListener("touchmove", handleScroll, { capture: true, passive: true });

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);
      const currentPos = new THREE.Vector3();
      const originalPos = new THREE.Vector3();
      const velocity = new THREE.Vector3();
      const direction = new THREE.Vector3();
      const returnForce = new THREE.Vector3();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

        currentPos.set(positions[ix], positions[iy], positions[iz]);
        originalPos.set(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
        velocity.set(velocities[ix], velocities[iy], velocities[iz]);

        const dist = currentPos.distanceTo(mouseWorld);
        if (dist < 1.5) {
          const force = (1.5 - dist) * 0.01;
          direction.subVectors(currentPos, mouseWorld).normalize();
          velocity.addScaledVector(direction, force);
        }

        returnForce.subVectors(originalPos, currentPos).multiplyScalar(0.001);
        velocity.add(returnForce);
        velocity.multiplyScalar(0.95);

        positions[ix] += velocity.x;
        positions[iy] += velocity.y;
        positions[iz] += velocity.z;
        velocities[ix] = velocity.x;
        velocities[iy] = velocity.y;
        velocities[iz] = velocity.z;
      }

      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = elapsed * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(scrollTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("wheel", handleScroll, { capture: true });
      window.removeEventListener("touchmove", handleScroll, { capture: true });
      if (mountRef.current?.contains(renderer.domElement))
        mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}

// ─── Premium CTA Button ───────────────────────────────────────────────────────

function PremiumCTAButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/analyze">
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        style={{
          position: "relative",
          padding: "16px 40px",
          background: "linear-gradient(135deg, #e85d1e 0%, #ff7c3a 60%, #f5a623 100%)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          border: "none",
          borderRadius: 99,
          cursor: "pointer",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 20px 50px rgba(232,93,30,0.55), 0 0 0 1px rgba(255,255,255,0.15) inset"
            : "0 10px 32px rgba(232,93,30,0.38), 0 0 0 1px rgba(255,255,255,0.1) inset",
        }}
      >
        {/* Shimmer */}
        <motion.div
          animate={hovered ? { x: ["-150%", "200%"] } : { x: "-150%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
            transform: "skewX(-20deg)",
            pointerEvents: "none",
          }}
        />

        {/* Glow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Text */}
        <span
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          Upload CV here
          <motion.span
            animate={{ x: hovered ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{ fontSize: 16 }}
          >
            →
          </motion.span>
        </span>
      </motion.button>
    </Link>
  );
}

// ─── Ghost / Outline secondary button ────────────────────────────────────────
function OutlineButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        position: "relative",
        padding: "15px 32px",
        background: hovered ? "rgba(26,31,60,0.05)" : "transparent",
        color: "#1a1f3c",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.06em",
        border: "1.5px solid rgba(26,31,60,0.2)",
        borderRadius: 99,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        transition: "background 0.2s, border-color 0.2s",
        borderColor: hovered ? "rgba(26,31,60,0.4)" : "rgba(26,31,60,0.2)",
      }}
    >
      <span style={{ fontSize: 16 }}>▶</span>
      {children}
    </motion.button>
  );
}

// ─── Floating stat chips ──────────────────────────────────────────────────────
function FloatingChip({
  label, value, delay, className
}: { label: string; value: string; delay: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
      style={{
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(232,93,30,0.12)",
        borderRadius: 14,
        padding: "10px 16px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 800, color: "#e85d1e" }}>{value}</span>
      <span style={{ fontSize: 11, color: "#8a8fa8", fontWeight: 500 }}>{label}</span>
    </motion.div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function Hero() {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.055 + 0.35,
        duration: 0.9,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }));
    buttonControls.start({
      opacity: 1,
      y: 0,
      transition: { delay: 1.3, duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] },
    });
  }, [textControls, buttonControls]);

  const words = ["Land more", "interviews."];

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      aria-label="Hero"
      style={{
        background: "linear-gradient(150deg, #ffffff 0%, #fff8f4 45%, #fff2e8 100%)",
      }}
    >
      {/* Particle canvas */}
      <WovenCanvas />

      {/* Ambient background glows */}
      <div
        className="absolute pointer-events-none z-1"
        style={{
          top: "-10%",
          right: "-5%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(ellipse at center, rgba(232,93,30,0.10) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute pointer-events-none z-1"
        style={{
          bottom: "5%",
          left: "-8%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(ellipse at center, rgba(26,31,60,0.055) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute pointer-events-none z-1"
        style={{
          top: "30%",
          left: "20%",
          width: 340,
          height: 340,
          background:
            "radial-gradient(ellipse at center, rgba(245,166,35,0.08) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />

      {/* Bottom dissolve */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: 200,
          background: "linear-gradient(to top, #fff8f4, transparent)",
        }}
      />

      

      {/* Left floating chips */}
      <FloatingChip
        value="2.4k+"
        label="Resumes scored today"
        delay={2.0}
        className="absolute left-6 top-[38%] hidden lg:flex z-20"
      />
      <FloatingChip
        value="91%"
        label="Avg. ATS pass rate"
        delay={2.2}
        className="absolute left-6 top-[52%] hidden lg:flex z-20"
      />

      {/* Main content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(232,93,30,0.08)",
            border: "1px solid rgba(232,93,30,0.22)",
            color: "#c44d10",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 16px",
            borderRadius: 99,
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: "#e85d1e",
              borderRadius: "50%",
              display: "inline-block",
              animation: "pulse 1.8s ease-in-out infinite",
            }}
          />
          AI-Powered Resume Scoring
        </motion.div>

        {/* Headline — word by word */}
        <h1
          className="font-black tracking-tighter leading-[1.06]"
          style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            color: "#1a1f3c",
            marginBottom: 20,
          }}
          aria-label={words.join(" ")}
        >
          {words.map((word, wi) => (
            <span key={wi} style={{ display: "block" }}>
              {word.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  custom={wi * 8 + ci}
                  initial={{ opacity: 0, y: 40 }}
                  animate={textControls}
                  style={{
                    display: "inline-block",
                    // "interviews." gets the orange gradient
                    ...(wi === 1
                      ? {
                          background: "linear-gradient(135deg, #e85d1e 0%, #ff9a5c 50%, #f5a623 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : {}),
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Underline accent */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.7, ease: [0.22, 0.68, 0, 1.2] }}
          style={{
            width: 160,
            height: 3,
            background: "linear-gradient(90deg, #e85d1e, #f5a623)",
            borderRadius: 99,
            marginBottom: 24,
            transformOrigin: "left",
          }}
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            color: "#5a6080",
            maxWidth: 440,
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          Upload your resume and get an{" "}
          <strong style={{ color: "#1a1f3c", fontWeight: 700 }}>instant AI score</strong>{" "}
          with detailed feedback — tailored to pass ATS and land the roles you deserve.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={buttonControls}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}
        >
          <PremiumCTAButton />
          <Link href="/#how-it-works">
  <OutlineButton>See how it works</OutlineButton>
</Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Avatar stack */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {[
              { initials: "RK", bg: "#e85d1e" },
              { initials: "PS", bg: "#1a1f3c" },
              { initials: "AN", bg: "#f5a623" },
              { initials: "MJ", bg: "#3b6bda" },
              { initials: "SK", bg: "#c44d10" },
            ].map(({ initials, bg }, i) => (
              <div
                key={initials}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: bg,
                  border: "2.5px solid #fff",
                  marginLeft: i === 0 ? 0 : -10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 800,
                  color: "#fff",
                  zIndex: 5 - i,
                  position: "relative",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {initials}
              </div>
            ))}
          </div>

          {/* Stars + text */}
          <div>
            <div style={{ color: "#f5a623", fontSize: 13, letterSpacing: 2, marginBottom: 1 }}>
              ★★★★★
            </div>
            <div style={{ fontSize: 12, color: "#8a8fa8" }}>
              <strong style={{ color: "#1a1f3c" }}>2,400+</strong> job seekers scored this week
            </div>
          </div>

          {/* Separator */}
          <div
            style={{
              width: 1,
              height: 28,
              background: "rgba(26,31,60,0.12)",
            }}
          />

          {/* Trust badge */}
          <div
            style={{
              fontSize: 12,
              color: "#8a8fa8",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ color: "#22c55e", fontSize: 14 }}>✓</span>
             sign-up needed · Free forever
          </div>
        </motion.div>
      </div>

      {/* Pulse keyframe for the badge dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}