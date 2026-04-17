"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AmbientBackground({ opacity = 1 }: { opacity?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
if (!mountNode) return;

    // ── Scene & Camera ─────────────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    // ── Renderer ───────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent

    mountNode.appendChild(renderer.domElement);

    // ── Resize ─────────────────────────────────────────────────────
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // ── Particle Settings ──────────────────────────────────────────
    const isMobile = window.innerWidth < 768;

    const COUNT_LARGE = isMobile ? 120 : 200;
    const COUNT_SMALL = isMobile ? 700 : 1400;

    // 🎨 Balanced palette (visible on white UI)
    const palette = [
      new THREE.Color("#e85d1e"), // orange
      new THREE.Color("#ff7a2f"),
      new THREE.Color("#f59e0b"),
      new THREE.Color("#1a1f3c"), // navy (contrast)
      new THREE.Color("#2563eb"), // blue
      new THREE.Color("#d4450f"),
    ];

    // ── Helper to create particle cloud ────────────────────────────
    const createCloud = (count: number, rMin: number, rMax: number) => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = rMin + Math.random() * (rMax - rMin);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      return geo;
    };

    // ── Large soft particles ───────────────────────────────────────
    const geoLarge = createCloud(COUNT_LARGE, 2.5, 4.5);
    const matLarge = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const ptsLarge = new THREE.Points(geoLarge, matLarge);

    // ── Small crisp particles ──────────────────────────────────────
    const geoSmall = createCloud(COUNT_SMALL, 2.0, 5.0);
    const matSmall = new THREE.PointsMaterial({
      size: isMobile ? 0.06 : 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const ptsSmall = new THREE.Points(geoSmall, matSmall);

    scene.add(ptsLarge);
    scene.add(ptsSmall);

    // ── Interaction ────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);

    // ── Animation ──────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const t = clock.getElapsedTime();

      // Smooth parallax
      ptsLarge.rotation.y = t * 0.008 + mouseX * 0.1;
      ptsLarge.rotation.x = t * 0.004 + mouseY * 0.1;
      ptsLarge.position.y = -scrollY * 0.00015;

      ptsSmall.rotation.y = -t * 0.012 + mouseX * 0.15;
      ptsSmall.rotation.x = t * 0.006 + mouseY * 0.12;
      ptsSmall.position.y = -scrollY * 0.00025;

      renderer.render(scene, camera);
    };

    tick();

    // ── Cleanup ────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);

      if (mountNode.contains(renderer.domElement)) {
      mountNode.removeChild(renderer.domElement);
    }

      geoLarge.dispose();
      geoSmall.dispose();
      matLarge.dispose();
      matSmall.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}