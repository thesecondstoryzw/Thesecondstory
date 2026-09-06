import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { brandStoryImages } from '@/data/images';

export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const img1Y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const img2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const img3Y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const bgHue = useTransform(scrollYProgress, [0, 0.5, 1], ['#0d0805', '#1a0f0a', '#2a1810']);

  return (
    <section id="story" ref={ref} className="relative min-h-screen w-full overflow-hidden py-24 md:py-32">
      <motion.div className="absolute inset-0" style={{ backgroundColor: bgHue }} />

      {/* Warm light gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(201,160,78,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section label */}
        <RevealText>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">Chapter One — Our Story</span>
          </div>
        </RevealText>

        {/* Main content — two column with parallax images */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24">
          <div className="space-y-6">
            <RevealText delay={0.1}>
              <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl text-[#f5ebe0] leading-tight">
                Every cup carries
                <br />
                <span className="italic text-[#c9a04e]">a second story.</span>
              </h2>
            </RevealText>
            <RevealText delay={0.3}>
              <p className="font-body text-base md:text-lg text-[#f5ebe0]/70 leading-relaxed max-w-md">
                The first story is the bean's journey — from a hillside farm to a
                roaster's careful hands. The second story is yours: the conversation
                that spilled past closing time, the book you finally finished, the
                morning that changed everything.
              </p>
            </RevealText>
            <RevealText delay={0.5}>
              <p className="font-body text-base md:text-lg text-[#f5ebe0]/70 leading-relaxed max-w-md">
                We exist to be the space where that second story begins. A warm room,
                a careful pour, and the quiet feeling that you've arrived somewhere
                that remembers you.
              </p>
            </RevealText>
          </div>

          {/* Parallax image stack */}
          <div className="relative h-[400px] md:h-[500px]">
            <motion.div
              className="absolute top-0 right-0 w-3/4 h-3/4 overflow-hidden rounded-sm"
              style={{ y: reduced ? 0 : img1Y }}
            >
              <img
                src={brandStoryImages[0].url}
                alt={brandStoryImages[0].alt}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ filter: 'brightness(0.85) sepia(0.15)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/40 to-transparent" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-1/2 h-1/2 overflow-hidden rounded-sm border-4 border-[#0d0805]"
              style={{ y: reduced ? 0 : img2Y }}
            >
              <img
                src={brandStoryImages[1].url}
                alt={brandStoryImages[1].alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>

        {/* Three value pillars */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 mb-16">
          {[
            {
              num: '01',
              title: 'Sourced with care',
              text: 'Single-origin beans from farms we know by name, roasted in small batches.',
            },
            {
              num: '02',
              title: 'Crafted by hand',
              text: 'Every drink is a deliberate act — no timers, no shortcuts, just attention.',
            },
            {
              num: '03',
              title: 'Shared with you',
              text: 'A room designed for lingering, not transactions. You are the second story.',
            },
          ].map((item, i) => (
            <RevealText key={item.num} delay={i * 0.15}>
              <div className="border-t border-[#c9a04e]/20 pt-6">
                <span className="font-mono-label text-[10px] text-[#c9a04e]">{item.num}</span>
                <h3 className="font-serif-display text-xl text-[#f5ebe0] mt-3 mb-3">{item.title}</h3>
                <p className="font-body text-sm text-[#f5ebe0]/60 leading-relaxed">{item.text}</p>
              </div>
            </RevealText>
          ))}
        </div>

        {/* Bottom parallax image */}
        <motion.div
          className="relative h-[300px] md:h-[400px] overflow-hidden rounded-sm"
          style={{ y: reduced ? 0 : img3Y }}
        >
          <img
            src={brandStoryImages[2].url}
            alt={brandStoryImages[2].alt}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ filter: 'brightness(0.7) sepia(0.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <RevealText>
              <p className="font-serif-display text-xl md:text-2xl text-[#f5ebe0]/80 italic max-w-2xl">
                "Coffee is a language in itself — a way of saying slow down, stay a while,
                tell me something real."
              </p>
            </RevealText>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
