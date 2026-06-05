import { motion } from 'framer-motion';
import { GitMerge, FolderOpen, Ruler, Brain, MessageSquare, Shield } from 'lucide-react';

const features = [
  {
    Icon: GitMerge,
    title: 'Hybrid Search',
    body: 'Combines BM25 keyword precision with 1536-dimensional vector semantic matching. Neither alone is enough — together, they surface the right document even when you cannot remember the exact words.',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    Icon: FolderOpen,
    title: 'Universal Format Support',
    body: 'PDF, DOCX, XLSX, CSV, TXT, DWG, DXF, STEP, plus images with OCR via Tesseract. Every file type your team produces, indexed and queryable through one interface.',
    iconColor: 'text-secondary',
    iconBg: 'bg-secondary/10',
    border: 'border-secondary/20',
  },
  {
    Icon: Ruler,
    title: 'Dimension Intelligence',
    body: 'Automatically extracts physical measurements — length, width, height, diameter — with full unit conversion. Ask "60mm shaft" and find it even if the drawing says "2.36 inches".',
    iconColor: 'text-accent',
    iconBg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    Icon: Brain,
    title: 'AI Query Understanding',
    body: 'Powered by Ollama LLMs running locally. Vitech parses intent, corrects spelling, and rewrites ambiguous queries — all without sending data to the cloud.',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    Icon: MessageSquare,
    title: 'RAG-Powered Answers',
    body: "Don't just get file names — get answers. Vitech reads the relevant document sections and synthesises a precise response, citing every source passage it used.",
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    Icon: Shield,
    title: 'Enterprise-Grade',
    body: 'JWT authentication, role-based access control, admin panel, bulk indexing via BullMQ, audit trail, and folder/project/client hierarchy. Built for real organisations, not demos.',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

export const SolutionFeatures: React.FC = () => {
  return (
    <section id="features" className="relative bg-slate-50 py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.p
          className="text-xs font-bold tracking-widest uppercase text-primary mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The Solution
        </motion.p>

        <motion.h2
          className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          One search bar that actually understands your work.
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {features.map(({ Icon, title, body, iconColor, iconBg, border }, i) => (
            <motion.div
              key={i}
              className={`glass-card rounded-2xl p-7 border ${border} hover:shadow-xl transition-shadow`}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -6 }}
            >
              <motion.div
                className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-5`}
                whileHover={{ rotate: 5, scale: 1.1 }}
              >
                <Icon
                  className={`w-5 h-5 ${iconColor}`}
                  style={{
                    animation: `floatIcon ${2.5 + i * 0.4}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
              </motion.div>
              <h3 className="text-base font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
