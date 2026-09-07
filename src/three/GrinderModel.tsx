import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clamp, lerp, scrollProgressRef, smoothstep } from '@/three/scrollState';

const MODEL_PATH = '/models/coffee-grinder.glb';
useGLTF.preload(MODEL_PATH);

export function GrinderModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };

  const { cloned, offset, scale } = useMemo(() => {
    const copy = scene.clone(true);

    // The source GLB uses the opposite vertical axis from our scene, which made
    // the grinder render upside down (feet above the body). Correct the asset
    // before measuring it so the normalization offset is calculated in the
    // final, upright orientation.
    copy.rotation.x = Math.PI;
    copy.updateMatrixWorld(true);

    copy.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = Array.isArray(child.material) ? child.material.map((m) => m.clone()) : child.material.clone();
      }
    });
    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Smaller calibrated height prevents the grinder from filling the whole viewport.
    const targetHeight = 1.55;
    const modelScale = targetHeight / Math.max(size.y, 0.001);
    return {
      cloned: copy,
      offset: new THREE.Vector3(-center.x * modelScale, -box.min.y * modelScale, -center.z * modelScale),
      scale: modelScale,
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = scrollProgressRef.current;
    const enter = smoothstep(0.30, 0.37, p);
    const leave = 1 - smoothstep(0.545, 0.585, p);
    const visibility = clamp(enter * leave, 0, 1);
    const active = smoothstep(0.42, 0.46, p) * (1 - smoothstep(0.53, 0.57, p));
    const vibration = active * (Math.sin(state.clock.elapsedTime * 52) * 0.006 + Math.sin(state.clock.elapsedTime * 23) * 0.003);

    const target = new THREE.Vector3(1.85 + vibration, -0.92 + vibration * 0.2, 3.05);
    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    group.current.rotation.y = lerp(group.current.rotation.y, 0.1, smoothing);
    group.current.rotation.z = lerp(group.current.rotation.z, Math.sin(state.clock.elapsedTime * 45) * active * 0.003, smoothing);
    group.current.visible = visibility > 0.01;

    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => { material.transparent = visibility < 0.999; material.opacity = visibility; });
      }
    });
  });

  return <group ref={group} visible={false}><group scale={scale} position={offset}><primitive object={cloned} /></group></group>;
}