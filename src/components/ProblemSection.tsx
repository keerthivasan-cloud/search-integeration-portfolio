import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, Layers, Database } from 'lucide-react';

const problems = [
  {
    Icon: Search,
    title: 'Keyword Search is Blind',
    body: "Searching 'diameter tolerance' finds the word, not the concept. Miss a synonym, miss the document. Engineers resort to manual folder hunting.",
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100',
  },
  {
    Icon: Layers,
    title: 'Formats are Fragmented',
    body: 'PDF tables, Excel rows, DWG annotations, STEP metadata — all siloed in different tools, none of them searchable together.',
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100',
  },
  {
    Icon: Database,
    title: 'No Intelligence, Just Storage',
    body: "Your DMS stores files but understands nothing. There's no way to ask 'show parts with diameter > 50mm from client ABC' and get a correct answer.",
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100',
  },
];

export const ProblemSection: React.FC = () => {
  const arcRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative bg-white py-28 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          className="text-xs font-bold tracking-widest uppercase text-primary mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The Problem
        </motion.p>

        <motion.h2
          className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 text-center mb-5 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Enterprise knowledge is buried and unreachable.
        </motion.h2>

        <motion.p
          className="text-base text-slate-500 text-center max-w-2xl mx-auto mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Thousands of technical documents accumulate — maintenance logs, CAD drawings, supplier specs, audit trails. Conventional keyword search fails on complex queries. Engineers waste hours hunting files that should take seconds to find.
        </motion.p>

        {/* Cards + connecting SVG arc behind them */}
        <div className="relative">
          {/* Connecting arc SVG — draws on scroll enter */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            preserveAspectRatio="none"
            viewBox="0 0 900 200"
          >
            <path
              ref={arcRef}
              d="M 150 100 Q 450 40 750 100"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeDasharray="600"
              strokeDashoffset={inView ? 0 : 600}
              style={{ transition: 'stroke-dashoffset 1.5s ease 0.3s' }}
            />
          </svg>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map(({ Icon, title, body, iconColor, iconBg }, i) => (
              <motion.div
                key={i}
                className="glass-card rounded-2xl p-8 border-l-4 border-slate-200 hover:border-primary/40 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
              >
                {/* Icon with breathing pulse animation */}
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5 relative`}>
                  <Icon
                    className={`w-6 h-6 ${iconColor}`}
                    style={{
                      animation: `breathe ${3 + i * 1}s ease-in-out infinite`,
                      animationDelay: `${i}s`,
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
