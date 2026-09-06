import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  blur?: boolean;
}

export function RevealText({
  children,
  delay = 0,
  className = '',
  blur = true,
}: RevealTextProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        filter: blur ? 'blur(8px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.7, 0, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
