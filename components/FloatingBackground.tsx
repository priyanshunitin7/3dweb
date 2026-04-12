"use client";

export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-neutral-950">
      <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
      <div className="absolute top-[40%] right-[15%] w-[700px] h-[700px] bg-purple-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[20%] left-[40%] w-[800px] h-[800px] bg-emerald-600/5 blur-[150px] rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)] opacity-80" />
    </div>
  );
}