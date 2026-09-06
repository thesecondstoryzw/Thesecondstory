import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageCircle, MapPin, Clock, Coffee, Instagram } from 'lucide-react';
import { RevealText } from '@/components/RevealText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cafeWindowImage } from '@/data/images';

export function Visit() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section
      id="visit"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden flex items-center"
    >
      {/* Background image — warm café window */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduced ? 1 : bgScale, y: reduced ? 0 : bgY }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${cafeWindowImage.url})`,
            filter: 'brightness(0.3) contrast(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0805] via-[#0d0805]/70 to-[#0d0805]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(201,160,78,0.08) 0%, transparent 60%)',
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24 w-full"
        style={{ y: reduced ? 0 : textY }}
      >
        <RevealText>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">The Final Chapter — Visit</span>
          </div>
        </RevealText>

        <RevealText delay={0.1}>
          <h2 className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-[#f5ebe0] leading-tight mb-8">
            Your story
            <br />
            <span className="italic text-[#c9a04e]">starts here.</span>
          </h2>
        </RevealText>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mt-12">
          {/* Left — info */}
          <div className="space-y-8">
            <RevealText delay={0.2}>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#c9a04e] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-mono-label text-[10px] text-[#c9a04e] mb-1">Find Us</h3>
                  <p className="font-body text-base text-[#f5ebe0]/80 leading-relaxed">
                    42 Lantern Street
                    <br />
                    Old Town Quarter
                  </p>
                </div>
              </div>
            </RevealText>

            <RevealText delay={0.3}>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#c9a04e] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-mono-label text-[10px] text-[#c9a04e] mb-1">Hours</h3>
                  <p className="font-body text-base text-[#f5ebe0]/80 leading-relaxed">
                    Monday — Friday · 7am to 8pm
                    <br />
                    Saturday — Sunday · 8am to 9pm
                  </p>
                </div>
              </div>
            </RevealText>

            <RevealText delay={0.4}>
              <div className="flex items-start gap-4">
                <Coffee className="w-5 h-5 text-[#c9a04e] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-mono-label text-[10px] text-[#c9a04e] mb-1">What to Expect</h3>
                  <p className="font-body text-base text-[#f5ebe0]/80 leading-relaxed max-w-sm">
                    Slow coffee, warm light, good conversation. No rush, no noise —
                    just the hum of a room that wants you to stay.
                  </p>
                </div>
              </div>
            </RevealText>
          </div>

          {/* Right — WhatsApp CTA */}
          <div className="flex flex-col items-start justify-center">
            <RevealText delay={0.3}>
              <p className="font-body text-lg text-[#f5ebe0]/70 leading-relaxed mb-8 max-w-sm">
                Have a question, want to reserve a table, or planning an event?
                We respond fastest on WhatsApp.
              </p>
            </RevealText>

            <RevealText delay={0.5}>
              <a
                href="https://wa.me/0000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#c9a04e] text-[#0d0805] rounded-full overflow-hidden transition-all duration-500 hover:scale-105"
              >
                <span
                  className="absolute inset-0 bg-[#e8c39e] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                />
                <MessageCircle className="w-5 h-5 relative z-10" />
                <span className="font-mono-label text-xs relative z-10">Message Us on WhatsApp</span>
              </a>
            </RevealText>

            <RevealText delay={0.6}>
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#f5ebe0]/50 hover:text-[#c9a04e] transition-colors duration-300"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="font-mono-label text-[10px]">@thesecondstory</span>
                </a>
              </div>
            </RevealText>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
