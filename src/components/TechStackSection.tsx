import { motion } from 'framer-motion';

const stack = [
  {
    category: 'Frontend',
    color: 'border-primary/40 text-primary',
    pills: ['React', 'TypeScript', 'Electron', 'Tailwind CSS', 'Vite'],
  },
  {
    category: 'Backend API',
    color: 'border-blue-400/40 text-blue-400',
    pills: ['Node.js', 'Express', 'BullMQ', 'JWT', 'WebSocket'],
  },
  {
    category: 'AI / ML',
    color: 'border-violet-400/40 text-violet-400',
    pills: ['Python', 'FastAPI', 'LangChain', 'Ollama', 'OpenAI'],
  },
  {
    category: 'Search & Storage',
    color: 'border-accent/40 text-accent',
    pills: ['MongoDB', 'Qdrant Vector DB'],
  },
  {
    category: 'File Processing',
    color: 'border-amber-400/40 text-amber-400',
    pills: ['PDF-parse', 'Mammoth', 'Tesseract OCR', 'xlsx', 'ezdxf CAD'],
  },
  {
    category: 'Infrastructure',
    color: 'border-slate-500/40 text-slate-400',
    pills: ['Docker', 'Docker Compose', 'Nginx', 'PM2'],
  },
];

export const TechStackSection: React.FC = () => {
  return (
    <section
      id="stack"
      className="relative bg-dark text-white py-28 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.p
          className="text-xs font-bold tracking-widest uppercase text-primary mb-4 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Technology
        </motion.p>

        <motion.h2
          className="text-4xl md:text-5xl font-black tracking-tighter text-white text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Built on a stack engineered for production at scale.
        </motion.h2>

        <div className="flex flex-col gap-6">
          {stack.map(({ category, color, pills }, rowIdx) => (
            <motion.div
              key={rowIdx}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: rowIdx * 0.08 }}
            >
              <div className="flex items-center gap-2 min-w-[130px] shrink-0">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                  style={{ animationDelay: `${rowIdx * 0.5}s` }}
                />
                <span className="text-sm font-bold text-slate-500">{category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pills.map((pill, pillIdx) => (
                  <motion.span
                    key={pillIdx}
                    className={`font-mono text-xs px-3 py-1.5 rounded-full border ${color} hover:opacity-100 opacity-80 cursor-default`}
                    style={{
                      animation: `floatPill ${2.5 + pillIdx * 0.3}s ease-in-out infinite alternate`,
                      animationDelay: `${rowIdx * 0.15 + pillIdx * 0.12}s`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.8 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: rowIdx * 0.08 + pillIdx * 0.04 }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                  >
                    {pill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
