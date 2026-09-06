import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { BeanModel } from '@/three/BeanModel';
import {
  AtmosphereParticles,
  RoastingParticles,
  GrindingParticles,
  BrewingParticles,
  SteamParticles,
} from '@/three/ParticleSystems';
import { ScrollCamera, SceneLighting, SceneBackground } from '@/three/SceneEnvironment';

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
        <SceneBackground />
        <SceneLighting />
        <ScrollCamera />

        <BeanModel />

        <AtmosphereParticles count={isMobile ? 100 : 200} />
        {!isMobile && (
          <>
            <RoastingParticles count={80} />
            <GrindingParticles count={60} />
            <BrewingParticles count={100} />
            <SteamParticles count={50} />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}
