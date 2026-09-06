import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { CoffeeBean } from '@/components/CoffeeBean';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { coffeeExperienceImages, cupImage } from '@/data/images';

export function CoffeeExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const sceneScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const beanForward1 = useTransform(scrollYProgress, [0, 0.5], [80, 0]);
  const beanForward2 = useTransform(scrollYProgress, [0, 0.5], [120, 20]);
  const beanForward3 = useTransform(scrollYProgress, [0, 0.5], [60, -20]);

  // Interactive cup tilt
  const cupRotX = useMotionValue(0);
  const cupRotY = useMotionValue(0);
  const smoothRotX = useSpring(cupRotX, { stiffness: 80, damping: 20 });
  const smoothRotY = useSpring(cupRotY, { stiffness: 80, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cupRotY.set(px * 20);
    cupRotX.set(-py * 15);
  };

  const handleMouseLeave = () => {
    cupRotX.set(0);
    cupRotY.set(0);
  };

  // Floating bean parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  if (!reduced) {
    mx.set(mouse.normalizedX);
    my.set(mouse.normalizedY);
  }
  const beanX = useTransform(mx, [-1, 1], [-20, 20]);
  const beanY = useTransform(my, [-1, 1], [-15, 15]);

  return (
    <section
      id="coffee"
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #2a1810 0%, #1a0f0a 50%, #0d0805 100%)' }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(201,160,78,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Floating beans — foreground depth */}
      {!reduced && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ x: beanX, y: beanY }}
        >
          <motion.div
            className="absolute top-[15%] left-[8%]"
            style={{ y: beanForward1 }}
          >
            <div style={{ animation: 'slow-drift 10s ease-in-out infinite' }}>
              <CoffeeBean size={36} rotateSpeed={20} />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-[70%] right-[10%]"
            style={{ y: beanForward2 }}
          >
            <div style={{ animation: 'slow-drift 14s ease-in-out infinite 1.5s' }}>
              <CoffeeBean size={28} rotateSpeed={25} />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-[40%] right-[6%]"
            style={{ y: beanForward3 }}
          >
            <div style={{ animation: 'slow-drift 12s ease-in-out infinite 3s' }}>
              <CoffeeBean size={22} rotateSpeed={30} />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-[85%] left-[20%]"
            style={{ y: beanForward2 }}
          >
            <div style={{ animation: 'slow-drift 16s ease-in-out infinite 0.5s' }}>
              <CoffeeBean size={18} rotateSpeed={35} />
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12"
        style={{ scale: reduced ? 1 : sceneScale }}
      >
        {/* Section label */}
        <RevealText>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">Chapter Two — The Craft</span>
          </div>
        </RevealText>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24">
          <div>
            <RevealText delay={0.1}>
              <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl text-[#f5ebe0] leading-tight mb-6">
                The art of
                <br />
                <span className="italic text-[#c9a04e]">the pour.</span>
              </h2>
            </RevealText>
            <RevealText delay={0.3}>
              <p className="font-body text-base md:text-lg text-[#f5ebe0]/70 leading-relaxed max-w-md mb-6">
                Espresso is not a recipe. It is a negotiation between pressure, heat,
                and a bean that has something to say. Our baristas listen for the
                moment the pour turns from gold to amber — that is when the story begins.
              </p>
            </RevealText>
            <RevealText delay={0.5}>
              <div className="flex flex-wrap gap-3">
                {['Espresso', 'Pour-over', 'Flat White', 'Cold Brew', 'Mocha'].map((drink) => (
                  <span
                    key={drink}
                    className="font-mono-label text-[9px] px-4 py-2 border border-[#c9a04e]/20 rounded-full text-[#f5ebe0]/50 hover:text-[#c9a04e] hover:border-[#c9a04e]/40 transition-all duration-300 cursor-default"
                  >
                    {drink}
                  </span>
                ))}
              </div>
            </RevealText>
          </div>

          {/* Interactive 3D coffee cup */}
          <div
            className="relative flex items-center justify-center h-[400px] md:h-[500px] perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Steam */}
            {!reduced && (
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 pointer-events-none z-10">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute w-12 h-12 rounded-full"
                    style={{
                      left: `${i * 12 - 18}px`,
                      background:
                        'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                      animation: `steam-rise ${4 + i * 0.5}s ease-out infinite ${i * 0.8}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Cup with 3D tilt */}
            <motion.div
              className="relative z-0"
              style={{
                rotateX: smoothRotX,
                rotateY: smoothRotY,
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className="relative w-64 h-44 md:w-80 md:h-52 rounded-b-2xl rounded-t-lg overflow-hidden shadow-2xl"
                style={{
                  boxShadow:
                    '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(201,160,78,0.1)',
                }}
              >
                <img
                  src={cupImage.url}
                  alt={cupImage.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ filter: 'brightness(0.9) contrast(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/30 to-transparent" />
              </div>
              {/* Soft shadow beneath */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 rounded-full blur-xl"
                style={{ background: 'rgba(0,0,0,0.4)' }}
              />
            </motion.div>

            {/* Glow behind cup */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(201,160,78,0.12) 0%, transparent 50%)',
              }}
            />
          </div>
        </div>

        {/* Coffee experience gallery — cinematic strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {coffeeExperienceImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: [0.7, 0, 0.3, 1],
              }}
              className={`relative overflow-hidden rounded-sm group cursor-default ${
                i === 0 ? 'col-span-2 md:row-span-2 h-48 md:h-full' : 'h-32 md:h-44'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                style={{ filter: 'brightness(0.8)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
