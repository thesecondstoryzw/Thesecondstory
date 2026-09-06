import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  scrollProgressRef,
  mouseRef,
  smoothstep,
  mapRange,
  lerp,
} from '@/three/scrollState';

// Scroll-driven camera that travels through the experience
export function ScrollCamera() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = scrollProgressRef.current;
    const smoothing = 1 - Math.pow(0.001, delta);

    // Camera journey through scenes
    if (p < 0.06) {
      // Hero — camera far back, looking at scene
      targetPos.current.set(0, 0, 12);
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.28) {
      // Bean enters and travels — camera follows
      targetPos.current.set(
        mapRange(p, 0.06, 0.28, 0, 2),
        mapRange(p, 0.06, 0.28, 0, 1),
        mapRange(p, 0.06, 0.28, 12, 9)
      );
      targetLook.current.set(
        mapRange(p, 0.06, 0.28, 0, 0),
        0,
        0
      );
    } else if (p < 0.40) {
      // Roasting — camera pushes in slightly, warmth
      targetPos.current.set(
        mapRange(p, 0.28, 0.40, 2, 0),
        mapRange(p, 0.28, 0.40, 1, 0.5),
        mapRange(p, 0.28, 0.40, 9, 7)
      );
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.52) {
      // Grinding — camera dynamic, closer
      targetPos.current.set(
        Math.sin((p - 0.40) * 15) * 1.5,
        mapRange(p, 0.40, 0.52, 0.5, 0),
        mapRange(p, 0.40, 0.52, 7, 5)
      );
      targetLook.current.set(0, 0, 3);
    } else if (p < 0.66) {
      // Brewing — camera immersed, fluid
      targetPos.current.set(
        Math.sin((p - 0.52) * 8) * 1,
        mapRange(p, 0.52, 0.66, 0, -0.5),
        mapRange(p, 0.52, 0.66, 5, 6)
      );
      targetLook.current.set(0, 0, 2);
    } else if (p < 0.76) {
      // Pouring — camera settles
      targetPos.current.set(
        mapRange(p, 0.66, 0.76, 0, 0),
        mapRange(p, 0.66, 0.76, -0.5, 0),
        mapRange(p, 0.66, 0.76, 6, 7)
      );
      targetLook.current.set(0, 0, 4);
    } else {
      // Final cup — camera slowly pulls back
      targetPos.current.set(
        0,
        mapRange(p, 0.76, 0.84, 0, 0.5),
        mapRange(p, 0.76, 0.84, 7, 8)
      );
      targetLook.current.set(0, 0.5, 4);
    }

    // Mouse parallax on camera
    const mx = mouseRef.x * 0.5;
    const my = mouseRef.y * 0.3;

    camera.position.x = lerp(camera.position.x, targetPos.current.x + mx, smoothing);
    camera.position.y = lerp(camera.position.y, targetPos.current.y + my, smoothing);
    camera.position.z = lerp(camera.position.z, targetPos.current.z, smoothing);

    camera.lookAt(
      lerp(0, targetLook.current.x, smoothing),
      lerp(0, targetLook.current.y, smoothing),
      lerp(0, targetLook.current.z, smoothing)
    );
  });

  return null;
}

// Scroll-driven lighting system
export function SceneLighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const warmRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = scrollProgressRef.current;

    if (ambientRef.current) {
      // Ambient dims during roasting, brightens at final cup
      const intensity =
        0.3 +
        smoothstep(0.72, 0.84, p) * 0.3 -
        smoothstep(0.24, 0.36, p) * smoothstep(0.42, 0.34, p) * 0.15;
      ambientRef.current.intensity = intensity;
    }

    if (keyRef.current) {
      // Key light stays consistent
      keyRef.current.intensity = 0.4;
    }

    if (warmRef.current) {
      // Warm orange light during roasting
      const roastIntensity = smoothstep(0.24, 0.34, p) * smoothstep(0.42, 0.36, p);
      warmRef.current.intensity = roastIntensity * 3;
      // Color shifts from orange to amber
      const r = lerp(0.85, 0.78, roastIntensity);
      const g = lerp(0.38, 0.63, roastIntensity);
      const b = lerp(0.16, 0.29, roastIntensity);
      warmRef.current.color.setRGB(r, g, b);
    }

    if (rimRef.current) {
      // Rim light for brewing and final
      const brewIntensity = smoothstep(0.48, 0.58, p) * 0.5;
      const cupIntensity = smoothstep(0.72, 0.82, p) * 0.8;
      rimRef.current.intensity = brewIntensity + cupIntensity;
      rimRef.current.color.setRGB(0.78, 0.63, 0.31);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.3} color="#f5ebe0" />
      <directionalLight
        ref={keyRef}
        position={[5, 5, 5]}
        intensity={0.4}
        color="#faf6f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        ref={warmRef}
        position={[0, 0, 3]}
        intensity={0}
        color="#d4632a"
        distance={15}
      />
      <pointLight
        ref={rimRef}
        position={[-3, 2, 4]}
        intensity={0}
        color="#c9a04e"
        distance={12}
      />
      {/* Brewing blue-ish fill */}
      <pointLight
        position={[3, -2, 3]}
        intensity={0}
        color="#4a6fa5"
        distance={10}
        ref={(light) => {
          if (light) {
            const update = () => {
              const p = scrollProgressRef.current;
              light.intensity = smoothstep(0.48, 0.56, p) * smoothstep(0.66, 0.58, p) * 1.5;
            };
            update();
          }
        }}
      />
    </>
  );
}

// Background color gradient based on scroll phase
export function SceneBackground() {
  const { scene } = useThree();
  const colorRef = useRef(new THREE.Color('#0d0805'));

  useFrame(() => {
    const p = scrollProgressRef.current;
    const target = colorRef.current;

    if (p < 0.06) {
      target.setRGB(0.05, 0.03, 0.02);
    } else if (p < 0.24) {
      // Dark journey
      target.setRGB(0.05, 0.03, 0.02);
    } else if (p < 0.40) {
      // Roasting — warm dark
      const t = smoothstep(0.24, 0.40, p);
      target.setRGB(0.05 + t * 0.08, 0.03 + t * 0.02, 0.02);
    } else if (p < 0.52) {
      // Grinding — dark textured
      const t = smoothstep(0.40, 0.52, p);
      target.setRGB(0.13 - t * 0.08, 0.05 - t * 0.02, 0.02);
    } else if (p < 0.66) {
      // Brewing — warm brown
      const t = smoothstep(0.52, 0.66, p);
      target.setRGB(0.05 + t * 0.03, 0.03 + t * 0.02, 0.02 + t * 0.01);
    } else if (p < 0.76) {
      // Pouring — warm
      target.setRGB(0.08, 0.05, 0.03);
    } else {
      // Final cup — calm warm dark
      const t = smoothstep(0.76, 0.84, p);
      target.setRGB(0.08 - t * 0.03, 0.05 - t * 0.02, 0.03 - t * 0.01);
    }

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(target, 0.05);
    } else {
      scene.background = target.clone();
    }
  });

  return null;
}
