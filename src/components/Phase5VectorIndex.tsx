import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CODE_LINES = [
  { text: 'POST /collections/vitech/points', color: 'text-emerald-400' },
  { text: '{', color: 'text-slate-300' },
  { text: '  "ids": ["chunk_0xA3F2", "chunk_0xB7E1"],', color: 'text-slate-400' },
  { text: '  "vectors": [[0.12, -0.87, 0.43, ...]],', color: 'text-blue-300' },
  { text: '  "payload": {', color: 'text-slate-300' },
  { text: '    "file": "shaft_drawing_v3.pdf",', color: 'text-amber-300' },
  { text: '    "page": 4,', color: 'text-amber-300' },
  { text: '    "client": "ABC Corp",', color: 'text-amber-300' },
  { text: '    "dim_diameter_mm": 60.0', color: 'text-cyan-300' },
  { text: '  }', color: 'text-slate-300' },
  { text: '}', color: 'text-slate-300' },
  { text: '→ 201 Created  ✓  indexed in 12ms', color: 'text-emerald-400' },
];

function generateHexGrid(cols: number, rows: number, hexR: number) {
  const hexes: { x: number; y: number; key: string }[] = [];
  const w = hexR * Math.sqrt(3);
  const h = hexR * 2;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * w + (row % 2 === 1 ? w / 2 : 0) + hexR;
      const y = row * h * 0.75 + hexR;
      hexes.push({ x, y, key: `${row}-${col}` });
    }
  }
  return hexes;
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(' ');
}

const PARTICLE_COUNT = 20;

export const Phase5VectorIndex: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hexRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const COLS = 7;
  const ROWS = 5;
  const HEX_R = 22;
  const hexes = useMemo(() => generateHexGrid(COLS, ROWS, HEX_R), []);
  const svgW = COLS * HEX_R * Math.sqrt(3) + HEX_R * 2;
  const svgH = ROWS * HEX_R * 2 * 0.75 + HEX_R * 2;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(codeLineRefs.current, { opacity: 0, x: -20 });
      gsap.set(hexRefs.current, { opacity: 0, scale: 0.5, transformOrigin: 'center' });
      gsap.set(particleRefs.current, { opacity: 0, x: 0, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      });

      // 0–20%: code lines stagger in
      tl.to(codeLineRefs.current, { opacity: 1, x: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out' }, 0);

      // 15–60%: particle stream from code block to hex grid
      particleRefs.current.forEach((p, i) => {
        if (!p) return;
        // Target positions spread across the hex grid area (right side)
        const col = i % COLS;
        const row = Math.floor(i / COLS) % ROWS;
        const targetX = 120 + col * 30 + (row % 2 === 1 ? 15 : 0);
        const targetY = (row - 2) * 30 + Math.sin(i) * 15;
        tl.fromTo(p,
          { opacity: 0, x: -60, y: (Math.random() - 0.5) * 40 },
          {
            opacity: 1,
            x: targetX,
            y: targetY,
            duration: 0.25,
            ease: 'power2.in',
          },
          0.4 + i * 0.06
        );
        tl.to(p, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0.65 + i * 0.06);
      });

      // 20–60%: hexes fill one by one
      tl.to(
        hexRefs.current,
        {
          opacity: 1,
          scale: 1,
          fill: 'rgba(74,222,128,0.25)',
          stagger: 0.04,
          duration: 0.3,
          ease: 'back.out(1.5)',
        },
        0.5
      );

      // 40–60%: pulse random hexes — done via CSS class toggle in GSAP
      tl.to(
        hexRefs.current.filter((_, i) => i % 3 === 0),
        { filter: 'drop-shadow(0 0 8px #4ade80)', duration: 0.3, yoyo: true, repeat: 1 },
        1.2
      );

      // 60–80%: counter counts up
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 2847,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(counter.val).toLocaleString();
            }
          },
        },
        1.6
      );

      // 80–100%: fade content (not the wrapper — fading the wrapper hides pinned section entirely)
      tl.to([codeLineRefs.current, hexRefs.current], { opacity: 0, y: -20, stagger: 0.02, duration: 0.4 }, 2.6);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-dark overflow-hidden flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="absolute top-24 z-10 w-full px-4 text-center pointer-events-none">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary/60 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          Phase 5
        </span>
        <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white">
          Vector <span className="text-primary">Indexing</span>
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Each chunk is written to Qdrant with full metadata payload, enabling millisecond ANN search.
        </p>
      </div>

      {/* Particle stream — dots flying from code block to hex grid */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <div
          key={`particle-${i}`}
          ref={(el) => { particleRefs.current[i] = el; }}
          className="absolute z-20 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
          style={{
            left: '30%',
            top: '50%',
            boxShadow: '0 0 6px #4ade80',
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 mt-20 px-6 w-full max-w-5xl">
        {/* Code block */}
        <div className="flex-1 bg-slate-900/80 rounded-2xl border border-slate-700 p-6 font-mono text-xs leading-6 min-w-0 max-w-md w-full">
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-slate-500 text-[10px]">qdrant_indexer.py</span>
          </div>
          {CODE_LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => { codeLineRefs.current[i] = el; }}
              className={`${line.color} whitespace-pre`}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Hex grid */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full max-w-xs">
            <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Qdrant Collection</span>
            <div className="text-right">
              <span className="font-mono text-2xl font-black text-primary" ref={counterRef}>0</span>
              <span className="text-xs text-slate-500 ml-1">vectors indexed</span>
            </div>
          </div>
          <svg
            width={svgW}
            height={svgH}
            className="overflow-visible"
          >
            {hexes.map(({ x, y, key }, i) => (
              <polygon
                key={key}
                ref={(el) => { hexRefs.current[i] = el; }}
                points={hexPoints(x, y, HEX_R - 3)}
                fill="transparent"
                stroke="rgba(74,222,128,0.3)"
                strokeWidth="1.5"
              />
            ))}
          </svg>
          <p className="text-xs text-slate-600 font-mono">vitech_docs · 1536 dimensions</p>
        </div>
      </div>
    </section>
  );
};
