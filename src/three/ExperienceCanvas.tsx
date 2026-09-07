import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { BeanModel } from '@/three/BeanModel';
import { GrinderModel } from '@/three/GrinderModel';
import { EspressoMachineModel } from '@/three/EspressoMachineModel';
import { CupModel } from '@/three/CupModel';
import {
  AtmosphereParticles,
  RoastingParticles,
  GrindingParticles,
  BrewingParticles,
  SteamParticles,
} from '@/three/ParticleSystems';
import { ScrollCamera, SceneLighting, SceneBackground } from '@/three/SceneEnvironment';
import { scrollProgressRef, sceneProgressRef } from '@/three/scrollState';

function SceneProgressDriver() {
  // Run before the scene models/camera. This gives every 3D element the same
  // damped scroll signal and removes tiny position jumps at chapter boundaries.
  useFrame((_, delta) => {
    const smoothing = 1 - Math.exp(-8 * delta);
    sceneProgressRef.current += (scrollProgressRef.current - sceneProgressRef.current) * smoothing;
  }, -100);
  return null;
}

interface ExperienceCanvasProps {
  isMobile: boolean;
}

export function ExperienceCanvas({ isMobile }: ExperienceCanvasProps) {
  return (
    <Canvas
      shadows={!isMobile}
      dpr={isMobile ? 1 : [1, 2]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      camera={{ position: [0, 0, 12], fov: 45, near: 0.1, far: 100 }}
      onCreated={({ scene }) => {
        scene.background = new THREE.Color('#0d0805');
        scene.fog = new THREE.Fog('#0d0805', 8, 25);
      }}
    >
      <Suspense fallback={null}>
        <SceneProgressDriver />
        <SceneBackground />
        <SceneLighting />
        <ScrollCamera />

        <BeanModel />
        <GrinderModel />
        <EspressoMachineModel />
        <CupModel />

        <AtmosphereParticles count={isMobile ? 100 : 200} />
        {!isMobile && (
          <>
            <RoastingParticles count={80} />
            <GrindingParticles count={120} />
            <BrewingParticles count={100} />
            <SteamParticles count={50} />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}
