"use client";


import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";

// ─── Floating ambient chip ────────────────────────────────────────
function FloatingChip({
  value,
  label,
  delay,
  style,
}: {
  value: string;
  label: string;
  delay: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: "absolute",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(232,93,30,0.13)",
        borderRadius: 14,
        padding: "10px 16px",
        boxShadow: "0 8px 28px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column" as const,
        gap: 2,
        pointerEvents: "none",
        zIndex: 5,
        ...style,
      }}
    >
      <span style={{ fontSize: 17, fontWeight: 800, color: "#e85d1e", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, color: "#8a8fa8", fontWeight: 500 }}>{label}</span>
    </motion.div>
  );
}

// ─── Premium shimmer button ───────────────────────────────────────
function SubmitButton({ loading }: { loading: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      type="submit"
      disabled={loading}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        width: "100%",
        padding: "15px 32px",
        background: loading
          ? "rgba(232,93,30,0.5)"
          : "linear-gradient(135deg, #e85d1e 0%, #ff7c3a 60%, #f5a623 100%)",
        color: "#fff",
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        border: "none",
        borderRadius: 99,
        cursor: loading ? "not-allowed" : "pointer",
        overflow: "hidden",
        position: "relative" as const,
        boxShadow: hovered && !loading
          ? "0 20px 50px rgba(232,93,30,0.45), 0 0 0 1px rgba(255,255,255,0.15) inset"
          : "0 10px 32px rgba(232,93,30,0.30), 0 0 0 1px rgba(255,255,255,0.1) inset",
        transition: "box-shadow 0.3s ease, background 0.3s ease",
      }}
    >
      {/* Shimmer */}
      <motion.div
        animate={hovered && !loading ? { x: ["-150%", "200%"] } : { x: "-150%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "skewX(-20deg)",
          pointerEvents: "none",
        }}
      />

      <span style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%" }}
            />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <motion.span
              animate={{ x: hovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{ fontSize: 15 }}
            >
              →
            </motion.span>
          </>
        )}
      </span>
    </motion.button>
  );
}

// ─── Styled input ─────────────────────────────────────────────────
function FormField({
  label,
  children,
  delay,
}: {
  label: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
    >
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.09em",
          textTransform: "uppercase" as const,
          color: "#8a8fa8",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      {children}
    </motion.div>
  );
}

// ─── Success modal ────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,31,60,0.35)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.05 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(232,93,30,0.15)",
          borderRadius: 28,
          padding: "52px 44px 44px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(26,31,60,0.18), 0 0 0 1px rgba(255,255,255,0.6) inset",
          position: "relative",
        }}
      >
        {/* Close button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid rgba(26,31,60,0.12)",
            background: "rgba(26,31,60,0.04)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#8a8fa8",
          }}
        >
          ✕
        </motion.button>

        {/* Animated checkmark ring */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e85d1e, #f5a623)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 12px 32px rgba(232,93,30,0.35)",
          }}
        >
          <motion.svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          >
            <motion.path
              d="M7 16l6 6 12-12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>

        {/* Glow behind icon */}
        <div style={{
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 140,
          height: 140,
          background: "radial-gradient(circle, rgba(232,93,30,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          borderRadius: "50%",
        }} />

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1a1f3c",
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          Message sent!
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5 }}
          style={{ fontSize: 14, color: "#5a6080", lineHeight: 1.65, marginBottom: 4 }}
        >
          Thanks for reaching out.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ fontSize: 12, color: "#aab0c4", fontWeight: 500 }}
        >
          You'll hear back from us shortly.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 0.68, 0, 1.2] }}
          style={{
            width: "100%",
            height: 1,
            background: "rgba(26,31,60,0.07)",
            margin: "24px 0 20px",
            transformOrigin: "left",
          }}
        />

        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "rgba(26,31,60,0.05)",
            border: "1px solid rgba(26,31,60,0.1)",
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 700,
            color: "#1a1f3c",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function LetsTalk() {
  const formRef  = useRef<HTMLFormElement>(null);
  const textCtrl = useAnimation();
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Character-by-character headline, matching hero pattern
  useEffect(() => {
    textCtrl.start((i) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: i * 0.045 + 0.25,
        duration: 0.55,
        ease: [0.22, 0.68, 0, 1.2],
      },
    }));
  }, [textCtrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
const botField = (form?.elements.namedItem("company") as HTMLInputElement)?.value;

if (botField) {
  console.log("Bot detected — blocked");
  return;
}
    if (!formRef.current || loading || success) return;

    setLoading(true);
    
   Promise.all([
  // Email to YOU
  emailjs.sendForm(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    formRef.current!,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  ),

  // Auto-reply to USER
  emailjs.sendForm(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_AUTO_REPLY_TEMPLATE_ID!,
    formRef.current!,
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  )
])
      .then(
        () => {
          setLoading(false);
          setSuccess(true);
          setErrorMsg("");
          formRef.current?.reset();
          setErrorMsg("");
        },
        (error) => {
  console.log("FULL ERROR:", error);
  console.log("STATUS:", error?.status);
  console.log("TEXT:", error?.text);

  setLoading(false);
  setErrorMsg("Something went wrong. Please try again.");
}
      );
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    borderRadius: 14,
    border: `1.5px solid ${focused === name ? "#e85d1e" : "rgba(26,31,60,0.10)"}`,
    background: focused === name ? "rgba(232,93,30,0.025)" : "rgba(255,255,255,0.85)",
    fontSize: 14,
    color: "#1a1f3c",
    outline: "none",
    transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
    boxShadow: focused === name
      ? "0 0 0 4px rgba(232,93,30,0.08)"
      : "0 2px 8px rgba(0,0,0,0.04)",
    fontFamily: "inherit",
  });

  const words = ["Let's", "Talk."];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(150deg,#ffffff 0%,#fff8f4 45%,#fff2e8 100%)",
        color: "#1a1f3c",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Back to Home */}
<div
  style={{
    position: "absolute",
    top: 24,
    left: 24,
    zIndex: 20,
  }}
>
  <Link
    href="/"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 18px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(232,93,30,0.2)",
      color: "#1a1f3c",
      fontSize: 13,
      fontWeight: 700,
      textDecoration: "none",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.transform =
        "translateY(-2px) scale(1.03)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLAnchorElement).style.transform = "none";
    }}
  >
    ← Back to Home
  </Link>
</div>
    

      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-8%", right: "-4%", width: 500, height: 500, background: "radial-gradient(ellipse,rgba(232,93,30,0.09) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: "5%", left: "-6%", width: 400, height: 400, background: "radial-gradient(ellipse,rgba(26,31,60,0.055) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "40%", left: "18%", width: 300, height: 300, background: "radial-gradient(ellipse,rgba(245,166,35,0.07) 0%,transparent 65%)", borderRadius: "50%", pointerEvents: "none", zIndex: 1 }} />

      {/* Floating chips — hidden on mobile */}
      <div className="hide-on-mobile">
        <FloatingChip value="< 24h" label="Avg. reply time"  delay={1.6} style={{ left: 32, top: "38%" }} />
        <FloatingChip value="100%" label="Response rate"    delay={1.8} style={{ left: 32, top: "52%" }} />
      </div>

      {/* Bottom dissolve */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: "linear-gradient(to top,#fff8f4,transparent)", pointerEvents: "none", zIndex: 2 }} />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 72px)",
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
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
            <span style={{
              width: 7, height: 7, background: "#e85d1e", borderRadius: "50%",
              display: "inline-block",
              animation: "pulse 1.8s ease-in-out infinite",
            }} />
            Get in touch
          </motion.div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.8rem,6vw,4.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: 0,
            }}
            aria-label={words.join(" ")}
          >
            {words.map((word, wi) => (
              <span key={wi} style={{ display: "inline-block", marginRight: 10 }}>
                {word.split("").map((char, ci) => (
                  <motion.span
                    key={ci}
                    custom={wi * 8 + ci}
                    initial={{ opacity: 0, y: 40, rotate: 4 }}
                    animate={textCtrl}
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
          </h1>

          {/* Underline accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.65, ease: [0.22, 0.68, 0, 1.2] }}
            style={{
              width: 120,
              height: 3,
              background: "linear-gradient(90deg,#e85d1e,#f5a623)",
              borderRadius: 99,
              transformOrigin: "left",
              margin: "16px 0 20px",
            }}
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6 }}
            style={{
              fontSize: 15,
              color: "#5a6080",
              lineHeight: 1.7,
              marginBottom: 40,
              fontWeight: 500,
            }}
          >
            Tell us what you need —{" "}
            <strong style={{ color: "#1a1f3c", fontWeight: 700 }}>
              we'll get back to you within 24 hours.
            </strong>
          </motion.p>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 0.68, 0, 1.2] }}
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(26,31,60,0.09)",
              borderRadius: 28,
              padding: "40px 36px",
              boxShadow: "0 16px 56px rgba(0,0,0,0.07), 0 0 0 1px rgba(255,255,255,0.6) inset",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Card inner glow */}
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 240, height: 240,
              background: "radial-gradient(circle,rgba(232,93,30,0.06) 0%,transparent 70%)",
              pointerEvents: "none",
            }} />

            <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {/* 🛡️ Anti-spam honeypot */}
                  <input
                    type="text"
                    name="company"
                    style={{ display: "none" }}
                    />
              <FormField label="Name" delay={0.75}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  disabled={loading || success}
                  style={inputStyle("name")}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                />
              </FormField>

              <FormField label="Email" delay={0.85}>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  disabled={loading || success}
                  style={inputStyle("email")}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                />
              </FormField>

              <FormField label="Message" delay={0.95}>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Write your message..."
                  required
                  disabled={loading || success}
                  style={{
                    ...inputStyle("message"),
                    resize: "none",
                    lineHeight: 1.65,
                  }}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                />
              </FormField>

              {/* Divider */}
              <div style={{ width: "100%", height: 1, background: "rgba(26,31,60,0.06)", margin: "2px 0" }} />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <SubmitButton loading={loading || success} />
                {errorMsg && (
  <p
    style={{
      color: "#ef4444",
      fontSize: 12,
      textAlign: "center",
      marginTop: 8,
      fontWeight: 500,
    }}
  >
    {errorMsg}
  </p>
)}
              </motion.div>

              {/* Trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "#aab0c4",
                  fontWeight: 500,
                  marginTop: -6,
                }}
              >
                <span style={{ color: "#22c55e", fontSize: 13 }}>✓</span>
                No spam · Your data is safe · We reply within 24h
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {success && <SuccessModal onClose={() => setSuccess(false)} />}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.45;transform:scale(.8)}
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </main>
  );
}