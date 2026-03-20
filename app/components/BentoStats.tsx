"use client";

import { useEffect, useRef, useState } from "react";

interface Metric {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(target * eased * 100) / 100);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{Number.isInteger(target) ? current.toFixed(0) : current.toFixed(2)}</span>;
}

function CircularProgress({ value, size = 56, stroke = 4 }: { value: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#00D2BE"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

function LinearBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: "linear-gradient(90deg, #00D2BE, #00B4A0)",
          transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 0 8px rgba(0,210,190,0.3)",
        }}
      />
    </div>
  );
}

const NEURAL_METRICS: Metric[] = [
  {
    label: "Neural Load",
    value: 87,
    unit: "%",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5 7.5V20h6v-2.5c2.9-1.2 5-4.1 5-7.5a8 8 0 0 0-8-8z" />
        <path d="M10 22h4" />
        <path d="M9 10h1.5l1 2 2-4 1 2H16" />
      </svg>
    ),
  },
  {
    label: "Synaptic Map",
    value: 147,
    unit: " nodes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" />
        <path d="M6 8v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V8" /><path d="M12 14v4" />
      </svg>
    ),
  },
  {
    label: "Response",
    value: 12,
    unit: " ms",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    label: "Accuracy",
    value: 99.7,
    unit: "%",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
  },
];

const POWER_METRICS: Metric[] = [
  {
    label: "Energy Output",
    value: 94,
    unit: "%",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Plasma Temp",
    value: 4200,
    unit: " K",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      </svg>
    ),
  },
  {
    label: "Efficiency",
    value: 98.2,
    unit: "%",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    label: "Cell Cycles",
    value: 1248,
    unit: "",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 12a9 9 0 1 1-6.22-8.56" /><path d="M21 3v6h-6" />
      </svg>
    ),
  },
];

export function BentoStatsCard({
  title,
  tag,
  year,
  description,
  type,
}: {
  title: string;
  tag: string;
  year: string;
  description: string;
  type: "neural" | "power";
}) {
  const metrics = type === "neural" ? NEURAL_METRICS : POWER_METRICS;
  const mainValue = metrics[0].value;

  return (
    <div
      className="group relative overflow-hidden cursor-pointer transition-all duration-500"
      style={{ background: "var(--color-tag-bg)" }}
    >
      <div className="p-5 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.15em] font-medium" style={{ color: "var(--color-muted)" }}>{tag}</p>
            <h3 className="font-[var(--font-outfit)] text-[22px] md:text-[28px] font-bold tracking-[-0.01em]">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00D2BE", boxShadow: "0 0 8px rgba(0,210,190,0.4)" }} />
            <span className="text-[11px] font-[var(--font-mono)] tracking-wide" style={{ color: "#00D2BE" }}>ONLINE</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className="relative rounded-lg p-4 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(0,0,0,0.06)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l" style={{ borderColor: "rgba(0,210,190,0.4)" }} />

              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "rgba(0,210,190,0.08)" }}>
                  {m.icon}
                </div>
                <span className="text-[10px] tracking-[0.1em] font-medium" style={{ color: "var(--color-muted)" }}>
                  {m.label.toUpperCase()}
                </span>
              </div>

              <div className="flex items-baseline gap-0.5">
                <span className="text-[24px] md:text-[28px] font-bold font-[var(--font-mono)] tabular-nums tracking-tight">
                  <AnimatedNumber target={m.value} />
                </span>
                <span className="text-[12px] font-[var(--font-mono)]" style={{ color: "var(--color-muted)" }}>
                  {m.unit}
                </span>
              </div>

              {/* Progress bar for percentage metrics */}
              {m.unit === "%" && (
                <div className="mt-3">
                  <LinearBar value={m.value} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom row: circular gauge + description */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Circular gauge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <CircularProgress value={mainValue} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold font-[var(--font-mono)]">{mainValue}%</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: "var(--color-muted)" }}>OVERALL</p>
              <p className="text-[13px] font-bold" style={{ color: "#00D2BE" }}>OPTIMAL</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[13px] leading-relaxed flex-1" style={{ color: "var(--color-muted)" }}>
            {description}
          </p>

          <span className="text-[12px] font-[var(--font-mono)] tabular-nums shrink-0" style={{ color: "var(--color-muted)" }}>{year}</span>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" style={{ border: "1px solid var(--color-tag-border)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
      </div>
    </div>
  );
}
