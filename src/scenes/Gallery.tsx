import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { galleryImages } from '@/data/images';

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const stripX = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);

  // Different column speeds for parallax
  const col1Y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const col2Y = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const col3Y = useTransform(scrollYProgress, [0, 1], [120, -40]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative w-full overflow-hidden py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #1a0f0a 0%, #2a1810 50%, #1a0f0a 100%)' }}
    >
      {/* Warm bright glow for gallery mood */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(232,195,158,0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <RevealText>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">Chapter Four — The Room</span>
          </div>
        </RevealText>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <RevealText delay={0.1}>
            <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl text-[#f5ebe0] leading-tight">
              Where stories
              <br />
              <span className="italic text-[#c9a04e]">are shared.</span>
            </h2>
          </RevealText>
          <RevealText delay={0.3}>
            <p className="font-body text-sm text-[#f5ebe0]/60 max-w-sm leading-relaxed">
              The café is never just about the coffee. It is about the people who fill
              the chairs, the laughter that echoes off the walls, the moments that become
              memories.
            </p>
          </RevealText>
        </div>
      </div>

      {/* Parallax column gallery */}
      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 px-6 md:px-12">
        {/* Column 1 */}
        <motion.div className="space-y-3 md:space-y-4" style={{ y: reduced ? 0 : col1Y }}>
          {galleryImages.slice(0, 3).map((img, i) => (
            <GalleryImage key={i} img={img} index={i} />
          ))}
        </motion.div>

        {/* Column 2 — offset higher */}
        <motion.div className="space-y-3 md:space-y-4 md:mt-16" style={{ y: reduced ? 0 : col2Y }}>
          {galleryImages.slice(3, 6).map((img, i) => (
            <GalleryImage key={i} img={img} index={i + 3} />
          ))}
        </motion.div>

        {/* Column 3 — only on desktop */}
        <motion.div
          className="hidden md:block space-y-4 md:mt-8"
          style={{ y: reduced ? 0 : col3Y }}
        >
          {galleryImages.slice(6, 9).map((img, i) => (
            <GalleryImage key={i} img={img} index={i + 6} />
          ))}
        </motion.div>
      </div>

      {/* Horizontal scrolling strip */}
      {!reduced && (
        <motion.div
          className="flex gap-4 mt-16 md:mt-24"
          style={{ x: stripX }}
        >
          {galleryImages.map((img, i) => (
            <div
              key={`strip-${i}`}
              className="relative flex-shrink-0 w-64 h-40 overflow-hidden rounded-sm"
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ filter: 'brightness(0.8)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/40 to-transparent" />
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

function GalleryImage({ img, index }: { img: { url: string; alt: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.1,
        ease: [0.7, 0, 0.3, 1],
      }}
      className="relative overflow-hidden rounded-sm group cursor-default"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={img.url}
          alt={img.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          style={{ filter: 'brightness(0.85)' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
