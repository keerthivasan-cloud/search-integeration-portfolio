import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FlatGear } from './Phase1Discovery';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stats = [
  { value: '< 50ms', label: 'Search latency' },
  { value: '10+', label: 'File formats' },
  { value: '1536D', label: 'Vector space' },
  { value: '100%', label: 'On-premise' },
];

export const HeroSection: React.FC = () => {
  const g1Ref = useRef<HTMLDivElement>(null);
  const g2Ref = useRef<HTMLDivElement>(null);
  const g3Ref = useRef<HTMLDivElement>(null);
  // Orbital wrapper refs — allow orbital translation independent of rotation
  const g2WrapperRef = useRef<HTMLDivElement>(null);
  const g3WrapperRef = useRef<HTMLDivElement>(null);
  const gearContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gear rotation
      gsap.to(g1Ref.current, { rotation: 360, duration: 18, ease: 'none', repeat: -1 });
      gsap.to(g2Ref.current, { rotation: -360 * (24 / 16), duration: 18, ease: 'none', repeat: -1 });
      gsap.to(g3Ref.current, { rotation: -360 * (24 / 10), duration: 18, ease: 'none', repeat: -1 });

      // Orbital drift — g2 drifts slightly in X/Y creating "atomic orbital" feel
      gsap.to(g2WrapperRef.current, {
        x: 18, y: -10, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
      gsap.to(g3WrapperRef.current, {
        x: -12, y: 8, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5,
      });
    });

    // Mouse parallax on gear container
    const section = sectionRef.current;
    const container = gearContainerRef.current;
    if (!section || !container) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) * 0.018;
      targetY = (e.clientY - cy) * 0.018;
    };

    const lerp = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      container.style.transform = `translate(${currentX}px, ${currentY}px)`;
      rafId = requestAnimationFrame(lerp);
    };

    section.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(lerp);

    return () => {
      ctx.revert();
      section.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen w-full bg-hero-gradient flex items-center overflow-hidden pt-16"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Emerald glow orb — top right */}
      <div
        className="absolute -top-20 right-0 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(74,222,128,0.20) 0%, rgba(74,222,128,0.06) 45%, transparent 70%)',
          animation: 'breathe 7s ease-in-out infinite',
        }}
      />
      {/* Cyan accent orb — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,242,255,0.10) 0%, rgba(0,242,255,0.03) 50%, transparent 70%)',
          animation: 'breathe 9s ease-in-out infinite reverse',
        }}
      />
      {/* Lime mid orb — faint center depth */}
      <div
        className="absolute top-1/3 left-1/2 w-[600px] h-[300px] rounded-full pointer-events-none -translate-x-1/2"
        style={{
          background: 'radial-gradient(ellipse, rgba(163,230,53,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full py-20 lg:py-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        {/* Left content */}
        <div className="flex-1 flex flex-col items-start gap-6 max-w-2xl">
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-primary/30 shadow-[0_2px_12px_rgba(74,222,128,0.18)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Enterprise AI Search
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] text-slate-900"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            Your Industrial
            <br />
            Documents,
            <br />
            <span className="gradient-text">Finally Answerable.</span>
          </motion.h1>

          <motion.p
            className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Vitech is an AI search engine that understands technical drawings, CAD files, specs, and reports the way your engineers do — not just by keyword.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <a
              href="#contact"
              className="px-7 py-3.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 rounded-full font-bold text-base shadow-[0_0_0_1px_rgba(74,222,128,0.4),0_4px_20px_rgba(74,222,128,0.40),0_12px_40px_rgba(74,222,128,0.20)] hover:shadow-[0_0_0_1px_rgba(74,222,128,0.6),0_4px_28px_rgba(74,222,128,0.55),0_16px_60px_rgba(74,222,128,0.28)] transition-shadow"
            >
              Request a Demo
            </a>
            <a
              href="#pipeline"
              onClick={(e) => { e.preventDefault(); document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="px-7 py-3.5 border border-slate-200 bg-white/60 text-slate-700 rounded-full font-bold text-base hover:border-primary/40 hover:bg-white/90 hover:shadow-[0_4px_20px_rgba(74,222,128,0.10)] transition-all"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            className="flex flex-wrap gap-x-6 gap-y-2 pt-2"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-mono text-lg font-black gradient-text">{s.value}</span>
                <span className="text-xs text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — gear visual with mouse parallax wrapper */}
        <motion.div
          className="flex-1 flex items-center justify-center relative min-h-[360px] lg:min-h-[520px]"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          {/* Emerald glow behind gears */}
          <div
            className="absolute w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(74,222,128,0.28) 0%, rgba(74,222,128,0.10) 40%, transparent 70%)',
              animation: 'breathe 5s ease-in-out infinite',
            }}
          />
          {/* Cyan halo ring */}
          <div
            className="absolute w-[420px] h-[420px] rounded-full pointer-events-none border border-emerald-200/40"
            style={{ background: 'radial-gradient(circle, transparent 60%, rgba(0,242,255,0.06) 80%, transparent 100%)' }}
          />

          {/* Mouse-parallax container */}
          <div ref={gearContainerRef} className="relative w-[360px] h-[360px] pointer-events-none will-change-transform">
            {/* Main center gear */}
            <div className="absolute top-1/2 left-1/2 z-20">
              <div ref={g1Ref} className="relative w-0 h-0 flex items-center justify-center">
                <FlatGear size={200} teeth={24} centerColor="#34d399" />
              </div>
            </div>
            {/* Top-right gear — orbital wrapper */}
            <div ref={g2WrapperRef} className="absolute will-change-transform" style={{ top: '50%', left: '50%', transform: 'translate(118px, -110px)' }}>
              <div ref={g2Ref} className="relative w-0 h-0 flex items-center justify-center">
                <FlatGear size={140} teeth={16} />
              </div>
            </div>
            {/* Bottom gear — orbital wrapper */}
            <div ref={g3WrapperRef} className="absolute will-change-transform" style={{ top: '50%', left: '50%', transform: 'translate(-20px, 130px)' }}>
              <div ref={g3Ref} className="relative w-0 h-0 flex items-center justify-center">
                <FlatGear size={100} teeth={10} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
