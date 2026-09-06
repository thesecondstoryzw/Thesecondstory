import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { scrollProgressRef, mouseRef, mapRange, smoothstep, lerp } from '@/three/scrollState';

const MODEL_PATH = '/models/hero-coffee-bean.glb';

useGLTF.preload(MODEL_PATH);

export function BeanModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };
  const { viewport } = useThree();

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.envMapIntensity = 0.8;
          mat.needsUpdate = true;
        }
      }
    });
    return c;
  }, [scene]);

  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetPosition = useRef({ x: 0, y: 0, z: 0 });
  const targetScale = useRef(1);
  const visibility = useRef(1);
  const currentRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    return () => useGLTF.clear(MODEL_PATH);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;

    const p = scrollProgressRef.current;
    const vw = viewport.width;
    const vh = viewport.height;

    if (p < 0.04) {
      visibility.current = 0;
      targetPosition.current = { x: -vw * 0.8, y: 0, z: 0 };
      targetScale.current = 0.4;
    } else if (p < 0.16) {
      visibility.current = smoothstep(0.04, 0.08, p);
      targetPosition.current = {
        x: mapRange(p, 0.04, 0.16, -vw * 0.8, -vw * 0.35),
        y: mapRange(p, 0.04, 0.16, 0, vh * 0.1),
        z: 0,
      };
      targetScale.current = mapRange(p, 0.04, 0.16, 0.3, 0.5);
      targetRotation.current = {
        x: 0,
        y: mapRange(p, 0.04, 0.16, 0, Math.PI * 0.5),
        z: 0,
      };
    } else if (p < 0.28) {
      visibility.current = 1;
      targetPosition.current = {
        x: mapRange(p, 0.16, 0.28, -vw * 0.35, vw * 0.35),
        y: vh * 0.1 + Math.sin((p - 0.16) * 20) * vh * 0.05,
        z: mapRange(p, 0.16, 0.28, 0, 2),
      };
      targetScale.current = 0.5;
      targetRotation.current = {
        x: (p - 0.16) * 3,
        y: mapRange(p, 0.16, 0.28, Math.PI * 0.5, Math.PI * 1.5),
        z: Math.sin((p - 0.16) * 10) * 0.2,
      };
    } else if (p < 0.40) {
      visibility.current = 1;
      targetPosition.current = {
        x: mapRange(p, 0.28, 0.40, vw * 0.35, 0),
        y: mapRange(p, 0.28, 0.40, vh * 0.1, 0.5),
        z: mapRange(p, 0.28, 0.40, 2, 3.5),
      };
      targetScale.current = mapRange(p, 0.28, 0.40, 0.5, 0.68);
      targetRotation.current = {
        x: (p - 0.28) * 5,
        y: mapRange(p, 0.28, 0.40, Math.PI * 1.5, Math.PI * 2.5),
        z: 0,
      };
    } else if (p < 0.52) {
      // The bean is now our character entering the grinder hopper.
      visibility.current = 1 - smoothstep(0.49, 0.52, p);
      targetPosition.current = {
        x: mapRange(p, 0.40, 0.52, 0, 0.02),
        y: mapRange(p, 0.40, 0.52, 0.5, 0.92),
        z: mapRange(p, 0.40, 0.52, 3.5, 3.25),
      };
      targetScale.current = mapRange(p, 0.40, 0.52, 0.68, 0.12);
      targetRotation.current = {
        x: (p - 0.40) * 12,
        y: (p - 0.40) * 9,
        z: (p - 0.40) * 5,
      };
    } else {
      visibility.current = 0;
      targetPosition.current = { x: 0, y: 0.9, z: 3.25 };
      targetScale.current = 0.1;
    }

    const mx = mouseRef.x * 0.3;
    const my = mouseRef.y * 0.2;
    const smoothing = 1 - Math.pow(0.001, delta);

    currentRotation.current.x = lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      smoothing
    );

    group.current.position.x = lerp(
      group.current.position.x,
      targetPosition.current.x + mx,
      smoothing
    );
    group.current.position.y = lerp(
      group.current.position.y,
      targetPosition.current.y + my,
      smoothing
    );
    group.current.position.z = lerp(
      group.current.position.z,
      targetPosition.current.z,
      smoothing
    );

    const s = lerp(group.current.scale.x, targetScale.current, smoothing);
    group.current.scale.setScalar(s);

    group.current.rotation.x = currentRotation.current.x;
    group.current.rotation.y = targetRotation.current.y + mx * 0.3;
    group.current.rotation.z = targetRotation.current.z;

    group.current.visible = visibility.current > 0.01;
    if (group.current.visible) {
      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.opacity = visibility.current;
          mat.transparent = visibility.current < 0.999;
        }
      });
    }
  });

  return (
    <group ref={group} visible={false} scale={0.3}>
      <primitive object={cloned} />
    </group>
  );
}
