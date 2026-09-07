import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { scrollProgressRef, mapRange, smoothstep } from '@/three/scrollState';

const MODEL_PATH = '/models/hero-coffee-bean.glb';
useGLTF.preload(MODEL_PATH);

export function BeanModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetRotation = useMemo(() => new THREE.Euler(), []);

  const { cloned, offset, scale } = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = Array.isArray(child.material) ? child.material.map((m) => m.clone()) : child.material.clone();
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const modelScale = 1 / Math.max(size.x, size.y, size.z, 0.001);
    return {
      cloned: c,
      offset: new THREE.Vector3(-center.x * modelScale, -center.y * modelScale, -center.z * modelScale),
      scale: modelScale,
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = scrollProgressRef.current;
    let targetScale = 0.42;
    let visibility = 0;

    if (p < 0.04) {
      targetPosition.set(-5.4, 0.15, 1);
      targetRotation.set(0, 0, 0);
      targetScale = 0.34;
    } else if (p < 0.28) {
      targetPosition.set(mapRange(p, 0.04, 0.28, -5.4, 1.7), mapRange(p, 0.04, 0.28, 0.15, 0.42), mapRange(p, 0.04, 0.28, 1, 2.65));
      targetRotation.set(0.12, mapRange(p, 0.04, 0.28, -0.45, 1.0), 0.08);
      targetScale = mapRange(p, 0.04, 0.16, 0.34, 0.46);
      visibility = smoothstep(0.04, 0.07, p);
    } else if (p < 0.355) {
      // Follow the grinder after its composition was moved to the right safe zone.
      targetPosition.set(mapRange(p, 0.28, 0.355, 1.7, 1.85), mapRange(p, 0.28, 0.355, 0.42, 1.02), mapRange(p, 0.28, 0.355, 2.65, 3.05));
      targetRotation.set(0.2, mapRange(p, 0.28, 0.355, 1.0, 1.55), 0);
      targetScale = mapRange(p, 0.28, 0.355, 0.46, 0.34);
      visibility = 1;
    } else if (p < 0.395) {
      targetPosition.set(1.85, mapRange(p, 0.355, 0.395, 1.02, 0.86), 3.05);
      targetRotation.set(0.28, mapRange(p, 0.355, 0.395, 1.55, 2.0), 0);
      targetScale = mapRange(p, 0.355, 0.395, 0.34, 0.02);
      visibility = 1 - smoothstep(0.372, 0.395, p);
    } else {
      targetPosition.set(1.85, 0.86, 3.05);
      targetRotation.set(0.28, 2.0, 0);
      targetScale = 0.001;
      visibility = 0;
    }

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(targetPosition, smoothing);
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, smoothing));
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotation.x, smoothing);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation.y, smoothing);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotation.z, smoothing);
    group.current.visible = visibility > 0.01;

    if (group.current.visible) {
      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            material.opacity = visibility;
            material.transparent = visibility < 0.999;
            material.depthWrite = visibility > 0.15;
          });
        }
      });
    }
  });

  return <group ref={group} visible={false} scale={0.3}><group scale={scale} position={offset}><primitive object={cloned} /></group></group>;
}