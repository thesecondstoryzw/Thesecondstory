import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Coffee, Croissant, Sprout } from 'lucide-react';

export function CinematicHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 0.72], [0, -44]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.9, 0]);
  // Keep the same cinematic image, with the soft dark treatment from the reference
  // so the copy and CTA stay readable without flattening the photograph.
  const darkOpacity = useTransform(scrollYProgress, [0, 1], [0.42, 0.68]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100svh] h-[100svh] w-full overflow-hidden bg-[#090604]"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          scale: reduced ? 1 : imageScale,
          y: reduced ? 0 : imageY,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url("/models/Hero1.png")',
            backgroundPosition: '34% center',
            filter: 'brightness(0.82) contrast(1.08) saturate(0.92)',
          }}
        />
      </motion.div>

      {/* Cinematic grading: readable, but never a flat black overlay */}
      <motion.div
        className="absolute inset-0 bg-[#080604]"
        style={{ opacity: darkOpacity }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,6,4,0.68) 0%, rgba(8,6,4,0.28) 34%, rgba(8,6,4,0.12) 60%, rgba(8,6,4,0.52) 100%), linear-gradient(180deg, rgba(8,6,4,0.24) 0%, transparent 34%, rgba(8,6,4,0.14) 66%, rgba(8,6,4,0.84) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 72% 30%, rgba(203,139,73,0.13), transparent 44%), radial-gradient(ellipse at 8% 52%, rgba(31,15,8,0.22), transparent 42%)',
        }}
      />

      <motion.div
        className="relative z-10 flex h-full items-center px-6 pt-20 md:px-14 lg:px-20"
        style={{
          y: reduced ? 0 : contentY,
          opacity: contentOpacity,
        }}
      >
        <div className="w-full max-w-[780px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono-label mb-5 text-[8px] text-[#d6a96a]/85 md:text-[10px]"
          >
            EVERY CUP HAS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 42, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-display max-w-full text-[clamp(4rem,10vw,9.5rem)] leading-[0.82] tracking-[-0.055em] text-[#f7efe5]"
          >
            <span className="block whitespace-nowrap">A Second</span>
            <span className="mt-[0.08em] block pl-[0.18em] italic text-[#d4aa63]">Story</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="my-7 h-px w-16 origin-left bg-[#d4aa63]/55"
          />

          <motion.a
            href="#experience"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.42, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduced ? undefined : { y: -2, scale: 1.02 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            className="mt-2 inline-flex w-fit items-center gap-3 rounded-full bg-[#f0cd8c] px-7 py-4 font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2a180d] shadow-[0_12px_36px_rgba(0,0,0,0.28)] transition-colors hover:bg-[#f6d99f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cd8c]/80"
          >
            Explore our menu
            <span aria-hidden="true" className="text-base leading-none">→</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Quiet value strip inspired by the reference, kept separate from the hero copy */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 w-full border-t border-[#d4aa63]/20 bg-[#080604]/72 backdrop-blur-[3px]"
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex w-full items-stretch justify-between px-6 py-5 md:px-12 lg:px-20">
          {[
            { icon: Coffee, top: 'PREMIUM', bottom: 'COFFEE' },
            { icon: Croissant, top: 'FRESH', bottom: 'BAKED TREATS' },
            { icon: Sprout, top: 'COZY &', bottom: 'RELAXING SPACE' },
          ].map(({ icon: Icon, top, bottom }, index) => (
            <div
              key={bottom}
              className="flex min-w-0 flex-1 items-center justify-center gap-4 px-4 sm:px-8 lg:px-12"
            >
              {index > 0 && (
                <span className="mr-3 hidden h-9 w-px shrink-0 bg-[#d4aa63]/40 sm:block" />
              )}
              <Icon
                aria-hidden="true"
                size={28}
                strokeWidth={1.5}
                className="shrink-0 text-[#e7bd72]"
              />
              <span className="min-w-0 font-mono-label text-[8px] leading-[1.5] tracking-[0.14em] text-[#f7efe5]/82 sm:text-[9px] lg:text-[10px]">
                <span className="block whitespace-nowrap">{top}</span>
                <span className="block whitespace-nowrap">{bottom}</span>
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
