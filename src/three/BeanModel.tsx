import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { scrollProgressRef, mouseRef, mapRange, smoothstep } from '@/three/scrollState';

const MODEL_PATH = '/models/hero-coffee-bean.glb';

useGLTF.preload(MODEL_PATH);

export function BeanModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetRotation = useMemo(() => new THREE.Euler(), []);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = Array.isArray(child.material)
          ? child.material.map((material) => material.clone())
          : child.material.clone();
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          if ('envMapIntensity' in material) material.envMapIntensity = 0.8;
          material.needsUpdate = true;
        });
      }
    });
    return c;
  }, [scene]);

  useFrame((_, delta) => {
    if (!group.current) return;

    const p = scrollProgressRef.current;
    let targetScale = 0.5;
    let visibility = 0;

    if (p < 0.04) {
      targetPosition.set(-5.4, 0.15, 1);
      targetRotation.set(0, 0, 0);
      targetScale = 0.38;
    } else if (p < 0.28) {
      targetPosition.set(
        mapRange(p, 0.04, 0.28, -5.4, 2.1),
        mapRange(p, 0.04, 0.28, 0.15, 0.35),
        mapRange(p, 0.04, 0.28, 1, 2.1)
      );
      targetRotation.set(0.12, mapRange(p, 0.04, 0.28, -0.45, 1.1), 0.08);
      targetScale = mapRange(p, 0.04, 0.16, 0.38, 0.5);
      visibility = smoothstep(0.04, 0.08, p);
    } else if (p < 0.40) {
      targetPosition.set(
        mapRange(p, 0.28, 0.40, 2.1, 0.4),
        mapRange(p, 0.28, 0.40, 0.35, 1.15),
        mapRange(p, 0.28, 0.40, 2.1, 3)
      );
      targetRotation.set(0.2, mapRange(p, 0.28, 0.40, 1.1, 1.65), 0);
      targetScale = 0.5;
      visibility = 1;
    } else if (p < 0.52) {
      // These targets align with the grinder's base-origin bounds and hopper.
      targetPosition.set(
        mapRange(p, 0.40, 0.52, 0.4, 0),
        mapRange(p, 0.40, 0.52, 1.15, 1.42),
        mapRange(p, 0.40, 0.52, 3, 3.25)
      );
      targetRotation.set(0.28, mapRange(p, 0.40, 0.52, 1.65, 2.05), 0);
      targetScale = mapRange(p, 0.40, 0.52, 0.5, 0.14);
      visibility = 1 - smoothstep(0.49, 0.52, p);
    } else {
      targetPosition.set(0, 1.42, 3.25);
      targetRotation.set(0.28, 2.05, 0);
      targetScale = 0.14;
    }

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(targetPosition, smoothing);
    group.current.scale.setScalar(
      THREE.MathUtils.lerp(group.current.scale.x, targetScale, smoothing)
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotation.x,
      smoothing
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation.y + mouseRef.x * 0.025,
      smoothing
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetRotation.z + mouseRef.y * 0.015,
      smoothing
    );

    group.current.visible = visibility > 0.01;
    if (group.current.visible) {
      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((material) => {
            material.opacity = visibility;
            material.transparent = visibility < 0.999;
          });
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
