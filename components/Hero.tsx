"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import * as THREE from "three";

// ─── Three.js woven particle canvas ─────────────────────────────────────────
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
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // ── Particles ──
    const PARTICLE_COUNT = 40000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const sourcePositions = torusKnot.attributes.position;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
  const vi = i % sourcePositions.count;
  const x = sourcePositions.getX(vi);
  const y = sourcePositions.getY(vi);
  const z = sourcePositions.getZ(vi);

  positions[i * 3]     = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
  originalPositions[i * 3]     = x;
  originalPositions[i * 3 + 1] = y;
  originalPositions[i * 3 + 2] = z;

  // Full rainbow HSL — matches original woven light prompt
  const color = new THREE.Color();
  color.setHSL(Math.random(), 0.8, 0.65);
  colors[i * 3]     = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      blending: THREE.NormalBlending,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Pointer tracking ──
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── Scroll → disable pointer events briefly ──
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

    // ── Animation loop ──
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

    // ── Resize ──
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

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function Hero() {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.06 + 0.4,
        duration: 1.0,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }));
    buttonControls.start({
      opacity: 1,
      transition: { delay: 1.6, duration: 0.8 },
    });
  }, [textControls, buttonControls]);

  const headline = "Land more interviews.";

  return (
    <section
      className="relative w-full h-screen bg-transparent overflow-hidden"
      aria-label="Hero"
    >
      {/* Particle canvas */}
      <WovenCanvas />

      {/* Bottom dissolve into features section */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6">

        {/* Animated headline — letter by letter */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[1.1]"
          aria-label={headline}
        >
          {headline.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block mr-[0.25em] last:mr-0">
              {word.split("").map((char, ci) => (
                <motion.span
                  key={ci}
                  custom={wi * 6 + ci}
                  initial={{ opacity: 0, y: 40 }}
                  animate={textControls}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          custom={headline.length + 2}
          initial={{ opacity: 0, y: 20 }}
          animate={textControls}
          className="mt-6 text-base sm:text-lg text-white/40 max-w-md leading-relaxed"
        >
          
        </motion.p>

        {/* CTA button — your existing style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={buttonControls}
          className="mt-10"
          style={{ perspective: "1000px" }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              rotateX: 10,
              boxShadow:
                "0 28px 56px rgba(0,0,0,0.8), inset 0 2px 2px rgba(255,255,255,0.6), inset 0 -4px 10px rgba(0,0,0,0.9)",
            }}
            whileTap={{
              scale: 0.96,
              rotateX: 0,
              boxShadow: "0 4px 8px rgba(0,0,0,0.8), inset 0 2px 4px rgba(0,0,0,0.8)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group relative px-10 py-5 text-sm font-bold tracking-widest uppercase text-white
              bg-gradient-to-b from-white/20 to-white/5
              border border-white/20 rounded-full
              shadow-[0_15px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-2px_6px_rgba(0,0,0,0.8)]
              backdrop-blur-2xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3 drop-shadow-lg">
              Get started
              <span
                className="group-hover:translate-x-1 transition-transform duration-300"
                aria-hidden="true"
              >
                →
              </span>
            </span>
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}