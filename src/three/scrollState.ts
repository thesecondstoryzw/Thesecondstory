import { useRef } from 'react';

export const scrollProgressRef = { current: 0 };

// Raw progress is driven directly by the browser scroll. 3D objects use this
// second value so rapid wheel/trackpad updates do not make the composition jump
// when the chapter copy changes.
export const sceneProgressRef = { current: 0 };


export function useScrollProgress() {
  return scrollProgressRef;
}

export const scenePhases = {
  hero: { start: 0, end: 0.06 },
  beanEnters: { start: 0.04, end: 0.16 },
  beanTravels: { start: 0.12, end: 0.28 },
  roasting: { start: 0.24, end: 0.40 },
  grinding: { start: 0.36, end: 0.52 },
  brewing: { start: 0.48, end: 0.66 },
  pouring: { start: 0.62, end: 0.76 },
  finalCup: { start: 0.72, end: 0.84 },
};

export type PhaseName = keyof typeof scenePhases;

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function smoothstep(min: number, max: number, value: number): number {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return lerp(outMin, outMax, smoothstep(inMin, inMax, value));
}
