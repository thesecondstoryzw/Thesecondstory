import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });
  const rafRef = useRef<number | undefined>(undefined);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      if (rafRef.current === undefined) {
        rafRef.current = requestAnimationFrame(() => {
          const x = targetRef.current.x;
          const y = targetRef.current.y;
          setPosition({
            x,
            y,
            normalizedX: (x / window.innerWidth) * 2 - 1,
            normalizedY: (y / window.innerHeight) * 2 - 1,
          });
          rafRef.current = undefined;
        });
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return position;
}
