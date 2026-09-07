import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExperienceCanvas } from '@/three/ExperienceCanvas';
import { scrollProgressRef } from '@/three/scrollState';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Chapter {
  id: string;
  range: [number, number];
  label: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

const chapters: Chapter[] = [
  { id: 'beginning', range: [0.06, 0.16], label: 'Chapter 01', title: 'Every story\nhas a beginning.', align: 'right' },
  { id: 'travels', range: [0.16, 0.28], label: 'Chapter 02', title: 'The journey\nbegins.', subtitle: 'One bean. A thousand possibilities.', align: 'left' },
  { id: 'roasting', range: [0.28, 0.40], label: 'Chapter 03', title: 'Fire transforms\nwhat patience\nbegins.', subtitle: 'Heat. Time. First crack.', align: 'right' },
  { id: 'grinding', range: [0.40, 0.54], label: 'Chapter 04', title: 'The break.', subtitle: 'Whole becomes fragments.\nFragments become possibility.', align: 'left' },
  { id: 'extraction', range: [0.55, 0.72], label: 'Chapter 05', title: 'Pressure makes\nthe moment.', subtitle: 'Ground coffee. Hot water.\nA quiet transformation.', align: 'left' },
  // Keep the final copy out of the centered cup product shot; the cup owns the middle of frame.
  { id: 'cup', range: [0.74, 0.92], label: 'Chapter 06', title: 'One cup.\nOne story.', subtitle: 'The journey is complete.', align: 'left' },
];

function ChapterOverlay({ chapter, progress }: { chapter: Chapter; progress: number }) {
  const [rangeStart, rangeEnd] = chapter.range;
  const mid = (rangeStart + rangeEnd) / 2;
  const distance = Math.abs(progress - mid) / (rangeEnd - rangeStart);
  const visibility = Math.max(0, 1 - distance * 1.8);
  const offsetY = (progress - mid) * 200;

  const alignClass =
    chapter.align === 'left'
      ? 'items-start text-left'
      : chapter.align === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  // Keep the large type in a dedicated safe zone so it never sits on top of a 3D product.
  const safeWidth =
    chapter.id === 'grinding' || chapter.id === 'extraction'
      ? 'max-w-[34rem] lg:max-w-[38rem] lg:pr-10'
      : chapter.id === 'cup'
      ? 'max-w-[18rem] md:max-w-[22rem] lg:max-w-[26rem] lg:pr-8'
      : 'max-w-md';

  // On narrow screens, move the final chapter copy above the centered cup rather
  // than allowing responsive type to cover the product shot.
  const verticalClass =
    chapter.id === 'cup'
      ? 'justify-start pt-24 md:justify-center md:pt-0'
      : 'justify-center';

  return (
    <div
      className={`absolute inset-0 flex flex-col ${verticalClass} ${alignClass} px-6 md:px-16 lg:px-24 pointer-events-none`}
      style={{ opacity: visibility, transform: `translateY(${offsetY}px)`, transition: 'opacity 0.25s ease' }}
    >
      <div className={safeWidth}>
        <div className="font-mono-label text-[9px] text-[#c9a04e]/60 mb-4">{chapter.label}</div>
        <h2 className="font-serif-display text-3xl md:text-5xl lg:text-6xl text-[#f5ebe0] leading-[1.1] whitespace-pre-line">
          {chapter.title}
        </h2>
        {chapter.subtitle && (
          <p className="font-body text-sm md:text-base text-[#f5ebe0]/55 mt-4 leading-relaxed whitespace-pre-line">
            {chapter.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function CinematicExperience() {
  const ref = useRef<HTMLDivElement>(null);
  useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useEffect(() => {
    const update = (latest: number) => {
      scrollProgressRef.current = latest;
      setCurrentProgress(latest);
    };
    return scrollYProgress.on('change', update);
  }, [scrollYProgress]);

  const overlayColor = useTransform(
    scrollYProgress,
    [0, 0.24, 0.32, 0.40, 0.52, 0.66, 0.76, 0.86],
    ['rgba(13,8,5,0)', 'rgba(13,8,5,0)', 'rgba(212,99,42,0.08)', 'rgba(212,99,42,0.05)', 'rgba(13,8,5,0.02)', 'rgba(200,121,74,0.06)', 'rgba(201,160,78,0.04)', 'rgba(13,8,5,0)']
  );

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.04, 0.06, 0.84, 0.86], [0, 0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: '800vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0"><ExperienceCanvas isMobile={isMobile} /></div>
        <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} />
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 42%, rgba(13,8,5,0.58) 100%)' }} />
        <div className="absolute inset-0 z-20 pointer-events-none">
          {chapters.map((chapter) => <ChapterOverlay key={chapter.id} chapter={chapter} progress={currentProgress} />)}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <div className="w-32 h-px bg-[#f5ebe0]/10 relative overflow-hidden">
            <motion.div className="absolute top-0 left-0 h-full bg-[#c9a04e]" style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }} />
          </div>
          <span className="font-mono-label text-[7px] text-[#f5ebe0]/30">{Math.round(currentProgress * 100)}</span>
        </div>
      </div>
    </section>
  );
}