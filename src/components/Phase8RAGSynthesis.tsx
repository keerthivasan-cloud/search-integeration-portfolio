import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Search, Zap, Brain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Card height in px — must match the h-20 (80px) class on each card
const CARD_H = 80;
const CARD_GAP = 10;
// SVG coordinate centres for each card
const CARD_Y = [
  CARD_H / 2,                         // card 0 → 40
  CARD_H + CARD_GAP + CARD_H / 2,     // card 1 → 130
  CARD_H * 2 + CARD_GAP * 2 + CARD_H / 2, // card 2 → 220
];
const SVG_H = CARD_H * 3 + CARD_GAP * 2; // 260
const CONV_Y = CARD_Y[1]; // 130 — convergence at middle card

const SOURCES = [
  {
    file: 'shaft_drawing_v3.pdf', page: 4,
    label: 'Chunk 1',
    text: 'Main drive shaft outer diameter:',
    highlight: '60.0 mm ± 0.02',
    borderColor: 'border-l-4 border-emerald-400',
    hlColor: 'bg-emerald-50 text-emerald-700 font-semibold rounded px-0.5',
    dotColor: 'bg-emerald-400',
    lineColor: '#4ade80',
  },
  {
    file: 'supplier_spec_abc.docx', page: 2,
    label: 'Chunk 2',
    text: 'Bearing journal surface finish:',
    highlight: 'Ra ≤ 0.8 μm per DIN ISO 1302',
    borderColor: 'border-l-4 border-blue-400',
    hlColor: 'bg-blue-50 text-blue-700 font-semibold rounded px-0.5',
    dotColor: 'bg-blue-400',
    lineColor: '#60a5fa',
  },
  {
    file: 'maintenance_log_q3.xlsx', page: 1,
    label: 'Chunk 3',
    text: 'Replacement interval for shaft assembly:',
    highlight: '18 months or 4,500 operating hours',
    borderColor: 'border-l-4 border-amber-400',
    hlColor: 'bg-amber-50 text-amber-700 font-semibold rounded px-0.5',
    dotColor: 'bg-amber-400',
    lineColor: '#fbbf24',
  },
];

const ANSWER_SEGMENTS = [
  { text: 'The main drive shaft for Client ABC has an outer diameter of ', highlight: false },
  { text: '60.0 mm ± 0.02', highlight: true, color: 'bg-emerald-50 text-emerald-700 font-semibold rounded px-0.5' },
  { text: ' with surface roughness ', highlight: false },
  { text: 'Ra ≤ 0.8 μm', highlight: true, color: 'bg-blue-50 text-blue-700 font-semibold rounded px-0.5' },
  { text: ' per DIN ISO 1302. Scheduled replacement is every ', highlight: false },
  { text: '18 months or 4,500 operating hours', highlight: true, color: 'bg-amber-50 text-amber-700 font-semibold rounded px-0.5' },
  { text: '.', highlight: false },
];

const SEGMENT_STARTS = ANSWER_SEGMENTS.reduce<number[]>((acc, _seg, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + ANSWER_SEGMENTS[i - 1].text.length);
  return acc;
}, []);

const FULL_ANSWER = ANSWER_SEGMENTS.map((s) => s.text).join('');

export const Phase8RAGSynthesis: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const queryBarRef = useRef<HTMLDivElement>(null);
  const chunkRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const processingRef = useRef<HTMLDivElement>(null);
  const answerCardRef = useRef<HTMLDivElement>(null);
  const citationRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(queryBarRef.current, { opacity: 0, y: 12 });
      gsap.set(chunkRefs.current, { opacity: 0, x: -28 });
      gsap.set(processingRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(answerCardRef.current, { opacity: 0, y: 14 });
      gsap.set(citationRefs.current, { opacity: 0, y: 5 });

      // Compute path lengths and set dash arrays AFTER render
      pathRefs.current.forEach((p) => {
        if (!p) return;
        const len = p.getTotalLength?.() ?? 120;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        },
      });

      // Step 1 — query bar
      tl.to(queryBarRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0);

      // Step 2 — source chunk cards
      tl.to(chunkRefs.current, { opacity: 1, x: 0, stagger: 0.14, duration: 0.35, ease: 'power2.out' }, 0.5);

      // Step 3 — connector paths draw from each card to convergence point
      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength?.() ?? 120;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, opacity: 1, duration: 0.28, ease: 'power2.inOut' }, 1.1 + i * 0.08);
      });

      // Step 4 — AI processing appears
      tl.to(processingRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.5)' }, 1.4);

      // Step 5 — answer card replaces processing
      tl.to(processingRef.current, { opacity: 0, scale: 0.95, duration: 0.2 }, 1.85);
      tl.to(answerCardRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 1.9);

      // Step 6 — typewriter with colour-coded provenance
      const prog = { p: 0 };
      tl.to(prog, {
        p: 1,
        duration: 1.2,
        ease: 'none',
        onUpdate: () => {
          setDisplayedText(FULL_ANSWER.substring(0, Math.round(prog.p * FULL_ANSWER.length)));
        },
      }, 1.9);

      // Step 7 — citations
      tl.to(citationRefs.current, { opacity: 1, y: 0, stagger: 0.08, duration: 0.2 }, 3.0);

      // Exit: fade content, NOT the section wrapper
      tl.to(bodyRef.current, { opacity: 0, y: -18, duration: 0.4 }, 3.5);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full bg-premium-gradient overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Fixed header */}
      <div className="absolute top-8 z-20 w-full px-4 text-center pointer-events-none">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary/70 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
          Phase 8
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
          RAG <span className="text-primary">Answer Synthesis</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Ranked chunks are injected into the LLM context window. The model synthesises a precise, cited answer.
        </p>
      </div>

      {/* Animated body */}
      <div
        ref={bodyRef}
        className="relative z-10 flex flex-col items-center justify-center h-full pt-28 pb-6 px-4 gap-4"
      >
        {/* ── Row 0: Query bar (full width above the 3 columns) ── */}
        <div
          ref={queryBarRef}
          className="flex items-center gap-3 bg-white rounded-xl border-2 border-primary/50 shadow-[0_0_20px_rgba(74,222,128,0.18)] px-4 py-2.5 w-full max-w-[710px]"
        >
          <Search className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-mono text-slate-700 font-medium flex-1">
            shaft specs for Client ABC?
          </span>
          <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold tracking-widest uppercase shrink-0">
            Query
          </span>
        </div>

        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest self-start ml-[14px]">
          ↓ Retrieved 3 matching chunks
        </p>

        {/* ── Row 1: 3-column flex (cards | SVG | answer) ── */}
        <div className="flex items-start gap-0">

          {/* Column A — Source cards with FIXED height */}
          <div className="flex flex-col w-[280px] shrink-0" style={{ gap: `${CARD_GAP}px` }}>
            {SOURCES.map((src, i) => (
              <div
                key={i}
                ref={(el) => { chunkRefs.current[i] = el; }}
                className={`bg-white rounded-xl border border-slate-200 px-3.5 flex flex-col justify-center ${src.borderColor} shadow-sm`}
                style={{ height: `${CARD_H}px` }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{src.label}</span>
                  <span className="ml-auto text-[9px] font-mono text-slate-400 truncate max-w-[120px]">{src.file}</span>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">p.{src.page}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {src.text}{' '}
                  <span className={src.hlColor}>{src.highlight}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Column B — SVG connector: exact positions derived from CARD_H + CARD_GAP */}
          <svg
            width="100"
            height={SVG_H}
            viewBox={`0 0 100 ${SVG_H}`}
            className="shrink-0 overflow-visible hidden lg:block"
          >
            {/* 3 paths: each starts at left (x=0, y=card centre) and curves to convergence (x=98, y=CONV_Y) */}
            {CARD_Y.map((cardY, i) => (
              <path
                key={i}
                ref={(el) => { pathRefs.current[i] = el; }}
                d={cardY === CONV_Y
                  ? `M 0 ${cardY} L 98 ${CONV_Y}`                          // middle card: straight line
                  : `M 0 ${cardY} C 50 ${cardY}, 50 ${CONV_Y}, 98 ${CONV_Y}` // top/bottom: smooth curve
                }
                fill="none"
                stroke={SOURCES[i].lineColor}
                strokeWidth="1.8"
                opacity="0"
              />
            ))}
            {/* Convergence dot */}
            <circle cx="98" cy={CONV_Y} r="5" fill="#4ade80" fillOpacity="0.9" />
            <circle cx="98" cy={CONV_Y} r="9" fill="#4ade80" fillOpacity="0.18" />
            {/* Arrow tip into right column */}
            <polyline
              points={`93,${CONV_Y - 5} 98,${CONV_Y} 93,${CONV_Y + 5}`}
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Column C — AI processing + answer */}
          <div className="flex flex-col gap-3 w-[320px] shrink-0">
            {/* Processing indicator */}
            <div
              ref={processingRef}
              className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center gap-3 shadow-sm"
            >
              <Brain className="w-5 h-5 text-primary shrink-0 animate-pulse" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Ollama synthesising…</span>
                  <span className="text-[9px] font-mono text-slate-400">llama3.2</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: '68%', animation: 'shimmer 1.4s linear infinite' }}
                  />
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${k * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Answer card */}
            <div
              ref={answerCardRef}
              className="bg-white rounded-2xl border-2 border-primary/25 shadow-[0_4px_28px_rgba(74,222,128,0.12)] p-4"
            >
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Vitech Answer</span>
                <span className="ml-auto text-[9px] font-mono text-slate-400">model: llama3.2</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1" />
              </div>

              {/* Colour-coded typewriter — colours match source card borders */}
              <p className="text-[12px] text-slate-700 leading-relaxed min-h-[76px]">
                {ANSWER_SEGMENTS.map((seg, i) => {
                  const segStart = SEGMENT_STARTS[i];
                  const segEnd = segStart + seg.text.length;
                  const charLen = displayedText.length;
                  if (charLen <= segStart) return null;
                  const visible = charLen >= segEnd ? seg.text : seg.text.substring(0, charLen - segStart);
                  return (
                    <span key={i} className={seg.highlight ? seg.color : undefined}>
                      {visible}
                    </span>
                  );
                })}
                <span className="animate-pulse text-primary font-bold">|</span>
              </p>

              {/* Citation badges */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest self-center mr-0.5">
                  Sources:
                </span>
                {SOURCES.map((src, i) => (
                  <div
                    key={i}
                    ref={(el) => { citationRefs.current[i] = el; }}
                    className="inline-flex items-center gap-1 text-[9px] font-mono bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${src.dotColor} shrink-0`} />
                    <FileText className="w-2.5 h-2.5 shrink-0" />
                    {src.file.replace(/\.[^.]+$/, '')}…p.{src.page}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
