"use client";

import { useState, useEffect, useRef } from "react";

/* ── FadeIn — taste-skill: staggered cubic-bezier reveals ── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const TAGS = [
  "motion design",
  "AI creative",
  "3D web",
  "interactive",
  "branding",
  "generative art",
  "real-time",
  "immersive",
];

const SERVICES = [
  {
    num: "01",
    title: "Motion Design",
    desc: "Анимация и визуальные эффекты для брендов, продуктов и цифровых платформ.",
  },
  {
    num: "02",
    title: "3D & Web",
    desc: "Интерактивные 3D-сцены и иммерсивные веб-опыты на WebGL и Three.js.",
  },
  {
    num: "03",
    title: "AI Creative",
    desc: "Генеративный дизайн и креативные решения на основе искусственного интеллекта.",
  },
  {
    num: "04",
    title: "Branding",
    desc: "Визуальная идентичность, логотипы и фирменный стиль с акцентом на digital.",
  },
];

const WORKS = [
  { title: "NEON DRIFT", tag: "3D / WebGL", year: "2026", image: "/neon-drift.png", video: null },
  { title: "1.Neural CORE", tag: "Mind", year: "2025", image: null, video: "/neural-card.mp4" },
  { title: "2.Power Core", tag: "energy", year: "2026", image: null, video: "/power-card.mp4" },
  { title: "3.Servo Arm", tag: "mobility", year: "2026", image: "/flex-core.png", video: null },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [kbHover, setKbHover] = useState<string | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [hotspotState, setHotspotState] = useState<{ active: string | null; phase: "image" | "playing" | "frozen" }>({ active: null, phase: "image" });
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    fetch("/hotspot-click.mp3")
      .then((r) => r.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => { audioBufferRef.current = decoded; });
  }, []);

  const playClick = () => {
    const ctx = audioCtxRef.current;
    const buffer = audioBufferRef.current;
    if (!ctx || !buffer) return;
    if (ctx.state === "suspended") ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.6;
    source.connect(gain).connect(ctx.destination);
    source.start(0);
  };

  const handleParallax = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.parentElement!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `translate(${x * -15}px, ${y * -15}px) scale(1.03)`;
  };

  const handleParallaxLeave = () => {
    const img = imgRef.current;
    if (!img) return;
    img.style.transform = "translate(0, 0) scale(1)";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const audio = new Audio("/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    musicRef.current = audio;
    const tryPlay = () => {
      audio.play().catch(() => {
        // Browser blocked autoplay, wait for user interaction
        setMusicPlaying(false);
        const handler = () => {
          audio.play().then(() => setMusicPlaying(true)).catch(() => {});
          document.removeEventListener("click", handler);
        };
        document.addEventListener("click", handler);
      });
    };
    tryPlay();

    const handleVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (musicRef.current && !document.hidden) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      audio.pause();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const toggleMusic = () => {
    if (!musicRef.current) {
      const audio = new Audio("/ambient.mp3");
      audio.loop = true;
      audio.volume = 0.3;
      musicRef.current = audio;
    }
    if (musicPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-5 left-5 z-50 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 hover:scale-110"
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${musicPlaying ? "rgba(0,210,190,0.5)" : "rgba(255,255,255,0.15)"}`,
          boxShadow: musicPlaying ? "0 0 12px rgba(0,210,190,0.3)" : "none",
        }}
        title={musicPlaying ? "Выключить звук" : "Включить звук"}
      >
        {musicPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(0,210,190,0.2)" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="rgba(255,255,255,0.1)" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>

      {/* ── HERO ── */}
      <section className="min-h-[80vh] md:min-h-screen pt-12 md:pt-20 pb-12 md:pb-20 px-4 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        {/* Heading row: ROBOT MOTION left, logo right — fixed level */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-12">
          <h1
            className="font-[var(--font-outfit)] leading-[0.92] tracking-[-0.03em] text-center sm:text-left"
            style={{
              fontSize: "clamp(36px, 8vw, 96px)",
              fontWeight: 800,
              animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both",
            }}
          >
            ROBOT
            <br />
            <span style={{ color: "#C47A2A" }}>MOTION</span>
          </h1>
          <img
            src="/logo.png"
            alt="Logo"
            className="w-auto object-contain"
            style={{
              height: "clamp(80px, 16vw, 240px)",
              animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-start">

          {/* Right — video */}
          <div
            className="relative aspect-[4/5] lg:aspect-[3/4] rounded-sm overflow-hidden"
            style={{
              animation: "hero-scale 1s cubic-bezier(0.16,1,0.3,1) 0.3s both",
            }}
            onMouseEnter={() => setKbHover("hero")}
            onMouseLeave={() => setKbHover(null)}
          >
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              data-kenburns={kbHover === "hero" ? "active" : "idle"}
            />
          </div>
        </div>
      </section>

      {/* ── Section divider: neon line + dot grid ── */}
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-12 lg:px-20 py-12">
        {/* Dot grid fading out */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle, var(--color-fg) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
        }} />
        {/* Neon glow line */}
        <div className="relative h-[1px] w-full" style={{
          background: "linear-gradient(90deg, transparent 0%, #00D2BE 20%, #00D2BE 80%, transparent 100%)",
          boxShadow: "0 0 8px rgba(0,210,190,0.4), 0 0 20px rgba(0,210,190,0.15)",
        }} />
      </div>

      {/* ── WORKS — taste-skill: asymmetric grid, stagger ── */}
      <section id="работы" className="py-12 md:py-24 px-4 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <FadeIn>
          <p
            className="text-[11px] tracking-[0.2em] font-medium mb-4"
            style={{ color: "var(--color-muted)" }}
          >
            Project —01
          </p>
          <h2
            className="font-[var(--font-outfit)] text-[36px] md:text-[48px] font-bold tracking-[-0.02em] leading-none mb-16"
          >
            Version 1.01
            <br />
            <span style={{ color: "var(--color-muted)" }}>(build 1748.10)</span>
          </h2>
        </FadeIn>

        {/* Featured full-height image with hotspots */}
        <FadeIn className="mb-8">
          <div
            className="group relative overflow-hidden"
            onMouseMove={handleParallax}
            onMouseLeave={handleParallaxLeave}
          >
            {/* Base image with soft parallax */}
            <img
              ref={imgRef}
              src="/neon-drift.png"
              alt="NEON DRIFT"
              className="w-full h-auto object-contain"
              style={{
                opacity: hotspotState.phase === "image" ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.03,0.98,0.52,0.99)",
                willChange: "transform",
              }}
            />

            {/* Video 1 — Neural Core */}
            <video
              ref={videoRef1}
              src="/neural-core.mp4"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: hotspotState.active === "neural" && hotspotState.phase !== "image" ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: hotspotState.active === "neural" ? "auto" : "none",
              }}
              muted playsInline preload="auto"
              onEnded={() => setHotspotState({ active: "neural", phase: "frozen" })}
            />

            {/* Video 3 — Power Core */}
            <video
              ref={videoRef3}
              src="/power-core.mp4"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: hotspotState.active === "power" && hotspotState.phase !== "image" ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: hotspotState.active === "power" ? "auto" : "none",
              }}
              muted playsInline preload="auto"
              onEnded={() => setHotspotState({ active: "power", phase: "frozen" })}
            />

            {/* Video 2 — Servo Arm */}
            <video
              ref={videoRef2}
              src="/servo-arm.mp4"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: hotspotState.active === "servo" && hotspotState.phase !== "image" ? 1 : 0,
                transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: hotspotState.active === "servo" ? "auto" : "none",
              }}
              muted playsInline preload="auto"
              onEnded={() => setHotspotState({ active: "servo", phase: "frozen" })}
            />

            {/* Back button */}
            {hotspotState.phase !== "image" && (
              <button
                onClick={() => {
                  setHotspotState({ active: null, phase: "image" });
                  [videoRef1, videoRef2, videoRef3].forEach(ref => {
                    if (ref.current) { ref.current.pause(); ref.current.currentTime = 0; }
                  });
                }}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center cursor-pointer"
                style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", border: "1px solid rgba(0,210,190,0.3)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Frozen hotspot — Neural Core → AI MODULE */}
            {hotspotState.active === "neural" && hotspotState.phase === "frozen" && (
              <div className="absolute" style={{ top: "18%", left: "58%", transform: "translate(-50%,-50%)", animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
                <div className="relative w-4 h-4 cursor-pointer">
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(0,210,190,0.3)" }} />
                  <div className="absolute inset-0 rounded-full" style={{ background: "#00D2BE", boxShadow: "0 0 10px rgba(0,210,190,0.6), 0 0 20px rgba(0,210,190,0.3)" }} />
                </div>
                <span className="absolute pointer-events-none whitespace-nowrap font-[var(--font-outfit)] text-[12px] md:text-[20px] tracking-[0.15em] font-medium" style={{ color: "#00D2BE", top: "-2px", left: "60px", textShadow: "0 0 12px rgba(0,210,190,0.5), 0 0 24px rgba(0,210,190,0.2)" }}>AI MODULE</span>
                <svg className="absolute pointer-events-none" style={{ top: "24px", left: "18px", width: "180px", height: "30px", overflow: "visible" }}>
                  <line x1="0" y1="0" x2="40" y2="16" stroke="#00D2BE" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                  <line x1="40" y1="16" x2="180" y2="16" stroke="#00D2BE" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                </svg>
                <div className="absolute pointer-events-none rounded-sm" style={{ top: "42px", left: "18px", width: "240px", padding: "10px 12px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,210,190,0.4)", boxShadow: "0 0 12px rgba(0,210,190,0.15)", animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
                  <p className="text-[10px] md:text-[12px] leading-relaxed font-[var(--font-outfit)]" style={{ color: "rgba(0,210,190,0.9)" }}>
                    Центральный нейропроцессор. Обрабатывает сенсорные данные и координирует все системы в реальном времени.
                  </p>
                </div>
              </div>
            )}

            {/* Frozen hotspot — Power Core → PLASMA CELL */}
            {hotspotState.active === "power" && hotspotState.phase === "frozen" && (
              <div className="absolute" style={{ top: "40%", left: "50%", transform: "translate(-50%,-50%)", animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
                <div className="relative w-4 h-4 cursor-pointer">
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(0,210,190,0.3)" }} />
                  <div className="absolute inset-0 rounded-full" style={{ background: "#00D2BE", boxShadow: "0 0 10px rgba(0,210,190,0.6), 0 0 20px rgba(0,210,190,0.3)" }} />
                </div>
                <span className="absolute pointer-events-none whitespace-nowrap font-[var(--font-outfit)] text-[12px] md:text-[20px] tracking-[0.15em] font-medium" style={{ color: "#00D2BE", top: "-2px", left: "60px", textShadow: "0 0 12px rgba(0,210,190,0.5), 0 0 24px rgba(0,210,190,0.2)" }}>PLASMA CELL</span>
                <svg className="absolute pointer-events-none" style={{ top: "24px", left: "18px", width: "180px", height: "30px", overflow: "visible" }}>
                  <line x1="0" y1="0" x2="40" y2="16" stroke="#00D2BE" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                  <line x1="40" y1="16" x2="180" y2="16" stroke="#00D2BE" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                </svg>
                <div className="absolute pointer-events-none rounded-sm" style={{ top: "42px", left: "18px", width: "240px", padding: "10px 12px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,210,190,0.4)", boxShadow: "0 0 12px rgba(0,210,190,0.15)", animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
                  <p className="text-[10px] md:text-[12px] leading-relaxed font-[var(--font-outfit)]" style={{ color: "rgba(0,210,190,0.9)" }}>
                    Плазменный энергоблок. Генерирует и распределяет питание по всем модулям через конвертацию высокоэнергетической плазмы.
                  </p>
                </div>
              </div>
            )}

            {/* Frozen hotspot — Servo Arm → FLEX JOINT */}
            {hotspotState.active === "servo" && hotspotState.phase === "frozen" && (
              <div className="absolute" style={{ top: "45%", left: "55%", transform: "translate(-50%,-50%)", animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
                <div className="relative w-4 h-4 cursor-pointer">
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(0,210,190,0.3)" }} />
                  <div className="absolute inset-0 rounded-full" style={{ background: "#00D2BE", boxShadow: "0 0 10px rgba(0,210,190,0.6), 0 0 20px rgba(0,210,190,0.3)" }} />
                </div>
                <span className="absolute pointer-events-none whitespace-nowrap font-[var(--font-outfit)] text-[12px] md:text-[20px] tracking-[0.15em] font-medium" style={{ color: "#00D2BE", top: "-2px", right: "60px", textShadow: "0 0 12px rgba(0,210,190,0.5), 0 0 24px rgba(0,210,190,0.2)" }}>FLEX JOINT</span>
                <svg className="absolute pointer-events-none" style={{ top: "24px", right: "18px", width: "180px", height: "30px", overflow: "visible" }}>
                  <line x1="180" y1="0" x2="140" y2="16" stroke="#00D2BE" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                  <line x1="0" y1="16" x2="140" y2="16" stroke="#00D2BE" strokeWidth="1.5" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                </svg>
                <div className="absolute pointer-events-none rounded-sm" style={{ top: "42px", right: "18px", width: "240px", padding: "10px 12px", textAlign: "right", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,210,190,0.4)", boxShadow: "0 0 12px rgba(0,210,190,0.15)", animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}>
                  <p className="text-[10px] md:text-[12px] leading-relaxed font-[var(--font-outfit)]" style={{ color: "rgba(0,210,190,0.9)" }}>
                    Адаптивный серво-привод. 7 степеней свободы, точность позиционирования 0.01мм, усилие захвата до 120Н.
                  </p>
                </div>
              </div>
            )}

            {/* Hotspot annotations on base image */}
            {hotspotState.phase === "image" && [
              { top: "12%", left: "50%", label: "NEURAL CORE", dir: "right" as const, video: "neural" },
              { top: "40%", left: "50%", label: "ENERGY CORE", dir: "left" as const, video: "power" },
              { top: "78%", left: "83%", label: "SERVO ARM", dir: "left" as const, video: "servo" },
            ].map((spot, idx) => (
              <div
                key={idx}
                className="group/dot absolute"
                style={{ top: spot.top, left: spot.left, transform: "translate(-50%,-50%)" }}
              >
                <div
                  className="relative w-4 h-4 cursor-pointer"
                  onClick={() => {
                    playClick();
                    if (spot.video) {
                      const ref = spot.video === "neural" ? videoRef1 : spot.video === "servo" ? videoRef2 : videoRef3;
                      if (ref.current) {
                        ref.current.currentTime = 0;
                        ref.current.play();
                      }
                      setHotspotState({ active: spot.video, phase: "playing" });
                    }
                  }}
                >
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(0,210,190,0.3)" }} />
                  <div className="absolute inset-0 rounded-full" style={{ background: "#00D2BE", boxShadow: "0 0 10px rgba(0,210,190,0.6), 0 0 20px rgba(0,210,190,0.3)" }} />
                </div>
                <span
                  className="absolute pointer-events-none whitespace-nowrap font-[var(--font-outfit)] text-[12px] md:text-[20px] tracking-[0.15em] font-medium"
                  style={{
                    color: "#00D2BE",
                    top: "-2px",
                    [spot.dir === "right" ? "left" : "right"]: "60px",
                    textShadow: "0 0 12px rgba(0,210,190,0.5), 0 0 24px rgba(0,210,190,0.2)",
                    animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
                    animationDelay: `${idx * 200}ms`,
                  }}
                >
                  {spot.label}
                </span>
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    top: "24px",
                    [spot.dir === "right" ? "left" : "right"]: "18px",
                    width: "180px",
                    height: "30px",
                    overflow: "visible",
                    animation: "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
                    animationDelay: `${idx * 200 + 100}ms`,
                  }}
                >
                  <line
                    x1={spot.dir === "right" ? 0 : 180}
                    y1="0"
                    x2={spot.dir === "right" ? 40 : 140}
                    y2="16"
                    stroke="#00D2BE"
                    strokeWidth="1.5"
                    style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }}
                  />
                  <line
                    x1={spot.dir === "right" ? 40 : 0}
                    y1="16"
                    x2={spot.dir === "right" ? 180 : 140}
                    y2="16"
                    stroke="#00D2BE"
                    strokeWidth="1.5"
                    style={{ filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }}
                  />
                </svg>
              </div>
            ))}

            {/* Interactive hint — top */}
            {hotspotState.phase === "image" && (
              <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none rounded-sm" style={{ padding: "10px 20px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,210,190,0.4)", boxShadow: "0 0 20px rgba(0,210,190,0.2), 0 0 40px rgba(0,210,190,0.1)", animation: "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M15 15l-2 5L9 9l11 4-5 2z" />
                  </svg>
                  <span className="text-[14px] md:text-[18px] tracking-[0.15em] font-[var(--font-outfit)] font-semibold whitespace-nowrap" style={{ color: "#00D2BE", textShadow: "0 0 12px rgba(0,210,190,0.6), 0 0 24px rgba(0,210,190,0.3)" }}>
                    НАЖМИТЕ НА HOTSPOT
                  </span>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Divider: ASCII code line */}
        <div className="relative py-8 mb-8 overflow-hidden">
          <div className="flex items-center justify-center gap-0">
            <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,210,190,0.2) 100%)" }} />
            <p className="px-4 text-[10px] tracking-[0.3em] font-[var(--font-mono)] whitespace-nowrap select-none" style={{ color: "rgba(0,210,190,0.3)" }}>
              {"// 0x4D 0x4F 0x44 "}
              <span style={{ color: "#00D2BE", textShadow: "0 0 8px rgba(0,210,190,0.5)" }}>MODULES</span>
              {" :: init //"}
            </p>
            <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, rgba(0,210,190,0.2) 0%, transparent 100%)" }} />
          </div>
        </div>

        <div className="flex flex-col gap-0">
          {WORKS.filter(w => w.title !== "NEON DRIFT").map((work, i) => (
            <FadeIn key={work.title} delay={i * 100}>
              {/* ASCII divider between cards */}
              {i > 0 && (
                <div className="relative py-6 overflow-hidden">
                  <div className="flex items-center justify-center gap-0">
                    <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,210,190,0.2) 100%)" }} />
                    <p className="px-4 text-[10px] tracking-[0.3em] font-[var(--font-mono)] whitespace-nowrap select-none" style={{ color: "rgba(0,210,190,0.3)" }}>
                      {i === 1 ? (
                        <>{"// 0x45 0x4E 0x52 "}<span style={{ color: "#00D2BE", textShadow: "0 0 8px rgba(0,210,190,0.5)" }}>ENERGY</span>{" :: load //"}</>
                      ) : (
                        <>{"// 0x53 0x52 0x56 "}<span style={{ color: "#00D2BE", textShadow: "0 0 8px rgba(0,210,190,0.5)" }}>SERVO</span>{" :: sync //"}</>
                      )}
                    </p>
                    <div className="h-[1px] flex-1" style={{ background: "linear-gradient(90deg, rgba(0,210,190,0.2) 0%, transparent 100%)" }} />
                  </div>
                </div>
              )}
              {/* Neural CORE card — description left, video right */}
              {i === 0 ? (
                <div
                  className="group relative overflow-hidden cursor-pointer transition-all duration-500"
                  style={{ background: "var(--color-tag-bg)" }}
                  onMouseEnter={() => setKbHover("neural")}
                  onMouseLeave={() => setKbHover(null)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 md:p-8">
                    {/* Description left */}
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.15em] font-medium" style={{ color: "var(--color-muted)" }}>{work.tag}</p>
                      <h3 className="font-[var(--font-outfit)] text-[22px] md:text-[28px] font-bold tracking-[-0.01em]">{work.title}</h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
                        Нейронное ядро управления. Центральный процессор обработки данных и принятия решений в реальном времени.
                      </p>
                      <span className="text-[12px] font-[var(--font-mono)] tabular-nums" style={{ color: "var(--color-muted)" }}>{work.year}</span>
                    </div>
                    {/* Video right — monitor frame */}
                    <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-sm overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(0,210,190,0.4)", boxShadow: "0 0 12px rgba(0,210,190,0.15), inset 0 0 12px rgba(0,210,190,0.05)" }}>
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <video
                        className="absolute inset-0 w-full h-full object-contain"
                        src={work.video!}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ filter: "contrast(1.15) brightness(0.95) saturate(1.2) blur(0.4px)" }}
                        data-kenburns={kbHover === "neural" ? "active" : "idle"}
                      />
                      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.08]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
                    </div>
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" style={{ border: "1px solid var(--color-tag-border)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </div>
                </div>
              ) : i === 1 ? (
                <div
                  className="group relative overflow-hidden cursor-pointer transition-all duration-500"
                  style={{ background: "var(--color-tag-bg)" }}
                  onMouseEnter={() => setKbHover("power")}
                  onMouseLeave={() => setKbHover(null)}
                >
                  <div className="flex flex-col-reverse md:flex-row md:items-center gap-4 md:gap-6 p-5 md:p-8">
                    {/* Video left on desktop, bottom on mobile */}
                    <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-sm overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(0,210,190,0.4)", boxShadow: "0 0 12px rgba(0,210,190,0.15), inset 0 0 12px rgba(0,210,190,0.05)" }}>
                      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 pointer-events-none z-10" style={{ borderColor: "#00D2BE", filter: "drop-shadow(0 0 4px rgba(0,210,190,0.6))" }} />
                      <video
                        className="absolute inset-0 w-full h-full object-contain"
                        src={work.video!}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ filter: "contrast(1.15) brightness(0.95) saturate(1.2) blur(0.4px)" }}
                        data-kenburns={kbHover === "power" ? "active" : "idle"}
                      />
                      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.08]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
                      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)" }} />
                    </div>
                    {/* Description */}
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.15em] font-medium" style={{ color: "var(--color-muted)" }}>{work.tag}</p>
                      <h3 className="font-[var(--font-outfit)] text-[22px] md:text-[28px] font-bold tracking-[-0.01em]">{work.title}</h3>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--color-muted)" }}>
                        Энергетическое ядро системы. Обеспечивает непрерывное питание всех модулей робота через плазменную конвертацию.
                      </p>
                      <span className="text-[12px] font-[var(--font-mono)] tabular-nums" style={{ color: "var(--color-muted)" }}>{work.year}</span>
                    </div>
                  </div>
                  {/* Hover arrow */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" style={{ border: "1px solid var(--color-tag-border)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                  </div>
                </div>
              ) : (
              <div
                className={`group relative overflow-hidden cursor-pointer transition-all duration-500 ${i === 2 ? "" : "aspect-[16/10]"}`}
                style={{ background: "var(--color-tag-bg)" }}
                onMouseEnter={() => setKbHover("servo")}
                onMouseLeave={() => setKbHover(null)}
              >
                {work.video ? (
                  <>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={work.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{ filter: "contrast(1.15) brightness(0.95) saturate(1.2) blur(0.4px)" }}
                    />
                    <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.08]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)" }} />
                  </>
                ) : work.image ? (
                  i === 2 ? (
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-auto object-contain"
                      data-kenburns={kbHover === "servo" ? "active" : "idle"}
                    />
                  ) : (
                    <img
                      src={work.image}
                      alt={work.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )
                ) : (
                <div
                  className="absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.06]"
                  style={{
                    backgroundImage: `
                      linear-gradient(var(--color-fg) 1px, transparent 1px),
                      linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)
                    `,
                    backgroundSize: "32px 32px",
                  }}
                />
                )}
                {(work.video || work.image) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                )}
                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <p
                        className="text-[10px] tracking-[0.15em] font-medium mb-2"
                        style={{ color: (work.video || work.image) ? "rgba(255,255,255,0.7)" : "var(--color-muted)" }}
                      >
                        {work.tag}
                      </p>
                      <h3 className="font-[var(--font-outfit)] text-[24px] md:text-[28px] font-bold tracking-[-0.01em]" style={{ color: (work.video || work.image) ? "#fff" : undefined }}>
                        {work.title}
                      </h3>
                    </div>
                    <span
                      className="text-[12px] font-[var(--font-mono)] tabular-nums"
                      style={{ color: (work.video || work.image) ? "rgba(255,255,255,0.5)" : "var(--color-muted)" }}
                    >
                      {work.year}
                    </span>
                  </div>
                </div>
                {/* Hover arrow */}
                <div
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  style={{ border: "1px solid var(--color-tag-border)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
              )}
            </FadeIn>
          ))}
        </div>
      </section>


    </main>
  );
}
