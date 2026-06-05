import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Stack', href: '#stack' },
  { label: 'Stats', href: '#stats' },
];

export const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 60], [0, 1]);
  const bgOpacity = useTransform(scrollY, [0, 60], [0.5, 0.85]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 h-16"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(248, 250, 252, ${bgOpacity.get()})` }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-slate-200"
          style={{ opacity: borderOpacity }}
        />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xl font-black tracking-tighter text-slate-900">
            VITECH<span className="gradient-text font-light"> INTELLIGENCE</span>
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleNav('#contact')}
              className="px-5 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 rounded-full font-bold text-sm shadow-[0_0_0_1px_rgba(74,222,128,0.35),0_2px_12px_rgba(74,222,128,0.35)] hover:shadow-[0_0_0_1px_rgba(74,222,128,0.5),0_4px_20px_rgba(74,222,128,0.50)] transition-shadow"
            >
              Request Demo
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-16 left-0 right-0 z-40 overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 md:hidden"
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left text-base font-medium text-slate-700 hover:text-primary transition-colors py-2 border-b border-slate-100 last:border-0"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('#contact')}
            className="mt-2 px-5 py-3 bg-primary text-slate-900 rounded-full font-bold text-sm text-center"
          >
            Request Demo
          </button>
        </div>
      </motion.div>
    </>
  );
};
