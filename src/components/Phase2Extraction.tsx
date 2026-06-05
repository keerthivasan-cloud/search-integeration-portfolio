import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HEX_CHARS = '0123456789ABCDEF';

const BASE_LINES = [
  '0x98f  a819  f812  9918  01FC',
  'confidential: ████  project: ████',
  'status: ████████████████████████',
  'id: 0x████████...████',
  '0x111  0x222  0x333  0x444',
  '████████  ████  ████████  ████',
];

const DECODED_LINES = [
  '0x98f  a819  f812  9918  01FC',
  'confidential: true  project: "Orion"',
  'status: highly positive confirmed',
  'id: 0x8F92A1B...3D4E',
  '0x111  0x222  0x333  0x444',
  'ENTITY  NODE  EXTRACT  DONE',
];

const entities = [
  { label: 'ENTITY', value: 'Project Orion', type: 'text-emerald-500', x: -200, y: -150 },
  { label: 'CLASSIFICATION', value: 'Confidential', type: 'text-rose-500', x: 250, y: -50 },
  { label: 'VECTOR ID', value: '0x8F92...A1B', type: 'text-blue-500', x: -220, y: 100 },
  { label: 'SENTIMENT', value: 'Highly Positive', type: 'text-amber-500', x: 180, y: 180 },
];

const CARD_COLORS = ['border-emerald-400', 'border-rose-400', 'border-blue-400', 'border-amber-400'];
const PARTICLE_COLORS = ['bg-emerald-400', 'bg-rose-400', 'bg-blue-400', 'bg-amber-400'];

function scrambleLine(line: string): string {
  return line.replace(/█/g, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]);
}

export const Phase2Extraction: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const dataCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[][]>(entities.map(() => Array(6).fill(null)));

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const lockedLinesRef = useRef<boolean[]>([false, false, false, false, false, false]);
  const [bufferLines, setBufferLines] = useState<string[]>(BASE_LINES);

  useEffect(() => {
    const interval = setInterval(() => {
      setBufferLines(
        BASE_LINES.map((line, i) =>
          lockedLinesRef.current[i] ? DECODED_LINES[i] : scrambleLine(line)
        )
      );
    }, 80);

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

      gsap.set(scannerRef.current, { top: '0%', opacity: 0 });
      gsap.set(dataCardsRef.current, { scale: 0, opacity: 0 });
      gsap.set(ringRefs.current, { scale: 1, opacity: 0 });
      gsap.set([step1Ref.current, step2Ref.current, step3Ref.current], { opacity: 0.3, x: -20 });
      particleRefs.current.forEach((group) =>
        group.forEach((p) => { if (p) gsap.set(p, { opacity: 0, x: 0, y: 0 }); })
      );

      // STEP 1
      tl.to(step1Ref.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 0);
      tl.to(scannerRef.current, { opacity: 1, duration: 0.4 }, 0.2);

      // STEP 2: scanner sweeps, locking lines progressively
      tl.to(step1Ref.current, { opacity: 0.3, duration: 0.3 }, 0.8);
      tl.to(step2Ref.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 0.8);
      tl.to(scannerRef.current, {
        top: '90%',
        duration: 1.5,
        ease: 'linear',
        onUpdate: function () {
          const lineIdx = Math.floor(this.progress() * 6);
          for (let i = 0; i <= Math.min(lineIdx, 5); i++) {
            lockedLinesRef.current[i] = true;
          }
        },
      }, 1.0);

      // STEP 3: cards materialise
      tl.to(step2Ref.current, { opacity: 0.3, duration: 0.3 }, 1.8);
      tl.to(step3Ref.current, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, 1.8);
      tl.to(scannerRef.current, { opacity: 0, duration: 0.2 }, 2.4);

      entities.forEach((entity, i) => {
        const cardDelay = 2.0 + i * 0.22;

        // Extraction particles fly toward card
        particleRefs.current[i].forEach((p, k) => {
          if (!p) return;
          const angle = (k / 6) * Math.PI * 2;
          tl.fromTo(p,
            { opacity: 0, x: 0, y: 0 },
            { opacity: 1, x: entity.x * 0.55 + Math.cos(angle) * 12, y: entity.y * 0.55 + Math.sin(angle) * 12, duration: 0.22, ease: 'power2.in' },
            cardDelay + k * 0.02
          );
          tl.to(p, { opacity: 0, x: entity.x, y: entity.y, duration: 0.15, ease: 'power2.in' },
            cardDelay + k * 0.02 + 0.22
          );
        });

        // Card pop
        tl.to(dataCardsRef.current[i], { scale: 1.15, opacity: 1, duration: 0.12, ease: 'power2.out' }, cardDelay + 0.30);
        tl.to(dataCardsRef.current[i], { scale: 1, duration: 0.18, ease: 'back.out(2)' }, cardDelay + 0.42);

        // Ring expand
        tl.fromTo(ringRefs.current[i],
          { scale: 1, opacity: 0.8 },
          { scale: 1.6, opacity: 0, duration: 0.4, ease: 'power2.out' },
          cardDelay + 0.32
        );
      });

      // Exit
      dataCardsRef.current.forEach((card) => {
        if (!card) return;
        tl.to(card, { z: '+=300', opacity: 0, duration: 1, ease: 'power2.in' }, 3.8);
      });
      tl.to(step3Ref.current, { opacity: 0.3, duration: 0.3 }, 3.8);

    }, containerRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

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
          Phase 2: <span className="text-primary">Entity Extraction</span>
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
              <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">Vision Scanning</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">High-powered optical models scan raw data, decoding semantic patterns in real-time.</p>
            </div>
            <div ref={step2Ref} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" /> Step 2
              </div>
              <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">Neural Decode</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Encrypted tokens resolve into structured entities — names, IDs, and classifications — live.</p>
            </div>
            <div ref={step3Ref} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
                <CheckCircle2 className="w-4 h-4" /> Step 3
              </div>
              <h3 className="text-xl font-bold text-slate-900 drop-shadow-sm">Entity Materialisation</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Normalised entities emerge as structured metadata cards, ready for vector embedding.</p>
            </div>
          </div>
        </div>

        {/* Right: Animation area */}
        <div className="w-full lg:w-3/5 h-full relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

          {/* Live-scrambling data buffer */}
          <div className="relative w-80 h-[28rem] rounded-2xl flex flex-col justify-center z-20 overflow-hidden bg-slate-900/5 backdrop-blur-sm border border-slate-200/50 shadow-inner">
            <div className="font-mono text-xs px-8 py-6 w-full space-y-3 select-none">
              {bufferLines.map((line, i) => (
                <div
                  key={i}
                  className="leading-relaxed"
                  style={{
                    color: lockedLinesRef.current[i] ? '#4ade80' : undefined,
                    opacity: lockedLinesRef.current[i] ? 1 : 0.5,
                    fontWeight: lockedLinesRef.current[i] ? 700 : 400,
                    textShadow: lockedLinesRef.current[i] ? '0 0 8px rgba(74,222,128,0.5)' : undefined,
                    transition: 'color 0.2s, opacity 0.2s',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Gradient scanner band */}
            <div
              ref={scannerRef}
              className="absolute left-0 w-full z-30 pointer-events-none"
              style={{
                height: '44px',
                top: '0%',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(74,222,128,0.12) 25%, rgba(74,222,128,0.55) 50%, rgba(74,222,128,0.12) 75%, transparent 100%)',
                boxShadow: '0 0 28px 8px rgba(74,222,128,0.25)',
              }}
            >
              <div className="absolute left-0 w-full h-px bg-primary top-1/2" style={{ boxShadow: '0 0 10px 3px #4ade80' }} />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 w-20 bg-white/80 rounded-full blur-sm"
                style={{ animation: 'scanLine 1.1s linear infinite' }}
              />
            </div>
          </div>

          {/* Extraction particles (6 per card) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 25 }}>
            {entities.map((_, cardIdx) =>
              Array.from({ length: 6 }, (__, k) => (
                <div
                  key={`p-${cardIdx}-${k}`}
                  ref={(el) => { particleRefs.current[cardIdx][k] = el; }}
                  className={`absolute w-1.5 h-1.5 rounded-full ${PARTICLE_COLORS[cardIdx]}`}
                  style={{ boxShadow: '0 0 6px currentColor' }}
                />
              ))
            )}
          </div>

          {/* Entity cards */}
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {entities.map((entity, i) => (
              <div
                key={`entity-${i}`}
                ref={(el) => { dataCardsRef.current[i] = el; }}
                className={`absolute flex items-center gap-4 bg-white/95 px-6 py-3 rounded-xl border-2 ${CARD_COLORS[i]} shadow-[0_15px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl`}
                style={{ transform: `translate(${entity.x}px, ${entity.y}px)`, transformStyle: 'preserve-3d' }}
              >
                {/* Expanding ring overlay */}
                <div
                  ref={(el) => { ringRefs.current[i] = el; }}
                  className={`absolute inset-0 rounded-xl border-2 ${CARD_COLORS[i]} pointer-events-none`}
                  style={{ opacity: 0 }}
                />
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Network className={`w-5 h-5 ${entity.type}`} />
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-400 font-bold tracking-widest">{entity.label}</div>
                  <div className="font-sans text-sm font-black text-slate-800">{entity.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
