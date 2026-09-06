import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { CoffeeBean } from '@/components/CoffeeBean';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { roasteryImages } from '@/data/images';

export function Roastery() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.6], [0, 1, 1, 0]);
  const beanExpand = useTransform(scrollYProgress, [0, 0.3], [0.5, 2]);
  const beanOpacity = useTransform(scrollYProgress, [0, 0.1, 0.25], [0, 0.8, 0]);

  return (
    <section id="roastery" ref={ref} className="relative w-full overflow-hidden">
      {/* Bean transition — beans enlarge as we move into the roastery */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ scale: beanExpand, opacity: beanOpacity }}
        >
          <CoffeeBean size={60} rotateSpeed={15} />
          <div className="absolute -translate-x-32">
            <CoffeeBean size={40} rotateSpeed={20} />
          </div>
          <div className="absolute translate-x-28 -translate-y-12">
            <CoffeeBean size={35} rotateSpeed={25} />
          </div>
        </motion.div>
      )}

      {/* Sticky cinematic roastery scene */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          style={{
            scale: reduced ? 1 : bgScale,
            opacity: bgOpacity,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${roasteryImages[2].url})`,
              filter: 'brightness(0.35) contrast(1.2)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0805] via-[#0d0805]/50 to-[#0d0805]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 60% 40%, rgba(201,160,78,0.08) 0%, transparent 60%)',
            }}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex items-center z-10"
          style={{ opacity: textOpacity, y: reduced ? 0 : textY }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
            <div className="max-w-xl">
              <RevealText>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-[#c9a04e]" />
                  <span className="font-mono-label text-[10px] text-[#c9a04e]">
                    Chapter Three — The Roastery
                  </span>
                </div>
              </RevealText>

              <RevealText delay={0.15}>
                <h2 className="font-serif-display text-4xl md:text-5xl lg:text-7xl text-[#f5ebe0] leading-tight mb-6">
                  Fire, time,
                  <br />
                  <span className="italic text-[#c9a04e]">and patience.</span>
                </h2>
              </RevealText>

              <RevealText delay={0.3}>
                <p className="font-body text-base md:text-lg text-[#f5ebe0]/70 leading-relaxed mb-8">
                  Behind the counter, our roaster turns raw green beans into something
                  worth waiting for. First crack at 196°C. The silence that follows.
                  Then the slow, dark descent into caramel and smoke — stopped at the
                  exact second the bean's character is loudest.
                </p>
              </RevealText>

              <RevealText delay={0.5}>
                <div className="grid grid-cols-3 gap-6 border-t border-[#c9a04e]/15 pt-6">
                  <div>
                    <span className="font-serif-display text-2xl md:text-3xl text-[#c9a04e]">196°</span>
                    <p className="font-mono-label text-[8px] text-[#f5ebe0]/40 mt-1">First Crack</p>
                  </div>
                  <div>
                    <span className="font-serif-display text-2xl md:text-3xl text-[#c9a04e]">12m</span>
                    <p className="font-mono-label text-[8px] text-[#f5ebe0]/40 mt-1">Avg. Roast</p>
                  </div>
                  <div>
                    <span className="font-serif-display text-2xl md:text-3xl text-[#c9a04e]">72h</span>
                    <p className="font-mono-label text-[8px] text-[#f5ebe0]/40 mt-1">Rest Period</p>
                  </div>
                </div>
              </RevealText>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Roastery image grid — below the sticky scene */}
      <div className="relative bg-[#0d0805] py-24 md:py-32 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <RevealText>
            <h3 className="font-serif-display text-2xl md:text-3xl text-[#f5ebe0] mb-12 text-center">
              The process, <span className="italic text-[#c9a04e]">frame by frame.</span>
            </h3>
          </RevealText>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {roasteryImages.slice(0, 6).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 1,
                  delay: i * 0.08,
                  ease: [0.7, 0, 0.3, 1],
                }}
                className={`relative overflow-hidden rounded-sm group ${
                  i === 0 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/50 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
