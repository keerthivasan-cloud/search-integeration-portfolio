import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { prefix: '< ', value: 50, suffix: 'ms', label: 'Average hybrid search latency' },
  { prefix: '', value: 10, suffix: '+', label: 'Document formats supported natively' },
  { prefix: '', value: 1536, suffix: 'D', label: 'Embedding vector dimensions per chunk' },
  { prefix: '', value: 99.9, suffix: '%', label: 'Format extraction accuracy on clean PDFs' },
  { prefix: '', value: 100, suffix: '%', label: 'On-premise inference — zero data egress' },
  { prefix: '', value: 9, suffix: '', label: 'Pipeline stages, fully automated' },
];

export const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          STATS.forEach((stat, i) => {
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 1.5,
              ease: 'power2.out',
              delay: i * 0.1,
              onUpdate: () => {
                const progress = counter.val / stat.value;
                setCounts((prev) => {
                  const next = [...prev];
                  next[i] = stat.value % 1 === 0 ? Math.round(counter.val) : parseFloat(counter.val.toFixed(1));
                  return next;
                });
                // Glow intensity tracks counter progress
                if (glowRefs.current[i]) {
                  glowRefs.current[i]!.style.opacity = String(progress * 0.18);
                }
              },
              onComplete: () => {
                // Ring-expand celebration on completion
                const ring = ringRefs.current[i];
                if (ring) {
                  gsap.fromTo(
                    ring,
                    { scale: 1, opacity: 0.8 },
                    { scale: 1.2, opacity: 0, duration: 0.6, ease: 'power2.out' }
                  );
                }
              },
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="relative bg-slate-50 py-28 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.p
          className="text-xs font-bold tracking-widest uppercase text-primary mb-4 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          By the Numbers
        </motion.p>

        <motion.h2
          className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Measurable impact from day one.
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="relative glass-card rounded-2xl p-8 text-center border border-slate-100 hover:shadow-xl transition-shadow overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              {/* Radial glow — intensity tracks counter progress */}
              <div
                ref={(el) => { glowRefs.current[i] = el; }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 30%, rgba(74,222,128,1) 0%, transparent 70%)', opacity: 0 }}
              />
              {/* Ring expand element */}
              <div
                ref={(el) => { ringRefs.current[i] = el; }}
                className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                style={{ opacity: 0 }}
              />
              <div className="relative">
                <div className="font-mono text-4xl md:text-5xl font-black gradient-text mb-2">
                  {stat.prefix}{counts[i]}{stat.suffix}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
