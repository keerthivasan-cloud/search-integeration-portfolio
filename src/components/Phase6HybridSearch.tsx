import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Database, Fingerprint } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Phase6HybridSearch: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const keywordNodeRef = useRef<HTMLDivElement>(null);
  const vectorNodeRef = useRef<HTMLDivElement>(null);
  
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const tracer1Ref = useRef<SVGPathElement>(null);
  const tracer2Ref = useRef<SVGPathElement>(null);

  const [typedText, setTypedText] = useState("");
  const fullQuery = "find invoice from abc client";

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      });

      // Initialize SVGs
      [path1Ref, path2Ref].forEach(ref => {
        if (ref.current) {
          const len = ref.current.getTotalLength();
          gsap.set(ref.current, { strokeDasharray: len, strokeDashoffset: len });
        }
      });

      [tracer1Ref, tracer2Ref].forEach(ref => {
        if (ref.current) {
          const len = ref.current.getTotalLength();
          // Tracer is a short segment
          gsap.set(ref.current, { strokeDasharray: `${len * 0.1} ${len * 0.9}`, strokeDashoffset: len });
        }
      });

      // 1. Search bar appears with 3D rotation
      tl.fromTo(searchBarRef.current,
        { opacity: 0, z: -500, rotationX: 45 },
        { opacity: 1, z: 0, rotationX: 0, duration: 0.5, ease: "power2.out" }
      );

      // 2. Typing effect
      tl.to({}, {
        duration: 0.8,
        onUpdate: function() {
          const p = this.progress();
          setTypedText(fullQuery.substring(0, Math.floor(p * fullQuery.length)));
        }
      });

      // Search bar pulses
      tl.to(searchBarRef.current, {
        boxShadow: "0 0 50px rgba(139, 92, 246, 0.8)",
        borderColor: "rgba(139, 92, 246, 1)",
        scale: 1.05,
        duration: 0.2,
      });

      // 3. Draw the main tracks
      const len1 = path1Ref.current?.getTotalLength() || 1000;
      const len2 = path2Ref.current?.getTotalLength() || 1000;

      tl.to([path1Ref.current, path2Ref.current], {
        strokeDashoffset: 0,
        duration: 0.5,
        ease: "power1.inOut"
      }, "paths");

      // 4. Send the glowing tracers down the tracks
      tl.to(tracer1Ref.current, {
        strokeDashoffset: -len1 * 0.1, // Move completely past
        duration: 0.8,
        ease: "power2.inOut"
      }, "paths+=0.2");

      tl.to(tracer2Ref.current, {
        strokeDashoffset: -len2 * 0.1,
        duration: 0.8,
        ease: "power2.inOut"
      }, "paths+=0.2");

      // 5. Reveal end nodes with a pop
      tl.fromTo([keywordNodeRef.current, vectorNodeRef.current],
        { opacity: 0, scale: 0.5, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
        "paths+=0.8"
      );

      // 6. After nodes appear: start looping mini-tracers on each path
      tl.call(() => {
        [tracer1Ref, tracer2Ref].forEach((tracerRef, pathIdx) => {
          const pathRef = pathIdx === 0 ? path1Ref : path2Ref;
          const len = pathRef.current?.getTotalLength() || 500;
          const color = pathIdx === 0 ? '#60a5fa' : '#34d399';
          // Create 3 additional looping tracers per path by cycling dash offset
          for (let k = 0; k < 3; k++) {
            const segLen = len * 0.08;
            const gap = len - segLen;
            // Offset stagger so they're evenly spaced
            const loopTracer = tracerRef.current?.cloneNode(true) as SVGPathElement | null;
            if (!loopTracer || !tracerRef.current?.parentNode) return;
            loopTracer.style.stroke = color;
            loopTracer.style.strokeWidth = '5';
            loopTracer.style.strokeDasharray = `${segLen} ${gap}`;
            loopTracer.style.strokeDashoffset = `${len - k * (len / 3)}`;
            tracerRef.current.parentNode.appendChild(loopTracer);
            gsap.to(loopTracer, {
              strokeDashoffset: `-=${len}`,
              duration: 1.8,
              ease: 'none',
              repeat: -1,
            });
          }
        });
      }, [], "paths+=1.3");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-slate-50 overflow-hidden flex flex-col items-center pt-24" style={{ perspective: '1000px' }}>
      
      {/* Search Input Simulation */}
      <div 
        ref={searchBarRef}
        className="z-20 w-11/12 max-w-2xl h-16 rounded-2xl glass-card flex items-center px-6 border border-slate-200 relative mt-10 bg-white/ backdrop-blur-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Search className="w-6 h-6 text-purple-400 mr-4" />
        <span className="text-xl md:text-2xl font-mono text-slate-800">
          {typedText}<span className="animate-pulse">|</span>
        </span>
      </div>

      {/* SVG Routing Canvas */}
      <div className="absolute top-48 left-1/2 -translate-x-1/2 w-[800px] h-[500px] z-10 pointer-events-none">
        <svg width="800" height="500" viewBox="0 0 800 500" className="overflow-visible">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Tracks */}
          <path d="M 400 0 C 400 150, 200 150, 200 350" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <path d="M 400 0 C 400 150, 600 150, 600 350" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />

          {/* Animated Paths */}
          <path ref={path1Ref} d="M 400 0 C 400 150, 200 150, 200 350" fill="none" stroke="url(#grad1)" strokeWidth="4" />
          <path ref={path2Ref} d="M 400 0 C 400 150, 600 150, 600 350" fill="none" stroke="url(#grad2)" strokeWidth="4" />

          {/* Glowing Tracers (Energy Packets) */}
          <path ref={tracer1Ref} d="M 400 0 C 400 150, 200 150, 200 350" fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
          <path ref={tracer2Ref} d="M 400 0 C 400 150, 600 150, 600 350" fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round" filter="url(#glow)" />
        </svg>

        {/* End Nodes (HTML overlays) */}
        <div 
          ref={keywordNodeRef}
          className="absolute left-[200px] top-[350px] -translate-x-1/2 flex flex-col items-center opacity-0"
        >
          <div className="w-20 h-20 rounded-2xl glass border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
            <Database className="w-8 h-8 text-blue-400 relative z-10" />
          </div>
          <span className="font-bold text-blue-400 tracking-widest uppercase">Keyword Search</span>
        </div>

        <div 
          ref={vectorNodeRef}
          className="absolute left-[600px] top-[350px] -translate-x-1/2 flex flex-col items-center opacity-0"
        >
          <div className="w-20 h-20 rounded-2xl glass border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
            <Fingerprint className="w-8 h-8 text-emerald-400 relative z-10" />
          </div>
          <span className="font-bold text-emerald-400 tracking-widest uppercase">Vector Search</span>
        </div>
      </div>

    </section>
  );
};
