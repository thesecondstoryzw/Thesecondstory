import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { communityImages, lifestyleImages, cafeInteriorImages } from '@/data/images';

export function CommunityStory() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const col1Y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const col2Y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const col3Y = useTransform(scrollYProgress, [0, 1], [40, -80]);

  return (
    <section
      id="community"
      ref={ref}
      className="relative w-full overflow-hidden py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0d0805 0%, #1a0f0a 40%, #2a1810 100%)' }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(201,160,78,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <RevealText>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">The Second Story</span>
          </div>
        </RevealText>

        <RevealText delay={0.1}>
          <h2 className="font-serif-display text-4xl md:text-6xl lg:text-7xl text-[#f5ebe0] leading-tight max-w-3xl">
            Coffee creates
            <br />
            <span className="italic text-[#c9a04e]">moments.</span>
          </h2>
        </RevealText>

        <RevealText delay={0.3}>
          <p className="font-body text-base md:text-lg text-[#f5ebe0]/60 leading-relaxed max-w-lg mt-8">
            A bean became a cup. A cup became a reason to sit longer.
            A conversation became a memory. A memory became a story —
            the kind that only happens here.
          </p>
        </RevealText>
      </div>

      {/* Parallax image columns */}
      <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 px-6 md:px-12 mb-24">
        <motion.div className="space-y-3 md:space-y-4" style={{ y: reduced ? 0 : col1Y }}>
          {communityImages.slice(0, 3).map((img, i) => (
            <CommunityImage key={i} img={img} index={i} />
          ))}
        </motion.div>
        <motion.div className="space-y-3 md:space-y-4 md:mt-20" style={{ y: reduced ? 0 : col2Y }}>
          {communityImages.slice(3, 6).map((img, i) => (
            <CommunityImage key={i} img={img} index={i + 3} />
          ))}
        </motion.div>
        <motion.div
          className="hidden md:block space-y-4 md:mt-10"
          style={{ y: reduced ? 0 : col3Y }}
        >
          {lifestyleImages.slice(0, 3).map((img, i) => (
            <CommunityImage key={i} img={img} index={i + 6} />
          ))}
        </motion.div>
      </div>

      {/* Lifestyle strip — quiet moments */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 mb-24">
        <RevealText>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">Quiet Moments</span>
          </div>
        </RevealText>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {lifestyleImages.slice(0, 6).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.9,
                delay: (i % 3) * 0.1,
                ease: [0.7, 0, 0.3, 1],
              }}
              className="relative overflow-hidden rounded-sm group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  style={{ filter: 'brightness(0.8) sepia(0.08)' }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/40 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Café interior — the world */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <RevealText>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">The World</span>
          </div>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {cafeInteriorImages.slice(0, 6).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.9,
                delay: (i % 3) * 0.1,
                ease: [0.7, 0, 0.3, 1],
              }}
              className="relative overflow-hidden rounded-sm group"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  style={{ filter: 'brightness(0.75) sepia(0.1)' }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/40 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityImage({ img, index }: { img: { url: string; alt: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.08,
        ease: [0.7, 0, 0.3, 1],
      }}
      className="relative overflow-hidden rounded-sm group"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={img.url}
          alt={img.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          style={{ filter: 'brightness(0.82) sepia(0.06)' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
