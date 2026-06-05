import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const PipelineIntro: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade body background from light to dark as this section enters
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Interpolate from slate-50 (#f8fafc) to dark (#020617)
          const r = Math.round(248 - (248 - 2) * p);
          const g = Math.round(250 - (250 - 6) * p);
          const b = Math.round(252 - (252 - 23) * p);
          document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
        },
      });

      // Dots pop in with stagger on scroll enter
      gsap.fromTo(
        dotsRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          ease: 'back.out(2)',
          duration: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

      // Traveling glow dot — starts on scroll-into-view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          const container = timelineContainerRef.current;
          const traveler = travelerRef.current;
          if (!container || !traveler) return;

          const totalWidth = container.offsetWidth;
          const dotSpacing = totalWidth / 8; // 9 dots, 8 gaps

          const loopTween = gsap.to(traveler, {
            x: totalWidth - 16,
            duration: 2.8,
            ease: 'power1.inOut',
            repeat: -1,
            delay: 0.3,
            onUpdate: function() {
              const xPos = gsap.getProperty(traveler, 'x') as number;
              dotsRef.current.forEach((dot, i) => {
                if (!dot) return;
                const dotX = i * dotSpacing;
                const dist = Math.abs(xPos - dotX);
                if (dist < 20) {
                  gsap.to(dot.firstElementChild, { scale: 1.6, opacity: 1, duration: 0.15, ease: 'back.out(2)', overwrite: 'auto' });
                } else {
                  gsap.to(dot.firstElementChild, { scale: 1, opacity: 0.6, duration: 0.3, overwrite: 'auto' });
                }
              });
            },
          });
          return () => loopTween.kill();
        },
      });

    return () => {
      ctx.revert();
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-dark text-white py-32 px-6 overflow-hidden"
    >
      {/* Subtle grid on dark background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Emerald glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          className="text-xs font-bold tracking-widest uppercase text-primary mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The Intelligence Pipeline
        </motion.p>

        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          From raw file to precise answer —{' '}
          <span className="gradient-text">nine stages</span> of AI processing.
        </motion.h2>

        <motion.p
          className="text-slate-400 text-lg max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Scroll through the complete lifecycle of a document inside Vitech.
        </motion.p>

        {/* 9-dot timeline with traveling glow */}
        <div ref={timelineContainerRef} className="relative flex items-center justify-center gap-0">
          {/* Traveling glow dot */}
          <div
            ref={travelerRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary blur-sm pointer-events-none z-10"
            style={{ opacity: 0.8, boxShadow: '0 0 12px 4px #4ade80' }}
          />
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                ref={(el) => { dotsRef.current[i] = el; }}
                className="flex flex-col items-center gap-1 relative z-20"
              >
                <div className="w-3 h-3 rounded-full bg-primary/40 ring-2 ring-primary/20 transition-transform" />
                <span className="text-[10px] font-mono text-primary/50">{i + 1}</span>
              </div>
              {i < 8 && (
                <div className="w-12 md:w-16 h-px border-t border-dashed border-primary/20 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
