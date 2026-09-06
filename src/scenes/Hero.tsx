import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { heroImages } from '@/data/images';

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothMx = useSpring(mx, { stiffness: 35, damping: 18 });
  const smoothMy = useSpring(my, { stiffness: 35, damping: 18 });

  mx.set(reduced ? 0 : mouse.normalizedX);
  my.set(reduced ? 0 : mouse.normalizedY);

  const bgX = useTransform(smoothMx, [-1, 1], [-18, 18]);
  const bgY = useTransform(smoothMy, [-1, 1], [-10, 10]);
  const textX = useTransform(smoothMx, [-1, 1], [-8, 8]);
  const textParallaxY = useTransform(smoothMy, [-1, 1], [-6, 6]);

  const bgScale = useTransform(scrollYProgress, [0, 0.7, 1], [1.04, 1.11, 1.18]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.9, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.65], [0, -110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6, 0.88], [1, 1, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.72, 1]);

  return (
    <section id="hero" ref={ref} className="relative h-[170vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0d0805]">
        {/* HERO = THE COFFEE SHOP. The 3D bean deliberately does NOT live here. */}
        <motion.div
          className="absolute -inset-8 z-0"
          style={{
            x: reduced ? 0 : bgX,
            y: reduced ? 0 : bgY,
            scale: bgScale,
            opacity: bgOpacity,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[0].url})`,
              filter: 'brightness(0.58) contrast(1.12) saturate(0.88)',
            }}
          />
        </motion.div>

        {/* Cinematic depth layers */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background:
              'radial-gradient(ellipse at 50% 43%, rgba(18,10,5,0.03) 0%, rgba(13,8,5,0.18) 42%, rgba(13,8,5,0.9) 100%)',
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0d0805]/72 via-transparent to-[#0d0805]/88 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[18%] z-20 bg-gradient-to-b from-[#0d0805]/82 to-transparent pointer-events-none" />

        {/* Main title */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pointer-events-none"
          style={{
            x: reduced ? 0 : textX,
            y: reduced ? textY : useTransform(textY, (value) => value + textParallaxY.get()),
            opacity: textOpacity,
          }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.7em', y: 12 }}
            animate={{ opacity: 1, letterSpacing: '0.32em', y: 0 }}
            transition={{ duration: 1.5, delay: 0.25, ease: [0.7, 0, 0.3, 1] }}
            className="font-mono-label text-[9px] md:text-xs text-[#c9a04e] mb-6 md:mb-8 text-center"
          >
            EST. COFFEE · CRAFTED DAILY
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 54, filter: 'blur(18px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 0.35, ease: [0.7, 0, 0.3, 1] }}
            className="font-serif-display text-6xl md:text-8xl lg:text-9xl text-[#f5ebe0] text-center leading-[0.9] max-w-6xl"
          >
            The Second
            <br />
            <span className="italic text-[#c9a04e]">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.2, ease: [0.7, 0, 0.3, 1] }}
            className="font-body text-sm md:text-lg text-[#f5ebe0]/70 mt-8 max-w-xl text-center leading-relaxed"
          >
            Step inside a world where every cup tells a story,
            <br className="hidden md:block" />
            and every story begins with coffee.
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          style={{ opacity: textOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="font-mono-label text-[8px] tracking-[0.35em] text-[#f5ebe0]/45">
            SCROLL TO ENTER
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4 text-[#c9a04e]" />
          </motion.div>
        </motion.div>

        <div className="absolute top-0 left-0 right-0 h-[3vh] bg-[#0d0805] z-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[3vh] bg-[#0d0805] z-40 pointer-events-none" />
      </div>
    </section>
  );
}
