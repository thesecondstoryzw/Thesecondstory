import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CoffeeBean } from '@/components/CoffeeBean';
import { heroImages } from '@/data/images';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollTextY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const scrollBlur = useTransform(scrollYProgress, [0, 0.5], [0, 8]);
  const filterBlur = useTransform(scrollBlur, (v) => `blur(${v}px)`);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const smoothMx = useSpring(mx, springConfig);
  const smoothMy = useSpring(my, springConfig);

  if (!reduced) {
    mx.set(mouse.normalizedX);
    my.set(mouse.normalizedY);
  }

  const bgX = useTransform(smoothMx, [-1, 1], [-15, 15]);
  const bgY = useTransform(smoothMy, [-1, 1], [-10, 10]);
  const midX = useTransform(smoothMx, [-1, 1], [-30, 30]);
  const midY = useTransform(smoothMy, [-1, 1], [-20, 20]);
  const fgX = useTransform(smoothMx, [-1, 1], [-60, 60]);
  const fgY = useTransform(smoothMy, [-1, 1], [-40, 40]);
  const textX = useTransform(smoothMx, [-1, 1], [-12, 12]);
  const textY = useTransform(smoothMy, [-1, 1], [-8, 8]);

  return (
    <section id="hero" ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Background layer — cinematic café image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          scale: scrollScale,
          x: reduced ? 0 : bgX,
          y: reduced ? 0 : bgY,
          opacity: scrollOpacity,
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImages[0].url})`,
            filter: 'brightness(0.45) contrast(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0805]/60 via-transparent to-[#0d0805]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805] via-transparent to-transparent" />
      </motion.div>

      {/* Atmospheric mid layer — warm glow */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ x: reduced ? 0 : midX, y: reduced ? 0 : midY, opacity: scrollOpacity }}
      >
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201,160,78,0.15) 0%, transparent 70%)',
            animation: 'pulse-glow 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,195,158,0.08) 0%, transparent 70%)',
            animation: 'pulse-glow 10s ease-in-out infinite 2s',
          }}
        />
      </motion.div>

      {/* Foreground floating beans */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ x: fgX, y: fgY, opacity: scrollOpacity }}
        >
          <div className="absolute top-[20%] left-[12%]" style={{ animation: 'slow-drift 12s ease-in-out infinite' }}>
            <CoffeeBean size={28} rotateSpeed={25} />
          </div>
          <div className="absolute top-[60%] right-[18%]" style={{ animation: 'slow-drift 14s ease-in-out infinite 1s' }}>
            <CoffeeBean size={20} rotateSpeed={30} />
          </div>
          <div className="absolute top-[75%] left-[30%]" style={{ animation: 'slow-drift 16s ease-in-out infinite 3s' }}>
            <CoffeeBean size={16} rotateSpeed={35} />
          </div>
          <div className="absolute top-[30%] right-[35%]" style={{ animation: 'slow-drift 18s ease-in-out infinite 2s' }}>
            <CoffeeBean size={24} rotateSpeed={28} />
          </div>
        </motion.div>
      )}

      {/* Text layer — 3D depth typography */}
      <motion.div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
        style={{
          x: reduced ? 0 : textX,
          y: reduced ? 0 : textY,
          opacity: scrollOpacity,
          filter: filterBlur,
        }}
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.7, 0, 0.3, 1] }}
          className="font-mono-label text-[10px] md:text-xs text-[#c9a04e] mb-6"
        >
          Est. Coffee · Crafted Daily
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 2, delay: 0.4, ease: [0.7, 0, 0.3, 1] }}
          className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-[#f5ebe0] text-center leading-[1.05] max-w-5xl px-6"
        >
          The Second
          <br />
          <span className="italic text-[#c9a04e]">Story</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.7, 0, 0.3, 1] }}
          className="font-body text-sm md:text-base text-[#f5ebe0]/60 mt-8 max-w-md text-center px-6 leading-relaxed"
        >
          Step inside a world where every cup tells a story,
          and every story begins with coffee.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        style={{ opacity: scrollOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="font-mono-label text-[8px] text-[#f5ebe0]/40">Scroll to enter</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[#c9a04e]" />
        </motion.div>
      </motion.div>

      {/* Cinematic letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[5vh] bg-[#0d0805] z-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[5vh] bg-[#0d0805] z-40 pointer-events-none" />
    </section>
  );
}
