import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageCircle, MapPin, Clock } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cupImages, cafeWindowImage } from '@/data/images';

export function FinalEnding() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const cupY = useTransform(scrollYProgress, [0, 1], [80, -30]);
  const cupScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section
      id="visit"
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2a1810 0%, #1a0f0a 50%, #0d0805 100%)' }}
    >
      {/* The emotional close — one cup, one story */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
        {/* Background — warm cafe glow */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: reduced ? 1 : bgScale, y: reduced ? 0 : bgY }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${cafeWindowImage.url})`,
              filter: 'brightness(0.25) contrast(1.1)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1810] via-[#1a0f0a]/70 to-[#0d0805]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(201,160,78,0.1) 0%, transparent 60%)',
            }}
          />
        </motion.div>

        {/* Cup image — the payoff */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          style={{ y: reduced ? 0 : cupY, scale: reduced ? 1 : cupScale }}
        >
          {/* Steam effect */}
          {!reduced && (
            <div className="relative mb-[-40px] z-20 pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-16 h-16 rounded-full"
                  style={{
                    left: `${i * 14 - 28}px`,
                    top: 0,
                    background:
                      'radial-gradient(circle, rgba(245,235,224,0.06) 0%, transparent 70%)',
                    animation: `steam-rise ${4 + i * 0.4}s ease-out infinite ${i * 0.6}s`,
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(15px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.8, ease: [0.7, 0, 0.3, 1] }}
            className="relative w-48 h-64 md:w-64 md:h-80 overflow-hidden rounded-sm"
            style={{
              boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,160,78,0.15)',
            }}
          >
            <img
              src={cupImages[0].url}
              alt={cupImages[0].alt}
              className="w-full h-full object-cover"
              loading="lazy"
              style={{ filter: 'brightness(0.9) contrast(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/30 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Final message */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 z-20 px-6"
          style={{ y: reduced ? 0 : textY }}
        >
          <RevealText delay={0.3}>
            <p className="font-mono-label text-[10px] text-[#c9a04e]/60 mb-6 text-center">
              Every Cup Has
            </p>
          </RevealText>
          <RevealText delay={0.5}>
            <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-[#f5ebe0] text-center leading-[1.05]">
              A Second
              <br />
              <span className="italic text-[#c9a04e]">Story.</span>
            </h2>
          </RevealText>
          <RevealText delay={0.8}>
            <p className="font-body text-sm md:text-base text-[#f5ebe0]/50 mt-8 max-w-md text-center leading-relaxed">
              From a single bean to a moment shared.
              From a moment to a memory.
              From a memory to a story worth telling.
            </p>
          </RevealText>
        </motion.div>
      </div>

      {/* Visit / Contact — integrated into the world */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <RevealText>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">Visit The Second Story</span>
          </div>
        </RevealText>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
          <RevealText delay={0.1}>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#c9a04e] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-mono-label text-[9px] text-[#c9a04e] mb-2">Find Us</h3>
                <p className="font-body text-base text-[#f5ebe0]/80 leading-relaxed">
                  Harare, Zimbabwe
                  <br />
                  The Second Story
                  <br />
                  Specialty Coffee + Lifestyle Cafe
                </p>
              </div>
            </div>
          </RevealText>

          <RevealText delay={0.2}>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#c9a04e] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-mono-label text-[9px] text-[#c9a04e] mb-2">Hours</h3>
                <p className="font-body text-base text-[#f5ebe0]/80 leading-relaxed">
                  Mon — Fri · 7am to 8pm
                  <br />
                  Sat — Sun · 8am to 9pm
                </p>
              </div>
            </div>
          </RevealText>

          <RevealText delay={0.3}>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono-label text-[9px] text-[#c9a04e] mb-2">Connect</h3>
              <a
                href="https://wa.me/0000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 border border-[#c9a04e]/25 rounded-full text-[#c9a04e] hover:bg-[#c9a04e]/10 transition-all duration-500 w-fit"
              >
                <MessageCircle className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-mono-label text-[10px]">WhatsApp</span>
              </a>
            </div>
          </RevealText>
        </div>

        {/* Final tagline */}
        <RevealText delay={0.5}>
          <div className="border-t border-[#c9a04e]/10 pt-12 text-center">
            <p className="font-serif-display text-2xl md:text-3xl text-[#f5ebe0]/40 italic">
              Crafting Delicious Narratives
            </p>
          </div>
        </RevealText>
      </div>
    </section>
  );
}
