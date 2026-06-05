import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutDashboard, TrendingUp, DollarSign, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const initialResults = [
  { id: 'A', score: 62, title: 'sales_2024.xlsx', desc: 'Raw financial data for Q1-Q4', keyword: 40, semantic: 22 },
  { id: 'B', score: 98, title: 'abc_client_invoice.pdf', desc: 'Exact match: Invoice #4587', highlight: true, keyword: 55, semantic: 43 },
  { id: 'C', score: 75, title: 'client_meeting_notes.docx', desc: 'Mentions ABC client and billing', keyword: 38, semantic: 37 },
];

export const Phase7NeuralRanking: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hudRef = useRef<HTMLDivElement>(null);
  const hudElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const barRefs = useRef<(HTMLDivElement | null)[][]>(initialResults.map(() => [null, null]));
  const [scores, setScores] = useState({ A: 0, B: 0, C: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
        },
      });

      // 1. Initial Card Appearance (3D folding in)
      tl.fromTo(resultsRef.current,
        { opacity: 0, rotationX: -90, transformOrigin: "top center", y: 50 },
        { opacity: 1, rotationX: 0, y: 0, stagger: 0.2, duration: 0.6, ease: "back.out(1.5)" }
      );

      // 2. Scores Animate
      tl.to({}, {
        duration: 0.5,
        onUpdate: function() {
          const p = this.progress();
          setScores({
            A: Math.round(p * initialResults[0].score),
            B: Math.round(p * initialResults[1].score),
            C: Math.round(p * initialResults[2].score),
          });
        }
      });

      // 2.5. Animate score breakdown bars after score count-up
      initialResults.forEach((result, i) => {
        const bars = barRefs.current[i];
        if (bars[0]) gsap.set(bars[0], { width: 0 });
        if (bars[1]) gsap.set(bars[1], { width: 0 });
        tl.to(bars[0], { width: `${result.keyword}%`, duration: 0.35, ease: 'power2.out' }, 0.7 + i * 0.08);
        tl.to(bars[1], { width: `${result.semantic}%`, duration: 0.35, ease: 'power2.out' }, 0.82 + i * 0.08);
      });

      // 3. 3D Reorder Animation
      const rowHeight = 110; 
      // A (0) goes down 2
      tl.to(resultsRef.current[0], { 
        y: rowHeight * 2, 
        rotationX: 360, 
        scale: 0.9, 
        opacity: 0.5,
        duration: 1, 
        ease: "power2.inOut" 
      }, "reorder");

      // B (1) goes up 1, highlights strongly
      tl.to(resultsRef.current[1], { 
        y: -rowHeight * 1, 
        rotationX: -360, 
        scale: 1.1, 
        boxShadow: "0 0 40px rgba(16,185,129,0.5)",
        borderColor: "rgba(16,185,129,1)",
        duration: 1, 
        ease: "power2.inOut" 
      }, "reorder");

      // C (2) goes up 1
      tl.to(resultsRef.current[2], { 
        y: -rowHeight * 1, 
        rotationX: -360, 
        duration: 1, 
        ease: "power2.inOut" 
      }, "reorder");

      // 4. Sci-Fi HUD Assembly (Phase 8)
      // HUD Background appears with clip-path wipe
      tl.fromTo(hudRef.current,
        { clipPath: "inset(50% 50% 50% 50%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.5, ease: "power3.inOut" },
        "+=0.2"
      );

      // Inner elements pop in staggered with 3D scale
      tl.fromTo(hudElementsRef.current,
        { scale: 0, rotationY: 90, opacity: 0 },
        { scale: 1, rotationY: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.5)" }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full bg-slate-50 overflow-hidden flex flex-col md:flex-row items-center justify-center p-8 gap-12"
      style={{ perspective: '1200px' }}
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Left: Neural Ranking */}
      <div className="w-full md:w-1/2 flex flex-col z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
          Phase 7: Neural Ranking
        </h2>
        <p className="text-slate-600 mb-8 max-w-md">Results undergo 3D dynamic reordering based on intense semantic vector scoring.</p>
        
        <div className="flex flex-col gap-5 relative h-[350px]">
          {initialResults.map((result, i) => (
            <div 
              key={result.id}
              ref={(el) => { resultsRef.current[i] = el; }}
              className="absolute w-full max-w-md glass-card p-5 rounded-xl border border-slate-200 flex items-center justify-between"
              style={{ top: i * 110, transformStyle: 'preserve-3d' }}
            >
              <div>
                <h4 className={`font-mono text-lg font-bold ${result.highlight ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-slate-900'}`}>
                  {result.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{result.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 min-w-[100px]">
                <span className={`text-3xl font-black ${result.highlight ? 'text-emerald-400' : 'text-slate-700'}`}>
                  {scores[result.id as keyof typeof scores]}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Relevance</span>
                {/* Score breakdown bars */}
                <div className="w-full flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-blue-400 font-mono w-12 text-right shrink-0">keyword</span>
                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div ref={(el) => { barRefs.current[i][0] = el; }} className="h-full bg-blue-400 rounded-full" style={{ width: 0 }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-primary font-mono w-12 text-right shrink-0">semantic</span>
                    <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div ref={(el) => { barRefs.current[i][1] = el; }} className="h-full bg-primary rounded-full" style={{ width: 0 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Sci-Fi HUD */}
      <div 
        ref={hudRef}
        className="w-full md:w-1/2 z-10 glass-card rounded-2xl border border-blue-500/40 p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative backdrop-blur-2xl bg-white/"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute -top-4 -left-4 bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg border border-slate-200">
          <LayoutDashboard className="w-6 h-6 text-slate-900" />
        </div>
        
        <h2 className="text-2xl font-bold mb-1 text-blue-400 mt-2 tracking-widest uppercase">Intelligence HUD</h2>
        <p className="text-sm text-slate-600 mb-6 border-b border-slate-200 pb-4">Real-time structured extraction assembled via spatial masking.</p>
        
        <div className="grid grid-cols-2 gap-4" style={{ perspective: '800px' }}>
          {/* Component 1 */}
          <div ref={(el) => { hudElementsRef.current[0] = el; }} className="bg-gradient-to-br from-white/5 to-white/0 border border-slate-200 p-5 rounded-xl flex flex-col shadow-inner backdrop-blur-md">
            <DollarSign className="w-6 h-6 text-emerald-400 mb-3 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-slate-500 text-xs uppercase tracking-widest">Revenue Detected</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 font-mono">₹5.2M</span>
          </div>
          
          {/* Component 2 */}
          <div ref={(el) => { hudElementsRef.current[1] = el; }} className="bg-gradient-to-br from-white/5 to-white/0 border border-slate-200 p-5 rounded-xl flex flex-col shadow-inner backdrop-blur-md">
            <TrendingUp className="w-6 h-6 text-blue-400 mb-3 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-slate-500 text-xs uppercase tracking-widest">YOY Growth</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 font-mono">+28%</span>
          </div>
          
          {/* Component 3 */}
          <div ref={(el) => { hudElementsRef.current[2] = el; }} className="col-span-2 bg-gradient-to-br from-white/5 to-white/0 border border-slate-200 p-5 rounded-xl flex items-center justify-between shadow-inner backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase tracking-widest block mb-1">Top Region</span>
                <span className="text-xl font-bold text-slate-900">South Region (India)</span>
              </div>
            </div>
            
            {/* Animated Bar Chart Simulation */}
            <div className="h-12 w-32 bg-white/ rounded border border-slate-200 flex items-end px-2 gap-1.5 pb-1 relative overflow-hidden">
              <div className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t h-1/3 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              <div className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t h-2/3 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t h-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
