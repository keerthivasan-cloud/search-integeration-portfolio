import { motion } from 'framer-motion';
import { ExternalLink, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Tech Stack', href: '#stack' },
  { label: 'Stats', href: '#stats' },
  { label: 'Contact', href: '#contact' },
];

const builtWith = ['React', 'Node.js', 'Python', 'Qdrant', 'Three.js'];

export const Footer: React.FC = () => {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#020617] to-[#010410] border-t border-white/8 px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <div className="text-xl font-black tracking-tighter text-white mb-3">
              VITECH<span className="gradient-text font-light"> INTELLIGENCE</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              AI-powered industrial document search. Your knowledge, finally answerable.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >

            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Navigate</p>
            <ul className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Built with */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Built With</p>
            <ul className="flex flex-col gap-2">
              {builtWith.map((tech) => (
                <li key={tech} className="text-sm text-slate-500 font-mono">{tech}</li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Contact</p>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Interested in deploying Vitech in your organisation? Get in touch.
            </p>
            <div className="flex gap-3">
              <motion.a
                href="mailto:contact@vitech.ai"
                className="p-2.5 rounded-full border border-white/10 text-slate-400 transition-colors"
                aria-label="Email"
                whileHover={{ scale: 1.2, rotate: 8, color: '#fff', boxShadow: '0 0 16px rgba(74,222,128,0.4)' }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/10 text-slate-400 transition-colors"
                aria-label="GitHub"
                whileHover={{ scale: 1.2, rotate: -8, color: '#fff', boxShadow: '0 0 16px rgba(74,222,128,0.4)' }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">2025 Vitech. Built for engineers who demand precision.</p>
          <p className="text-xs text-slate-700">A portfolio project</p>
        </div>
      </div>
    </footer>
  );
};
