import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileSpreadsheet, Rss, FileText, FileSearch } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Perfect Flat Line-Art Gear (Fixed SVG Rendering)
export const FlatGear: React.FC<{ size: number; teeth: number; centerColor?: string; }> = ({ size, teeth, centerColor }) => {
  return (
    <div style={{ width: size, height: size }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
        {/* Teeth */}
        {Array.from({ length: teeth }).map((_, i) => (
          <path
            key={`tooth-${i}`}
            d="M 94 4 L 106 4 L 110 20 L 90 20 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeLinejoin="round"
            transform={`rotate(${(i * 360) / teeth} 100 100)`}
          />
        ))}
        
        {/* Spokes (drawn behind the solid rings) */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect 
            key={`spoke-${i}`} 
            x="96" y="20" width="8" height="160" 
            fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" 
            transform={`rotate(${(i * 360) / 6} 100 100)`} 
          />
        ))}

        {/* Outer Ring Donut using thick stroke (flawless rendering across all browsers) */}
        <circle cx="100" cy="100" r="68.5" fill="none" stroke="#ffffff" strokeWidth="27" />
        <circle cx="100" cy="100" r="82" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="55" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />

        {/* Center Hub */}
        <circle cx="100" cy="100" r="26" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2.5" />
        {centerColor ? (
          <circle cx="100" cy="100" r="16" fill={centerColor} />
        ) : (
          <circle cx="100" cy="100" r="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2.5" />
        )}
      </svg>
    </div>
  );
};

export const Phase1Discovery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Gears
  const gearAssemblyRef = useRef<HTMLDivElement>(null);
  const g1Ref = useRef<HTMLDivElement>(null);
  const g2Ref = useRef<HTMLDivElement>(null);
  const g3Ref = useRef<HTMLDivElement>(null);
  const g4Ref = useRef<HTMLDivElement>(null);
  const g5Ref = useRef<HTMLDivElement>(null);
  
  // Files
  const filesRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Blast
  const blastCharsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Charging orb — green energy pulse just before the blast
  const chargingRef = useRef<HTMLDivElement>(null);

  // Exact files from the GIF
  const floatingFiles = [
    { name: 'sales.csv', icon: FileSpreadsheet, color: 'text-emerald-500', x: -350, y: -50 },
    { name: 'rss.xml', icon: Rss, color: 'text-amber-500', x: 280, y: -150 },
    { name: 'invoice.pdf', icon: FileText, color: 'text-rose-500', x: -250, y: 220 },
    { name: 'report.doc', icon: FileSearch, color: 'text-blue-500', x: 280, y: 180 },
  ];

  // Expanded blast char pool — binary, hex, measurement data, code symbols
  const BLAST_POOL = [
    // Heavy binary weight
    '0','1','0','1','0','1','0','1',
    // Hex digits
    'A','B','C','D','E','F',
    // Other digits
    '2','3','4','5','6','7','8','9',
    // Measurement values
    '60','0.02','1536','4500','0.8','±','μ','°','≤','≥',
    // Measurement units
    'mm','μm','rpm','°C','kN','kg',
    // Data / file terms
    'pdf','csv','v3','doc','json','xml',
    // Code / data symbols
    '{','}','<','>','[',']','(',')',
    '#','@','!','$','%','+','-','=',
    '|',';',':','.',',','_','/',
    // Identifiers
    'x','null','0xFF','0x4F','0xA3','NaN',
  ];

  const blastChars = Array.from({ length: 280 }).map((_, i) => {
    const r = Math.random();
    const colorRoll = Math.random();
    return {
      id: i,
      char: BLAST_POOL[Math.floor(Math.random() * BLAST_POOL.length)],
      color: colorRoll > 0.65 ? 'text-slate-400'
           : colorRoll > 0.40 ? 'text-emerald-500'
           : colorRoll > 0.22 ? 'text-blue-400'
           : 'text-amber-400',
      angle: Math.random() * Math.PI * 2,
      distance: 250 + Math.random() * 1100,
      z: Math.random() * 1000 - 500,
      speed: 0.5 + Math.random() * 1.6,
      size: r > 0.82 ? 'text-2xl' : r > 0.55 ? 'text-base' : 'text-xs',
    };
  });

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

      // Initial States
      gsap.set(blastCharsRef.current, { scale: 0, opacity: 0, x: 0, y: 0, z: 0 });
      gsap.set(chargingRef.current, { scale: 0, opacity: 0 });

      // Infinite slow spin of gears on idle
      gsap.to(g1Ref.current, { rotation: 360, duration: 20, ease: 'none', repeat: -1 });
      gsap.to(g2Ref.current, { rotation: -360 * (24/18), duration: 20, ease: 'none', repeat: -1 }); 
      gsap.to(g3Ref.current, { rotation: -360 * (24/16), duration: 20, ease: 'none', repeat: -1 }); 
      gsap.to(g4Ref.current, { rotation: -360 * (24/10), duration: 20, ease: 'none', repeat: -1 }); 
      gsap.to(g5Ref.current, { rotation: -360 * (24/12), duration: 20, ease: 'none', repeat: -1 }); 

      // 1. Scroll triggers the fast spin and file suck
      tl.to(g1Ref.current, { rotation: "+=1080", duration: 1.5, ease: 'power2.inOut' }, 0);
      tl.to(g2Ref.current, { rotation: "-=1440", duration: 1.5, ease: 'power2.inOut' }, 0); 
      tl.to(g3Ref.current, { rotation: "-=1620", duration: 1.5, ease: 'power2.inOut' }, 0); 
      tl.to(g4Ref.current, { rotation: "-=2592", duration: 1.5, ease: 'power2.inOut' }, 0);
      tl.to(g5Ref.current, { rotation: "-=2160", duration: 1.5, ease: 'power2.inOut' }, 0);

      filesRef.current.forEach((file) => {
        tl.to(file, { x: 0, y: 0, z: 0, scale: 0, opacity: 0, rotation: Math.random() * 180 - 90, duration: 1.2, ease: 'power3.in' }, 0);
      });

      // 1.5. Charging orb — energy concentrates at center before blast
      tl.to(chargingRef.current, { scale: 1, opacity: 1, duration: 0.08, ease: 'power3.out' }, 0.95);
      tl.to(chargingRef.current, { scale: 4, opacity: 0, duration: 0.15, ease: 'power2.in' }, 1.03);

      // 2. The massive binary blast exactly when files hit center
      blastCharsRef.current.forEach((char, i) => {
        if (!char) return;
        const config = blastChars[i];
        tl.to(char, {
          opacity: 1,
          scale: 1,
          x: Math.cos(config.angle) * config.distance,
          y: Math.sin(config.angle) * config.distance,
          z: config.z,
          rotationX: Math.random() * 720,
          rotationY: Math.random() * 720,
          textShadow: Math.random() > 0.5 ? '0 0 10px #4ade80' : '0 0 6px #00f2ff',
          duration: 1.5 * config.speed,
          ease: 'expo.out'
        }, 1.1); // slightly overlapping the suck for impact
      });

      // Exit Scene
      tl.to(gearAssemblyRef.current, { z: "+=800", opacity: 0, duration: 1, ease: 'power2.in' }, 3.5);
      blastCharsRef.current.forEach((char) => {
        if (!char) return;
        tl.to(char, { z: "+=800", opacity: 0, duration: 1, ease: 'power2.in' }, 3.5);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full bg-slate-50 overflow-hidden flex items-center justify-center pt-24"
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Title (Matching the GIF precisely) */}
      <div className="absolute top-24 z-10 w-full px-4 pointer-events-none text-center" style={{ transform: 'translateZ(100px)' }}>
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
          Phase 1: <span className="text-emerald-500">File Discovery</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-medium">
          Vitech immediately connects to all your enterprise data sources to extract raw logic.
        </p>
      </div>

      <div ref={gearAssemblyRef} className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[0.8] lg:scale-100 mt-10">
        
        <div className="relative w-[500px] h-[500px]">
          {/* Main Center Gear */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div ref={g1Ref} className="relative w-0 h-0 flex items-center justify-center">
              <FlatGear size={240} teeth={24} centerColor="#34d399" />
            </div>
          </div>
          
          {/* Top-Left Gear */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-160px, -125px)' }}>
            <div ref={g2Ref} className="relative w-0 h-0 flex items-center justify-center">
              <FlatGear size={180} teeth={18} />
            </div>
          </div>

          {/* Top-Right Gear */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(145px, -135px)' }}>
            <div ref={g3Ref} className="relative w-0 h-0 flex items-center justify-center">
              <FlatGear size={160} teeth={16} />
            </div>
          </div>

          {/* Bottom-Right Gear (Tiny) */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(160px, 90px)' }}>
            <div ref={g4Ref} className="relative w-0 h-0 flex items-center justify-center z-10">
              <FlatGear size={100} teeth={10} />
            </div>
          </div>

          {/* Bottom Gear */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-30px, 160px)' }}>
            <div ref={g5Ref} className="relative w-0 h-0 flex items-center justify-center z-30">
              <FlatGear size={120} teeth={12} />
            </div>
          </div>
          
          {/* The 4 Floating Files exactly from GIF */}
          <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
            {floatingFiles.map((file, i) => (
              <div 
                key={`file-${i}`}
                ref={(el) => { filesRef.current[i] = el; }}
                className="absolute flex items-center justify-center"
                style={{ transform: `translate(${file.x}px, ${file.y}px)` }}
              >
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 min-w-[120px]">
                  <file.icon className={`w-8 h-8 mb-2 ${file.color}`} />
                  <span className="text-xs font-bold text-slate-700">{file.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charging orb — energy pulse before blast */}
      <div
        ref={chargingRef}
        className="absolute z-20 w-20 h-20 rounded-full pointer-events-none"
        style={{
          top: 'calc(50% - 40px)',
          left: 'calc(50% - 40px)',
          background: 'radial-gradient(circle, rgba(74,222,128,0.95) 0%, rgba(74,222,128,0.4) 40%, transparent 70%)',
          boxShadow: '0 0 40px 20px rgba(74,222,128,0.5)',
          transformOrigin: 'center',
        }}
      />

      {/* The Binary Blast */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        {blastChars.map((char, i) => (
          <div
            key={`char-${i}`}
            ref={(el) => { blastCharsRef.current[i] = el; }}
            className={`absolute font-mono font-bold ${char.color} ${char.size}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {char.char}
          </div>
        ))}
      </div>
    </section>
  );
};
