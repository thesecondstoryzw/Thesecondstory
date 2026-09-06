import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { entranceImage } from '@/data/images';

export function Entrance() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.4, 1]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7], [1, 0.3, 0.2, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.55, 0.75], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.15, 0.35, 0.55, 0.75], [50, 0, 0, -50]);
  const doorOpen = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const doorScaleX = useTransform(doorOpen, [0, 1], [1, 0]);
  const frameOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0, 1, 0]);

  return (
    <section ref={ref} className="relative h-[200vh] w-full overflow-hidden">
      {/* Sticky cinematic frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background — café interior approaching */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: reduced ? 1 : imageScale,
            y: reduced ? 0 : imageY,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${entranceImage.url})`,
              filter: 'brightness(0.55)',
            }}
          />
        </motion.div>

        {/* Dark overlay that lifts as we "enter" */}
        <motion.div
          className="absolute inset-0 bg-[#0d0805]"
          style={{ opacity: overlayOpacity }}
        />

        {/* Cinematic door frame effect — panels opening */}
        {!reduced && (
          <div className="absolute inset-0 flex pointer-events-none">
            <motion.div
              className="h-full w-1/2 bg-[#0d0805] origin-left border-r border-[#c9a04e]/20"
              style={{ scaleX: doorScaleX }}
            />
            <motion.div
              className="h-full w-1/2 bg-[#0d0805] origin-right border-l border-[#c9a04e]/20"
              style={{ scaleX: doorScaleX }}
            />
          </div>
        )}

        {/* Warm light spilling through as doors open */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: doorOpen,
            background:
              'radial-gradient(ellipse at center, rgba(201,160,78,0.2) 0%, transparent 60%)',
          }}
        />

        {/* Floating frame border — cinematic viewfinder */}
        <motion.div
          className="absolute inset-8 md:inset-16 border border-[#c9a04e]/20 pointer-events-none"
          style={{ opacity: frameOpacity }}
        >
          <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-[#c9a04e]/40" />
          <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-[#c9a04e]/40" />
          <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-[#c9a04e]/40" />
          <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-[#c9a04e]/40" />
        </motion.div>

        {/* Text overlay — entering */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6"
          style={{ opacity: textOpacity, y: textY }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-mono-label text-[10px] text-[#c9a04e] mb-4"
          >
            Step Inside
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.7, 0, 0.3, 1] }}
            className="font-serif-display text-3xl md:text-5xl lg:text-6xl text-[#f5ebe0] text-center leading-tight max-w-3xl"
          >
            Push through the door.
            <br />
            <span className="italic text-[#c9a04e]">Leave the world behind.</span>
          </motion.h2>
        </motion.div>

        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0805] to-transparent z-10" />
      </div>
    </section>
  );
}
