import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function CinematicHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
  const filterBlur = useTransform(heroBlur, (v) => `blur(${v}px)`);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const overlayDarken = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8]);
  const overlayOpacity = useTransform(overlayDarken, (v) => v);

  // Parallax for hero image
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[#080604]"
    >
      {/* Background — coffee shop image with cinematic treatment */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: reduced ? 1 : heroScale,
          opacity: heroOpacity,
          filter: filterBlur,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/models/Hero%20image.png")',
            y: reduced ? 0 : bgY,
            backgroundPosition: '42% center',
            filter: 'brightness(0.68) contrast(1.08) saturate(0.88)',
          }}
        />
        {/* Cinematic dark overlay */}
        <motion.div
          className="absolute inset-0 bg-[#080604]"
          style={{ opacity: overlayOpacity }}
        />
        {/* Warm gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 70% 35%, rgba(183,115,57,0.16) 0%, transparent 45%), radial-gradient(ellipse at 20% 75%, rgba(57,30,16,0.28) 0%, transparent 55%)',
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/25 to-transparent" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{
          opacity: heroOpacity,
          y: reduced ? 0 : textY,
        }}
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 2, delay: 0.6, ease: [0.7, 0, 0.3, 1] }}
          className="font-mono-label text-[9px] md:text-[11px] text-[#d49a61] mb-6"
        >
          Harare · Zimbabwe
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 2.2, delay: 0.3, ease: [0.7, 0, 0.3, 1] }}
          className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-[#f3e6d8] text-center leading-[1.05] px-6"
        >
          The Second
          <br />
          <span className="italic text-[#c9a04e]">Story</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '60px' }}
          transition={{ duration: 1, delay: 1.4, ease: [0.7, 0, 0.3, 1] }}
          className="h-px bg-[#c9a04e]/40 my-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease: [0.7, 0, 0.3, 1] }}
          className="font-mono-label text-[9px] md:text-[11px] text-[#f5ebe0]/50 text-center"
        >
          Crafting Delicious Narratives
        </motion.p>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: heroOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="font-mono-label text-[8px] text-[#f5ebe0]/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-[#c9a04e]/60 to-transparent"
        />
      </motion.div>

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[4vh] bg-[#080604] z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[4vh] bg-[#0d0805] z-20 pointer-events-none" />
    </section>
  );
}
