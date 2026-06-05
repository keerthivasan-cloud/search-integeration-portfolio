import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Scissors, Braces, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const chunks = [
  { id: 1, title: 'Chunk A: Architecture', subtitle: 'Tokens: 142', content: 'The Orion neural architecture utilises a 1536-dimensional vector space for maximum semantic recall...', y: -210, z: -150, rotX: 15, borderColor: 'border-l-4 border-primary' },
  { id: 2, title: 'Chunk B: Performance', subtitle: 'Tokens: 89', content: 'Latency is heavily reduced via local embeddings on the edge, enabling sub-50ms hybrid search queries...', y: -70, z: -50, rotX: 10, borderColor: 'border-l-4 border-blue-400' },
  { id: 3, title: 'Chunk C: Security', subtitle: 'Tokens: 210', content: 'All documents are chunked and embedded within a secure enclave. Raw text is never exposed to external APIs...', y: 70, z: 50, rotX: 5, borderColor: 'border-l-4 border-amber-400' },
  { id: 4, title: 'Chunk D: Integration', subtitle: 'Tokens: 175', content: 'Compatible with standard REST endpoints and WebSockets for real-time ingestion pipelines...', y: 210, z: 150, rotX: 0, borderColor: 'border-l-4 border-violet-400' },
];

const ZONE_COLORS = [
  'rgba(74,222,128,0.18)',   // emerald
  'rgba(96,165,250,0.18)',   // blue
  'rgba(251,191,36,0.18)',   // amber
  'rgba(167,139,250,0.18)',  // violet
];

export const Phase3Chunking: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const cutLinesRef = useRef<(SVGLineElement | null)[]>([]);
  const zoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chunkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fragmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Pre-compute random fragment explosion vectors so they're stable (not re-randomised on re-render)
  const fragmentVectors = useMemo(() =>
    Array.from({ length: 12 }, (_, k) => {
      const col = k % 3;
      const row = Math.floor(k / 3);
      return {
        x: (col - 1) * (70 + Math.random() * 110),
        y: (row - 1.5) * (55 + Math.random() * 75),
        rot: (Math.random() - 0.5) * 42,
        delay: k * 0.014,
      };
    }), []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        },
      });

      // Initial states
      gsap.set(blockRef.current, { scale: 0, opacity: 0, rotationY: 45 });
      gsap.set(scannerRef.current, { top: '0%', opacity: 0 });
      gsap.set(zoneRefs.current, { opacity: 0 });
      gsap.set(cutLinesRef.current, { strokeDasharray: 320, strokeDashoffset: 320, opacity: 1 });
      gsap.set(fragmentRefs.current, { opacity: 0, x: 0, y: 0, rotation: 0 });
      gsap.set([step1Ref.current, step2Ref.current, step3Ref.current], { opacity: 0.3, x: -20 });

      // STEP 1: Block compiles
      tl.to(step1Ref.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 0);
      tl.to(blockRef.current, { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, ease: 'back.out(1.2)' }, 0);

      // STEP 2: Scanner sweeps + semantic zones colour progressively
      tl.to(step1Ref.current, { opacity: 0.3, duration: 0.3 }, 1.2);
      tl.to(step2Ref.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 1.2);

      tl.to(scannerRef.current, { opacity: 1, duration: 0.2 }, 1.2);
      tl.to(scannerRef.current, { top: '100%', duration: 0.9, ease: 'linear' }, 1.4);
      tl.to(blockRef.current, { boxShadow: '0 0 60px rgba(74,222,128,0.35)', duration: 0.4 }, 1.4);

      // Zones appear as scanner passes each quarter
      tl.to(zoneRefs.current[0], { opacity: 1, duration: 0.15 }, 1.4);
      tl.to(zoneRefs.current[1], { opacity: 1, duration: 0.15 }, 1.62);
      tl.to(zoneRefs.current[2], { opacity: 1, duration: 0.15 }, 1.84);
      tl.to(zoneRefs.current[3], { opacity: 1, duration: 0.15 }, 2.06);

      tl.to(scannerRef.current, { opacity: 0, duration: 0.2 }, 2.3);

      // Cut lines draw across (SVG is a sibling, not inside blockRef)
      tl.to(cutLinesRef.current, {
        strokeDashoffset: 0,
        duration: 0.14,
        stagger: 0.09,
        ease: 'power2.inOut',
      }, 2.3);

      // STEP 3: Fragment shatter
      tl.to(step2Ref.current, { opacity: 0.3, duration: 0.3 }, 2.5);
      tl.to(step3Ref.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 2.5);

      // Block snaps invisible; fragment grid snaps visible
      tl.to(blockRef.current, { opacity: 0, duration: 0.04 }, 2.44);
      tl.to(fragmentRefs.current, { opacity: 1, duration: 0.04 }, 2.44);

      // Fragments explode outward
      fragmentVectors.forEach(({ x, y, rot, delay }, k) => {
        const frag = fragmentRefs.current[k];
        if (!frag) return;
        tl.to(frag, {
          x, y, rotation: rot, opacity: 0,
          duration: 0.65, ease: 'power2.out',
        }, 2.48 + delay);
      });

      // Cut lines fade after shatter
      tl.to(cutLinesRef.current, { opacity: 0, duration: 0.25 }, 2.7);

      // Chunk cards cascade out
      chunkRefs.current.forEach((chunk, i) => {
        if (!chunk) return;
        gsap.set(chunk, { opacity: 0, scale: 0.8, x: 0, y: 0, z: 0, rotationX: 0 });
        tl.to(chunk, {
          opacity: 1, scale: 1,
          y: chunks[i].y, z: chunks[i].z, rotationX: chunks[i].rotX,
          duration: 1.1, ease: 'elastic.out(1, 0.75)',
        }, 2.75 + i * 0.1);
      });

      // Exit
      chunkRefs.current.forEach((chunk) => {
        if (!chunk) return;
        tl.to(chunk, { y: '100vh', opacity: 0, duration: 1, ease: 'power2.in' }, 4.5);
      });
      tl.to(step3Ref.current, { opacity: 0.3, duration: 0.3 }, 4.5);

    }, containerRef);

    return () => ctx.revert();
  }, [fragmentVectors]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-premium-gradient overflow-hidden flex pt-32"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Title */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 w-full px-4 pointer-events-none text-center lg:opacity-0 transition-opacity" style={{ transform: 'translateZ(100px)' }}>
        <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,1)] text-slate-900">
          Phase 3: <span className="text-primary">Semantic Chunking</span>
        </h2>
      </div>

      <div className="relative w-full h-full flex flex-col lg:flex-row z-20">

        {/* Left: Narrative HUD */}
        <div className="w-full lg:w-2/5 h-full flex flex-col justify-center px-8 md:px-16 pointer-events-none z-40 hidden lg:flex">
          <div className="flex flex-col gap-12 max-w-sm">
            <div ref={step1Ref} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" /> Step 1
              </div>
              <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">Text Compilation</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Raw entities and text are aggregated into a contiguous data block.</p>
            </div>
            <div ref={step2Ref} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" /> Step 2
              </div>
              <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">Semantic Analysis</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">The system identifies context boundaries and maps coloured semantic zones within the block.</p>
            </div>
            <div ref={step3Ref} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" /> Step 3
              </div>
              <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">Shatter & Chunk</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">The block shatters along semantic boundaries. Each fragment materialises as an independent chunk card.</p>
            </div>
          </div>
        </div>

        {/* Right: Central Animation */}
        <div className="w-full lg:w-3/5 h-full relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

          {/* The Solid Data Block */}
          <div
            ref={blockRef}
            className="absolute w-80 h-[28rem] bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white flex flex-col items-center justify-center z-20 overflow-hidden"
          >
            {/* Semantic zone overlays */}
            {ZONE_COLORS.map((color, i) => (
              <div
                key={i}
                ref={(el) => { zoneRefs.current[i] = el; }}
                className="absolute left-0 w-full"
                style={{
                  top: `${i * 25}%`,
                  height: '25%',
                  background: `linear-gradient(to right, ${color}, transparent 80%)`,
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.3)' : undefined,
                }}
              />
            ))}

            <Database className="w-16 h-16 text-slate-300 mb-8 relative z-10" />
            <div className="space-y-4 w-3/4 relative z-10">
              <div className="w-full h-2.5 bg-slate-200 rounded-full" />
              <div className="w-5/6 h-2.5 bg-slate-200 rounded-full" />
              <div className="w-full h-2.5 bg-slate-200 rounded-full" />
              <div className="w-4/5 h-2.5 bg-slate-200 rounded-full" />
              <div className="w-full h-2.5 bg-slate-200 rounded-full" />
              <div className="w-2/3 h-2.5 bg-slate-200 rounded-full" />
              <div className="w-5/6 h-2.5 bg-slate-200 rounded-full" />
            </div>

            {/* Laser scanner */}
            <div ref={scannerRef} className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_20px_5px_rgba(16,185,129,0.6)] z-30">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-2 bg-white rounded-full blur-[2px]" />
            </div>
          </div>

          {/* Cut lines SVG — sibling of blockRef, NOT inside it */}
          <svg
            className="absolute z-30 pointer-events-none"
            style={{ width: '320px', height: '448px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            viewBox="0 0 320 448"
            preserveAspectRatio="none"
          >
            {[112, 224, 336].map((y, i) => (
              <line
                key={i}
                ref={(el) => { cutLinesRef.current[i] = el; }}
                x1="0" y1={y} x2="320" y2={y}
                stroke="#4ade80" strokeWidth="2.5"
                strokeDasharray="320" strokeDashoffset="320"
                filter="url(#cutGlow)"
              />
            ))}
            <defs>
              <filter id="cutGlow" x="-10%" y="-80%" width="120%" height="260%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
          </svg>

          {/* Fragment shatter grid — 3 cols × 4 rows, sibling of blockRef */}
          {fragmentVectors.map(({ }, k) => (
            <div
              key={`frag-${k}`}
              ref={(el) => { fragmentRefs.current[k] = el; }}
              className="absolute bg-white/90 border border-primary/15 pointer-events-none"
              style={{
                width: '106px',
                height: '112px',
                left: `calc(50% - 160px + ${(k % 3) * 106}px)`,
                top: `calc(50% - 224px + ${Math.floor(k / 3) * 112}px)`,
                opacity: 0,
                zIndex: 21,
              }}
            />
          ))}

          {/* Floating 3D Chunk cards */}
          <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {chunks.map((chunk, i) => (
              <div
                key={chunk.id}
                ref={(el) => { chunkRefs.current[i] = el; }}
                className={`absolute p-6 w-80 bg-white/95 rounded-2xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col gap-4 backdrop-blur-2xl ${chunk.borderColor}`}
                style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%)' }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3" style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black text-slate-800 tracking-wider uppercase">{chunk.title}</span>
                  </div>
                  <span className="text-[10px] bg-primary/10 px-2 py-1 rounded-full text-primary font-mono font-bold">{chunk.subtitle}</span>
                </div>
                <div className="flex gap-3 items-start" style={{ transform: 'translateZ(10px)' }}>
                  <Braces className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                  <p className="font-mono text-sm text-slate-600 leading-relaxed font-medium">
                    {chunk.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
