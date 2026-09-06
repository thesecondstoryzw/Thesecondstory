import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, MessageCircle } from 'lucide-react';

const navItems = [
  { label: 'Enter', href: '#hero' },
  { label: 'Story', href: '#story' },
  { label: 'Coffee', href: '#coffee' },
  { label: 'Roastery', href: '#roastery' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Visit', href: '#visit' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.7, 0, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-[#0d0805]/80 backdrop-blur-md border-b border-[#c9a04e]/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
          <button
            onClick={() => handleNav('#hero')}
            className="flex items-center gap-2.5 group"
          >
            <Coffee className="w-5 h-5 text-[#c9a04e] transition-transform duration-500 group-hover:rotate-12" />
            <span className="font-serif-display text-lg text-[#f5ebe0] tracking-wide">
              The Second Story
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="px-4 py-2 font-mono-label text-[10px] text-[#f5ebe0]/60 hover:text-[#c9a04e] transition-colors duration-300"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/0000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-[#c9a04e]/30 rounded-full text-[#c9a04e] hover:bg-[#c9a04e]/10 transition-all duration-300 group"
            >
              <MessageCircle className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-mono-label text-[10px]">WhatsApp</span>
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Menu"
            >
              <span
                className={`block w-6 h-px bg-[#c9a04e] transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-6 h-px bg-[#c9a04e] transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-px bg-[#c9a04e] transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0d0805] md:hidden flex flex-col items-center justify-center gap-6"
          >
            {navItems.map((item, i) => (
              <motion.button
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.1 }}
                onClick={() => handleNav(item.href)}
                className="font-serif-display text-3xl text-[#f5ebe0] hover:text-[#c9a04e] transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              href="https://wa.me/0000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-[#c9a04e]/30 rounded-full text-[#c9a04e]"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-mono-label text-xs">WhatsApp</span>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
