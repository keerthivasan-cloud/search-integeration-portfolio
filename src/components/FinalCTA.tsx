import { motion } from 'framer-motion';

export const FinalCTA: React.FC = () => {
  return (
    <section
      id="contact"
      className="relative bg-dark text-white py-32 px-6 overflow-hidden"
    >
      {/* Breathing emerald orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
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
            className="relative px-8 py-4 bg-primary text-slate-900 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(74,222,128,0.4)] transition-shadow overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(74,222,128,0.6)' }}
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
            className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:border-white/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore the Codebase
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
