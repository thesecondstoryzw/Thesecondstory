import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Environment, Float, useGLTF } from '@react-three/drei';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { heroImages } from '@/data/images';

function CoffeeBeanModel({
  scroll,
  mouseX,
  mouseY,
  reduced,
}: {
  scroll: MotionValue<number>;
  mouseX: number;
  mouseY: number;
  reduced: boolean;
}) {
  const group = useRef<any>(null);
  const { scene } = useGLTF('/models/hero-coffee-bean.glb');

  useFrame((state, delta) => {
    if (!group.current) return;

    const progress = scroll.get();
    const targetX = reduced ? 0 : mouseX * 0.18;
    const targetY = reduced ? 0 : -mouseY * 0.12;

    group.current.position.x += (targetX - group.current.position.x) * 0.045;
    group.current.position.y += (targetY - group.current.position.y) * 0.045;

    group.current.rotation.y += delta * 0.12 + progress * 0.0008;
    group.current.rotation.x = targetY * 0.35 + Math.sin(state.clock.elapsedTime * 0.35) * 0.03;
    group.current.rotation.z = -progress * 0.8 + targetX * 0.08;

    const scale = 1 + progress * 0.7;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function CinematicBeanScene({
  scroll,
  mouseX,
  mouseY,
  reduced,
}: {
  scroll: MotionValue<number>;
  mouseX: number;
  mouseY: number;
  reduced: boolean;
}) {
  const cameraRig = useRef<any>(null);

  useFrame((_, delta) => {
    if (!cameraRig.current) return;

    const progress = scroll.get();
    const targetX = reduced ? 0 : mouseX * 0.28;
    const targetY = reduced ? 0 : mouseY * 0.18;

    cameraRig.current.position.x += (targetX - cameraRig.current.position.x) * 0.03;
    cameraRig.current.position.y += (targetY - cameraRig.current.position.y) * 0.03;
    cameraRig.current.position.z = 5.6 - progress * 3.4;

    cameraRig.current.rotation.y += (targetX * -0.06 - cameraRig.current.rotation.y) * 0.035;
    cameraRig.current.rotation.x += (targetY * 0.04 - cameraRig.current.rotation.x) * 0.035;

    // Keep the subtle movement frame-rate independent.
    cameraRig.current.position.y += Math.sin(performance.now() * 0.00035) * delta * 0.015;
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <spotLight position={[3.5, 5, 4]} angle={0.45} penumbra={1} intensity={42} color="#f4c68c" />
      <spotLight position={[-4, 1, 2]} angle={0.7} penumbra={1} intensity={18} color="#8a4f2a" />
      <pointLight position={[0, -3, 1]} intensity={8} color="#2a1208" />

      <group ref={cameraRig}>
        <Float speed={reduced ? 0 : 1.1} rotationIntensity={0.08} floatIntensity={0.18}>
          <CoffeeBeanModel
            scroll={scroll}
            mouseX={mouseX}
            mouseY={mouseY}
            reduced={reduced}
          />
        </Float>
      </group>

      <Environment preset="warehouse" />
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const scrollTextY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const scrollBlur = useTransform(scrollYProgress, [0, 0.5], [0, 8]);
  const filterBlur = useTransform(scrollBlur, (v) => `blur(${v}px)`);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 20 };
  const smoothMx = useSpring(mx, springConfig);
  const smoothMy = useSpring(my, springConfig);

  mx.set(reduced ? 0 : mouse.normalizedX);
  my.set(reduced ? 0 : mouse.normalizedY);

  const bgX = useTransform(smoothMx, [-1, 1], [-15, 15]);
  const bgY = useTransform(smoothMy, [-1, 1], [-10, 10]);
  const textX = useTransform(smoothMx, [-1, 1], [-12, 12]);
  const textY = useTransform(smoothMy, [-1, 1], [-8, 8]);

  return (
    <section id="hero" ref={ref} className="relative h-[180vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background layer */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale: scrollScale,
            x: reduced ? 0 : bgX,
            y: reduced ? 0 : bgY,
            opacity: scrollOpacity,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroImages[0].url})`,
              filter: 'brightness(0.24) contrast(1.2) saturate(0.75)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(66,35,17,0.08),rgba(13,8,5,0.88)_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0805]/80 via-[#0d0805]/15 to-[#0d0805]" />
        </motion.div>

        {/* Real 3D bean */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{ opacity: scrollOpacity }}
        >
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 5.6], fov: 34 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <CinematicBeanScene
                scroll={scrollYProgress}
                mouseX={mouse.normalizedX}
                mouseY={mouse.normalizedY}
                reduced={reduced}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Atmospheric warm glow */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute top-[18%] right-[12%] h-[32rem] w-[32rem] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,160,78,0.12) 0%, transparent 70%)',
              animation: 'pulse-glow 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute bottom-[8%] left-[8%] h-[24rem] w-[24rem] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(120,53,15,0.13) 0%, transparent 70%)',
              animation: 'pulse-glow 10s ease-in-out infinite 2s',
            }}
          />
        </div>

        {/* Typography */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
          style={{
            x: reduced ? 0 : textX,
            y: scrollTextY,
            opacity: scrollOpacity,
            filter: filterBlur,
          }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.7, 0, 0.3, 1] }}
            className="font-mono-label text-[10px] md:text-xs text-[#c9a04e] mb-6"
          >
            Every story starts somewhere
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 2, delay: 0.4, ease: [0.7, 0, 0.3, 1] }}
            className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-[#f5ebe0] text-center leading-[1.05] max-w-5xl px-6"
          >
            The Second
            <br />
            <span className="italic text-[#c9a04e]">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.4, ease: [0.7, 0, 0.3, 1] }}
            className="font-body text-sm md:text-base text-[#f5ebe0]/60 mt-8 max-w-md text-center px-6 leading-relaxed"
          >
            It starts with a bean. Scroll forward and step into the story.
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          style={{ opacity: scrollOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="font-mono-label text-[8px] text-[#f5ebe0]/40">Scroll to enter</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-4 h-4 text-[#c9a04e]" />
          </motion.div>
        </motion.div>

        {/* Letterbox */}
        <div className="absolute top-0 left-0 right-0 h-[5vh] bg-[#0d0805] z-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[5vh] bg-[#0d0805] z-40 pointer-events-none" />
      </div>
    </section>
  );
}

useGLTF.preload('/models/hero-coffee-bean.glb');
