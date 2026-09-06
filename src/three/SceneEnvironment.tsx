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

export function ScrollCamera() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = scrollProgressRef.current;
    const smoothing = 1 - Math.pow(0.001, delta);

    if (p < 0.06) {
      targetPos.current.set(0, 0, 12);
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.28) {
      targetPos.current.set(
        mapRange(p, 0.06, 0.28, 0, 2),
        mapRange(p, 0.06, 0.28, 0, 1),
        mapRange(p, 0.06, 0.28, 12, 9)
      );
      targetLook.current.set(0, 0, 0);
    } else if (p < 0.40) {
      targetPos.current.set(
        mapRange(p, 0.28, 0.40, 2, 0.35),
        mapRange(p, 0.28, 0.40, 1, 0.9),
        mapRange(p, 0.28, 0.40, 9, 7)
      );
      targetLook.current.set(0, 0.35, 3);
    } else if (p < 0.52) {
      // Grinder close-up: orbit slightly as the bean enters, then push in.
      const t = smoothstep(0.40, 0.52, p);
      targetPos.current.set(
        Math.sin(t * Math.PI * 0.9) * 1.15,
        mapRange(p, 0.40, 0.52, 0.9, 0.1),
        mapRange(p, 0.40, 0.52, 7, 5.2)
      );
      targetLook.current.set(0, mapRange(p, 0.40, 0.52, 0.7, -0.15), 3);
    } else if (p < 0.66) {
      targetPos.current.set(
        Math.sin((p - 0.52) * 8) * 1,
        mapRange(p, 0.52, 0.66, 0, -0.5),
        mapRange(p, 0.52, 0.66, 5.2, 6)
      );
      targetLook.current.set(0, -0.2, 2);
    } else if (p < 0.76) {
      targetPos.current.set(
        0,
        mapRange(p, 0.66, 0.76, -0.5, 0),
        mapRange(p, 0.66, 0.76, 6, 7)
      );
      targetLook.current.set(0, 0, 4);
    } else {
      targetPos.current.set(
        0,
        mapRange(p, 0.76, 0.84, 0, 0.5),
        mapRange(p, 0.76, 0.84, 7, 8)
      );
      targetLook.current.set(0, 0.5, 4);
    }

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

export function SceneLighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const warmRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const p = scrollProgressRef.current;

    const roastIntensity =
      smoothstep(0.24, 0.34, p) *
      (1 - smoothstep(0.36, 0.42, p));
    const grindIntensity =
      smoothstep(0.42, 0.47, p) *
      (1 - smoothstep(0.53, 0.59, p));

    if (ambientRef.current) {
      ambientRef.current.intensity =
        0.3 +
        smoothstep(0.72, 0.84, p) * 0.3 -
        roastIntensity * 0.12 -
        grindIntensity * 0.08;
    }

    if (keyRef.current) {
      keyRef.current.intensity = 0.4 + grindIntensity * 0.18;
    }

    if (warmRef.current) {
      warmRef.current.intensity = roastIntensity * 3 + grindIntensity * 2.2;
      warmRef.current.position.set(0.6, 0.5, 4.5);
      warmRef.current.color.set(
        grindIntensity > roastIntensity ? '#c8794a' : '#d4632a'
      );
    }

    if (rimRef.current) {
      const brewIntensity =
        smoothstep(0.48, 0.58, p) *
        (1 - smoothstep(0.58, 0.70, p)) *
        0.5;
      const cupIntensity = smoothstep(0.72, 0.82, p) * 0.8;
      rimRef.current.intensity = brewIntensity + cupIntensity + grindIntensity * 0.45;
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
    </>
  );
}

export function SceneBackground() {
  const { scene } = useThree();
  const colorRef = useRef(new THREE.Color('#0d0805'));

  useFrame(() => {
    const p = scrollProgressRef.current;
    const target = colorRef.current;

    if (p < 0.06) {
      target.setRGB(0.05, 0.03, 0.02);
    } else if (p < 0.24) {
      target.setRGB(0.05, 0.03, 0.02);
    } else if (p < 0.40) {
      const t = smoothstep(0.24, 0.40, p);
      target.setRGB(0.05 + t * 0.08, 0.03 + t * 0.02, 0.02);
    } else if (p < 0.52) {
      const t = smoothstep(0.40, 0.52, p);
      target.setRGB(0.13 - t * 0.08, 0.05 - t * 0.02, 0.02);
    } else if (p < 0.66) {
      const t = smoothstep(0.52, 0.66, p);
      target.setRGB(0.05 + t * 0.03, 0.03 + t * 0.02, 0.02 + t * 0.01);
    } else if (p < 0.76) {
      target.setRGB(0.08, 0.05, 0.03);
    } else {
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
