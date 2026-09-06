import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface CoffeeBeanProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  rotateSpeed?: number;
}

export function CoffeeBean({
  size = 40,
  className = '',
  style,
  rotateSpeed = 20,
}: CoffeeBeanProps) {
  return (
    <motion.div
      className={`preserve-3d ${className}`}
      style={style}
      animate={{ rotateY: [0, 360] }}
      transition={{
        duration: rotateSpeed,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 40 52"
        style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}
      >
        <ellipse cx="20" cy="26" rx="14" ry="24" fill="#3b2417" />
        <ellipse cx="20" cy="26" rx="13" ry="23" fill="url(#beanGrad)" />
        <path
          d="M20 4 Q24 26 20 48"
          stroke="#1a0f0a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="15" cy="20" rx="4" ry="6" fill="#5a3520" opacity="0.4" />
        <defs>
          <radialGradient id="beanGrad" cx="0.35" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#6b4226" />
            <stop offset="50%" stopColor="#4a2a18" />
            <stop offset="100%" stopColor="#2a1810" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
