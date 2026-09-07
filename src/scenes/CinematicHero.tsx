import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
  const darkOpacity = useTransform(scrollYProgress, [0, 1], [0.28, 0.72]);

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
            'linear-gradient(90deg, rgba(8,6,4,0.56) 0%, rgba(8,6,4,0.18) 38%, rgba(8,6,4,0.10) 64%, rgba(8,6,4,0.38) 100%), linear-gradient(180deg, rgba(8,6,4,0.22) 0%, transparent 34%, rgba(8,6,4,0.12) 66%, rgba(8,6,4,0.82) 100%)',
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
            EVERY CUP HAS A
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

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.18, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[540px] font-body text-[clamp(1rem,1.6vw,1.35rem)] leading-relaxed text-[#f7efe5]/72"
          >
            From a single bean to a moment shared. From a moment to a memory.
            From a memory to a story worth telling.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: contentOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="font-mono-label text-[7px] text-[#f7efe5]/40">SCROLL TO BEGIN</span>
        <motion.div
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-gradient-to-b from-[#d4aa63]/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
