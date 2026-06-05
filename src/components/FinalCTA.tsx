import { motion } from 'framer-motion';

export const FinalCTA: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative bg-cta-dark text-white py-32 px-6 overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(74,222,128,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      {/* Breathing emerald orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.22) 0%, rgba(74,222,128,0.08) 40%, transparent 70%)' }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      />
      {/* Cyan accent orb */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,242,255,0.07) 0%, transparent 65%)' }}
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          className="text-xs font-bold tracking-widest uppercase text-primary mb-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get Started
        </motion.p>

        <motion.h2
          className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight"
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Ready to unlock your industrial knowledge?
        </motion.h2>

        <motion.p
          className="text-slate-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Vitech runs entirely on your infrastructure — no cloud dependency, no data egress. Your documents stay yours.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.a
            href="mailto:contact@vitech.ai"
            className="relative px-8 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 rounded-full font-bold text-lg shadow-[0_0_0_1px_rgba(74,222,128,0.5),0_4px_24px_rgba(74,222,128,0.45),0_16px_60px_rgba(74,222,128,0.25)] transition-shadow overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: '0 0 0 2px rgba(74,222,128,0.7), 0 8px_36px rgba(74,222,128,0.60), 0 24px 80px rgba(74,222,128,0.30)' }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Shimmer overlay */}
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2.5s linear infinite',
              }}
            />
            <span className="relative z-10">Request a Demo</span>
          </motion.a>
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-white/15 bg-white/5 text-white rounded-full font-bold text-lg hover:border-white/40 hover:bg-white/10 transition-all backdrop-blur-sm"
            whileHover={{ scale: 1.05, boxShadow: '0 4px 24px rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.97 }}
          >
            Explore the Codebase
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
