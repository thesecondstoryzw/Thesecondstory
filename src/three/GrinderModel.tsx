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

  // Normalize the imported asset from its real bounds so it cannot suddenly
  // dominate the frame because of arbitrary GLB export units.
  const { cloned, offset, scale } = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = Array.isArray(child.material)
          ? child.material.map((material) => material.clone())
          : child.material.clone();
      }
    });

    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 2.15;
    const modelScale = targetHeight / Math.max(size.y, 0.001);

    return {
      cloned: copy,
      offset: new THREE.Vector3(
        -center.x * modelScale,
        -box.min.y * modelScale,
        -center.z * modelScale
      ),
      scale: modelScale,
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const p = scrollProgressRef.current;
    const enter = smoothstep(0.30, 0.37, p);
    const leave = 1 - smoothstep(0.57, 0.64, p);
    const visibility = clamp(enter * leave, 0, 1);
    const active =
      smoothstep(0.42, 0.46, p) *
      (1 - smoothstep(0.53, 0.58, p));

    const vibration =
      active *
      (Math.sin(state.clock.elapsedTime * 52) * 0.007 +
        Math.sin(state.clock.elapsedTime * 23) * 0.004);

    const settle = smoothstep(0.32, 0.40, p);
    const target = new THREE.Vector3(
      vibration,
      -0.92 + vibration * 0.25,
      3.15
    );

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    group.current.rotation.y = lerp(
      group.current.rotation.y,
      lerp(-0.14, 0.08, settle),
      smoothing
    );
    group.current.rotation.z = lerp(
      group.current.rotation.z,
      Math.sin(state.clock.elapsedTime * 45) * active * 0.004,
      smoothing
    );
    group.current.visible = visibility > 0.01;

    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          material.transparent = visibility < 0.999;
          material.opacity = visibility;
        });
      }
    });
  });

  return (
    <group ref={group} visible={false}>
      <group scale={scale} position={offset}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}
