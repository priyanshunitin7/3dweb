"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ─── Logo image (your actual CVDekho logo) ────────────────────────────────────
const LOGO_SRC = "/logo.png"; // Place your logo PNG in /public/logo.png
// If you want to use an inline base64, replace with:
// const LOGO_SRC = "data:image/jpeg;base64,/9j/4AAQ...";

// ─── Nav links config ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { name: "Features",     href: "/#features" },
  { name: "How It Works", href: "/#how-it-works" },
  
  { name: "Blog",         href: "/blog" },
];

// ─── Animated nav link with orange underline sweep ───────────────────────────
function NavLink({
  href,
  children,
  isScrolled,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "6px 14px",
        fontSize: 14,
        fontWeight: 600,
        color: isScrolled ? "#3a3f5c" : "#3a3f5c",
        textDecoration: "none",
        borderRadius: 8,
        transition: "color 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {/* Hover pill background */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            layoutId="nav-pill"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(232,93,30,0.07)",
              borderRadius: 8,
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>

      <span style={{ position: "relative" }}>
        {children}
        {/* Orange underline sweep */}
        <motion.span
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, #e85d1e, #f5a623)",
            borderRadius: 99,
            transformOrigin: "left",
            display: "block",
          }}
        />
      </span>
    </Link>
  );
}

// ─── Premium "Get Started" CTA button in navbar ────────────────────────────────
function NavCTA({ compact = false }: { compact?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <Link
        href="/#get-started"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: compact ? "9px 20px" : "10px 26px",
          background: "linear-gradient(135deg, #e85d1e 0%, #ff7c3a 60%, #f5a623 100%)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          textDecoration: "none",
          border: "none",
          borderRadius: 99,
          overflow: "hidden",
          boxShadow: hovered
            ? "0 12px 32px rgba(232,93,30,0.50), inset 0 1px 0 rgba(255,255,255,0.28)"
            : "0 6px 20px rgba(232,93,30,0.32), inset 0 1px 0 rgba(255,255,255,0.22)",
          transition: "box-shadow 0.25s ease",
          whiteSpace: "nowrap",
        }}
      >
        {/* Shimmer sweep */}
        <motion.div
          animate={hovered ? { x: ["−150%", "200%"] } : { x: "-150%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)",
            transform: "skewX(-20deg)",
            pointerEvents: "none",
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>Get Started</span>
        <motion.span
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ position: "relative", zIndex: 1, fontSize: 15 }}
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}

// ─── Mobile drawer menu ───────────────────────────────────────────────────────
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              background: "rgba(26,31,60,0.15)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
            style={{
              position: "fixed",
              top: 80,
              left: 16,
              right: 16,
              zIndex: 50,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(24px)",
              borderRadius: 20,
              border: "1px solid rgba(232,93,30,0.14)",
              boxShadow: "0 20px 60px rgba(26,31,60,0.14), 0 4px 16px rgba(0,0,0,0.06)",
              overflow: "hidden",
              padding: "12px 0 16px",
            }}
          >
            {/* Orange accent bar at top */}
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg, #e85d1e, #f5a623)",
                marginBottom: 12,
              }}
            />

            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 22px",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1a1f3c",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(232,93,30,0.05)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
                >
                  {link.name}
                  <span style={{ color: "#e85d1e", fontSize: 16 }}>→</span>
                </Link>
              </motion.div>
            ))}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(26,31,60,0.08)",
                margin: "8px 22px 14px",
              }}
            />

            {/* Mobile CTAs */}
            <div
              style={{
                padding: "0 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Link
                href="/sign-in"
                onClick={onClose}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "11px 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a1f3c",
                  textDecoration: "none",
                  border: "1.5px solid rgba(26,31,60,0.18)",
                  borderRadius: 99,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/#get-started"
                onClick={onClose}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px 0",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #e85d1e, #f5a623)",
                  borderRadius: 99,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  boxShadow: "0 6px 20px rgba(232,93,30,0.32)",
                }}
              >
                Get Started Free →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hamburger icon ───────────────────────────────────────────────────────────
function Hamburger({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: open ? "rgba(232,93,30,0.08)" : "rgba(26,31,60,0.05)",
        border: "1px solid",
        borderColor: open ? "rgba(232,93,30,0.22)" : "rgba(26,31,60,0.1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: 0,
        transition: "background 0.2s, border-color 0.2s",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={
            open
              ? i === 0
                ? { rotate: 45, y: 7, width: 18 }
                : i === 1
                ? { opacity: 0, scaleX: 0 }
                : { rotate: -45, y: -7, width: 18 }
              : { rotate: 0, y: 0, opacity: 1, scaleX: 1, width: i === 1 ? 12 : 18 }
          }
          transition={{ duration: 0.22, ease: "easeInOut" }}
          style={{
            display: "block",
            height: 2,
            background: open ? "#e85d1e" : "#1a1f3c",
            borderRadius: 99,
            transformOrigin: "center",
          }}
        />
      ))}
    </button>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navControls = useAnimation();
  const prevScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      // Scroll direction → hide on scroll down, show on scroll up
      if (y > prevScrollY.current && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      prevScrollY.current = y;

      setScrolled(y > 30);
      setScrollProgress(totalHeight > 0 ? Math.min(y / totalHeight, 1) : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    navControls.start({
      y: hidden ? -120 : 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, [hidden, navControls]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1, ...(!hidden && {}) }}
        transition={{ duration: 1.0, type: "spring", bounce: 0.25 }}
        style={{ position: "fixed", top: 20, left: 0, right: 0, zIndex: 50, pointerEvents: "none" }}
      >
        <motion.div animate={navControls}>
          {/* Scroll progress bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: scrolled ? `calc(${scrollProgress * 80}% + 0px)` : "0%",
              height: 2,
              background: "linear-gradient(90deg, #e85d1e, #f5a623)",
              borderRadius: "0 0 2px 2px",
              transition: "width 0.1s linear",
              zIndex: 60,
            }}
          />

          {/* Main bar */}
          <div
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              padding: "0 16px",
              pointerEvents: "none",
            }}
          >
            <motion.div
              animate={{
                background: scrolled
                  ? "rgba(255,255,255,0.88)"
                  : "rgba(255,255,255,0.65)",
                borderColor: scrolled
                  ? "rgba(232,93,30,0.14)"
                  : "rgba(255,255,255,0.6)",
                boxShadow: scrolled
                  ? "0 8px 40px rgba(26,31,60,0.10), 0 2px 12px rgba(232,93,30,0.06), inset 0 1px 0 rgba(255,255,255,0.9)"
                  : "0 2px 16px rgba(26,31,60,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
                backdropFilter: scrolled ? "blur(24px) saturate(1.8)" : "blur(16px) saturate(1.4)",
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 18px",
                borderRadius: 99,
                border: "1px solid",
                pointerEvents: "auto",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle inner gradient shimmer on scroll */}
              {scrolled && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(232,93,30,0.03) 50%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* ── Logo ── */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{ flexShrink: 0 }}
              >
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  {/* Actual CVDekho logo */}
                  <Image
                    src={LOGO_SRC}
                    alt="CVDekho — Instant Resume Scoring using AI"
                    width={120}
                    height={40}
                    priority
                    style={{
                      height: 40,
                      width: "auto",
                      objectFit: "contain",
                      
                      // Crop out the white background edges slightly
                      filter: "drop-shadow(0 1px 3px rgba(26,31,60,0.08))",
                    }}
                  />
                </Link>
              </motion.div>

              {/* ── Desktop nav links ── */}
              <div
                className="hidden lg:flex"
                style={{ alignItems: "center", gap: 2 }}
              >
                {NAV_LINKS.map((link) => (
                  <NavLink key={link.href} href={link.href} isScrolled={scrolled}>
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* ── Right side actions ── */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* "Let's Talk" ghost link (desktop only) */}
                <div className="hidden sm:block">
                  <Link
                    href="/lets-talk"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#5a6080",
                      textDecoration: "none",
                      padding: "6px 12px",
                      borderRadius: 8,
                      transition: "color 0.2s, background 0.2s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#1a1f3c";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(26,31,60,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#5a6080";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    Let&apos;s Talk
                  </Link>
                </div>

                {/* Sign In (desktop only) */}
                <div className="hidden sm:block">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/sign-in"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 18px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1a1f3c",
                        textDecoration: "none",
                        border: "1.5px solid rgba(26,31,60,0.18)",
                        borderRadius: 99,
                        letterSpacing: "0.04em",
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(26,31,60,0.4)";
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(26,31,60,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(26,31,60,0.18)";
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      Sign In
                    </Link>
                  </motion.div>
                </div>

                {/* Premium CTA (desktop) */}
                <div className="hidden sm:block">
                  <NavCTA compact />
                </div>

                {/* Hamburger (mobile) */}
                <div className="lg:hidden">
                  <Hamburger
                    open={mobileOpen}
                    onClick={() => setMobileOpen((v) => !v)}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile drawer */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}