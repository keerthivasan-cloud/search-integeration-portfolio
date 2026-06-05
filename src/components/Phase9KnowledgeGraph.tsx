import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Radial graph layout — center + 6 satellites
const CX = 450;
const CY = 285;
const RADIUS = 195;

function polar(angleDeg: number) {
  const r = (angleDeg * Math.PI) / 180;
  return {
    x: CX + RADIUS * Math.cos(r),
    y: CY + RADIUS * Math.sin(r),
  };
}

const NODES = [
  { angle: 0,   label: 'shaft_drawing_v3.pdf', type: 'Document', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', rel: 'SPECIFIES' },
  { angle: 60,  label: 'XYZ Suppliers Ltd',    type: 'Supplier',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', rel: 'SUPPLIED_BY' },
  { angle: 120, label: 'Contract #A-142',       type: 'Legal',     color: '#fb923c', bg: 'rgba(251,146,60,0.12)', rel: 'BOUND_BY' },
  { angle: 180, label: 'Drive Shaft 60mm',      type: 'Component', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', rel: 'DEFINES' },
  { angle: 240, label: 'EN 1.4301 Steel',       type: 'Material',  color: '#34d399', bg: 'rgba(52,211,153,0.12)', rel: 'MATERIAL' },
  { angle: 300, label: 'Maintenance Q3-2025',   type: 'Log',       color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', rel: 'MAINTAINS' },
];

// Midpoint of each line for label placement
const MIDPOINTS = NODES.map((n) => {
  const p = polar(n.angle);
  return { x: (CX + p.x) / 2, y: (CY + p.y) / 2 };
});

// Highlight path index (simulates "search found this relationship")
const HIGHLIGHT_IDX = 0;

export const Phase9KnowledgeGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const relLabelRefs = useRef<(SVGTextElement | null)[]>([]);
  const packetRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pulseRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(centerRef.current, { scale: 0, opacity: 0 });
      gsap.set(pulseRingRef.current, { scale: 1, opacity: 0 });
      gsap.set(nodeRefs.current, { scale: 0, opacity: 0 });
      gsap.set(relLabelRefs.current, { opacity: 0 });
      gsap.set(packetRefs.current, { opacity: 0 });

      // Set path stroke-dasharray = path length
      pathRefs.current.forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
        },
      });

      // Step 1 — Center node pops in
      tl.to(centerRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.8)' }, 0);
      tl.to(pulseRingRef.current, { opacity: 1, scale: 1.4, duration: 0.5, ease: 'power2.out' }, 0.1);
      tl.to(pulseRingRef.current, { opacity: 0, scale: 1.8, duration: 0.4, ease: 'power2.in' }, 0.6);

      // Step 2 — Connection paths draw outward one by one
      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 0.5 + i * 0.12);
      });

      // Step 3 — Satellite nodes pop in at line endpoints
      nodeRefs.current.forEach((node, i) => {
        tl.to(node, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }, 0.7 + i * 0.12);
      });

      // Step 4 — Relationship labels fade in
      tl.to(relLabelRefs.current, { opacity: 1, stagger: 0.06, duration: 0.25 }, 1.4);

      // Step 5 — Energy packets begin looping after everything is visible
      tl.call(() => {
        NODES.forEach((node, i) => {
          const pkt = packetRefs.current[i];
          if (!pkt) return;
          const pos = polar(node.angle);
          gsap.set(pkt, { attr: { cx: pos.x, cy: pos.y }, opacity: 0 });
          gsap.timeline({ repeat: -1, delay: i * 0.35, repeatDelay: 0.1 })
            .to(pkt, { opacity: 1, duration: 0.15 })
            .to(pkt, { attr: { cx: CX, cy: CY }, duration: 0.9, ease: 'power1.inOut' })
            .to(pkt, { opacity: 0, duration: 0.15 })
            .set(pkt, { attr: { cx: pos.x, cy: pos.y } })
            .to(pkt, { duration: 0.3 }); // pause before repeat
        });
      }, [], 1.7);

      // Step 6 — Highlight the "found" path (first node) with a bright pulse
      tl.to(pathRefs.current[HIGHLIGHT_IDX], {
        stroke: '#fff',
        strokeWidth: 3,
        filter: 'drop-shadow(0 0 8px #4ade80)',
        duration: 0.4,
        yoyo: true,
        repeat: 3,
      }, 2.0);
      tl.to(nodeRefs.current[HIGHLIGHT_IDX], {
        boxShadow: '0 0 0 4px rgba(74,222,128,0.6), 0 0 30px rgba(74,222,128,0.4)',
        duration: 0.4,
        yoyo: true,
        repeat: 3,
      }, 2.0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-[#020617] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Header */}
      <div className="absolute top-8 z-20 w-full px-4 text-center pointer-events-none">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary/70 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          Phase 9
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-white">
          Enterprise <span className="text-primary">Knowledge Graph</span>
        </h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          Every document, entity and relationship is indexed as a graph node. Vitech finds hidden connections instantly.
        </p>
      </div>

      {/* Graph container — SVG + HTML nodes overlaid */}
      <div className="relative w-full max-w-[900px] flex-1 flex items-center justify-center overflow-hidden">

        {/* SVG layer — paths + labels + energy packets */}
        <svg
          ref={svgRef}
          viewBox="0 0 900 570"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {NODES.map((_node, i) => (
              <filter key={i} id={`glow-${i}`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
            <filter id="centerGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Connection paths */}
          {NODES.map((node, i) => {
            const p = polar(node.angle);
            return (
              <path
                key={i}
                ref={(el) => { pathRefs.current[i] = el; }}
                d={`M ${CX} ${CY} L ${p.x} ${p.y}`}
                fill="none"
                stroke={node.color}
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
            );
          })}

          {/* Relationship labels on midpoints */}
          {NODES.map((node, i) => {
            const mid = MIDPOINTS[i];
            return (
              <text
                key={i}
                ref={(el) => { relLabelRefs.current[i] = el; }}
                x={mid.x}
                y={mid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="700"
                fontFamily="monospace"
                fill={node.color}
                fillOpacity="0.75"
                letterSpacing="0.08em"
              >
                {node.rel}
              </text>
            );
          })}

          {/* Energy packets — SVG circles that animate along each path */}
          {NODES.map((node, i) => {
            const p = polar(node.angle);
            return (
              <circle
                key={i}
                ref={(el) => { packetRefs.current[i] = el; }}
                cx={p.x}
                cy={p.y}
                r="4"
                fill={node.color}
                filter={`url(#glow-${i})`}
              />
            );
          })}
        </svg>

        {/* HTML node cards — positioned over the SVG */}

        {/* CENTER — Client ABC */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${(CX / 900) * 100}%`,
            top: `${(CY / 570) * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulse ring behind center */}
          <div
            ref={pulseRingRef}
            className="absolute inset-0 rounded-2xl border-2 border-primary"
            style={{ margin: '-8px' }}
          />
          <div
            ref={centerRef}
            className="relative flex flex-col items-center justify-center w-32 h-24 rounded-2xl border-2 border-emerald-400/60 shadow-[0_0_40px_rgba(74,222,128,0.25)] text-center px-3"
            style={{ background: 'rgba(74,222,128,0.08)', backdropFilter: 'blur(12px)' }}
          >
            <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-0.5">Entity</span>
            <span className="text-sm font-black text-white leading-tight">CLIENT ABC</span>
            <div className="mt-1.5 flex gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.6s' }} />
            </div>
          </div>
        </div>

        {/* SATELLITE NODES */}
        {NODES.map((node, i) => {
          const p = polar(node.angle);
          return (
            <div
              key={i}
              ref={(el) => { nodeRefs.current[i] = el; }}
              className="absolute pointer-events-none flex flex-col items-center justify-center text-center px-2.5 py-2 rounded-xl border"
              style={{
                left: `${(p.x / 900) * 100}%`,
                top: `${(p.y / 570) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '108px',
                minHeight: '62px',
                background: node.bg,
                borderColor: node.color + '55',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 0 20px ${node.color}20`,
              }}
            >
              <span
                className="text-[8px] font-bold uppercase tracking-widest mb-0.5"
                style={{ color: node.color, opacity: 0.7 }}
              >
                {node.type}
              </span>
              <span className="text-[10px] font-bold text-white leading-snug">{node.label}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 z-10 flex items-center gap-5 pointer-events-none">
        {[
          { color: '#4ade80', label: 'Document' },
          { color: '#a78bfa', label: 'Supplier' },
          { color: '#38bdf8', label: 'Component' },
          { color: '#fbbf24', label: 'Log' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          </div>
        ))}
        <span className="text-[9px] text-slate-600 ml-2">● = data packet traveling to central entity</span>
      </div>
    </section>
  );
};
