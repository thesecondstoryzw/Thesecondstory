import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { RevealText } from '@/components/RevealText';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { productImages } from '@/data/images';

interface Product {
  name: string;
  origin: string;
  notes: string;
  roast: string;
  price: string;
  image: string;
  alt: string;
}

const products: Product[] = [
  {
    name: 'The Morning Light',
    origin: 'Ethiopia · Yirgacheffe',
    notes: 'Jasmine · Stone Fruit · Honey',
    roast: 'Light',
    price: '$18',
    image: productImages[1].url,
    alt: productImages[1].alt,
  },
  {
    name: 'The Second Story',
    origin: 'Colombia · Huila',
    notes: 'Caramel · Cocoa · Walnut',
    roast: 'Medium',
    price: '$16',
    image: productImages[0].url,
    alt: productImages[0].alt,
  },
  {
    name: 'The Last Pour',
    origin: 'Indonesia · Sumatra',
    notes: 'Cedar · Dark Chocolate · Spice',
    roast: 'Dark',
    price: '$17',
    image: productImages[2].url,
    alt: productImages[2].alt,
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const liftY = useMotionValue(0);
  const smoothRotX = useSpring(rotX, { stiffness: 100, damping: 15 });
  const smoothRotY = useSpring(rotY, { stiffness: 100, damping: 15 });
  const smoothLift = useSpring(liftY, { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 25);
    rotX.set(-py * 18);
    liftY.set(-12);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    liftY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.7, 0, 0.3, 1],
      }}
      className="perspective-1000"
    >
      <motion.div
        className="relative"
        style={{
          rotateX: smoothRotX,
          rotateY: smoothRotY,
          y: smoothLift,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product image — coffee bag */}
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-sm"
          style={{
            boxShadow: hovered
              ? '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,160,78,0.15)'
              : '0 20px 40px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.5s ease',
          }}
        >
          <img
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ filter: hovered ? 'brightness(1) contrast(1.1)' : 'brightness(0.85)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0805] via-[#0d0805]/20 to-transparent" />

          {/* Roast badge */}
          <div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full border border-[#c9a04e]/30 backdrop-blur-sm"
            style={{ background: 'rgba(13,8,5,0.6)' }}
          >
            <span className="font-mono-label text-[8px] text-[#c9a04e]">{product.roast}</span>
          </div>

          {/* Product info */}
          <div
            className="absolute bottom-0 left-0 right-0 p-5 md:p-6"
            style={{ transform: 'translateZ(40px)' }}
          >
            <span className="font-mono-label text-[8px] text-[#c9a04e]/70">{product.origin}</span>
            <h3 className="font-serif-display text-xl md:text-2xl text-[#f5ebe0] mt-1 mb-2">
              {product.name}
            </h3>
            <p className="font-body text-xs text-[#f5ebe0]/50 mb-3">{product.notes}</p>
            <div className="flex items-center justify-between">
              <span className="font-serif-display text-lg text-[#c9a04e]">{product.price}</span>
              <motion.span
                className="font-mono-label text-[9px] text-[#f5ebe0]/40"
                animate={{ opacity: hovered ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
              >
                Take Home →
              </motion.span>
            </div>
          </div>

          {/* Light sweep on hover */}
          {hovered && !reduced && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div
                className="absolute top-0 -left-full w-1/2 h-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(245,235,224,0.1), transparent)',
                  animation: 'light-sweep 1.2s ease-out',
                }}
              />
            </div>
          )}
        </div>

        {/* Shadow beneath product */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-lg"
          style={{
            background: 'rgba(0,0,0,0.4)',
            opacity: hovered ? 0.3 : 0.5,
            scale: hovered ? 0.9 : 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function Products() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0d0805 0%, #1a0f0a 100%)' }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: reduced ? 0 : bgY,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(201,160,78,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <RevealText>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#c9a04e]" />
            <span className="font-mono-label text-[10px] text-[#c9a04e]">
              Take The Second Story Home
            </span>
          </div>
        </RevealText>

        <RevealText delay={0.1}>
          <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl text-[#f5ebe0] leading-tight mb-4 max-w-2xl">
            Three roasts.
            <br />
            <span className="italic text-[#c9a04e]">Three stories.</span>
          </h2>
        </RevealText>

        <RevealText delay={0.3}>
          <p className="font-body text-base text-[#f5ebe0]/60 leading-relaxed max-w-md mb-16">
            Each bag is roasted within 48 hours of shipping. Move your cursor over
            a bag to look closer.
          </p>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
