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

  const cloned = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
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
          if ('envMapIntensity' in material) material.envMapIntensity = 1.1;
          material.needsUpdate = true;
        });
      }
    });
    return copy;
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
      (Math.sin(state.clock.elapsedTime * 72) * 0.014 +
        Math.sin(state.clock.elapsedTime * 31) * 0.008);

    const settle = smoothstep(0.32, 0.40, p);
    const targetX = vibration;
    // The model's local bounds are X: -0.49..0.49, Y: 0..0.97 and
    // Z: -0.95..0.95. Its origin is at the base, so this keeps the full
    // silhouette in the grinder close-up rather than below the camera target.
    const targetY = -1.05 + vibration * 0.35;
    const targetZ = 3;
    const targetRotationY =
      lerp(-0.16, 0.1, settle) +
      Math.sin(state.clock.elapsedTime * 18) * active * 0.018;
    const targetRotationZ =
      Math.sin(state.clock.elapsedTime * 55) * active * 0.008;

    const smoothing = 1 - Math.pow(0.001, delta);

    group.current.position.x = lerp(group.current.position.x, targetX, smoothing);
    group.current.position.y = lerp(group.current.position.y, targetY, smoothing);
    group.current.position.z = lerp(group.current.position.z, targetZ, smoothing);
    group.current.rotation.y = lerp(
      group.current.rotation.y,
      targetRotationY,
      smoothing
    );
    group.current.rotation.z = lerp(
      group.current.rotation.z,
      targetRotationZ,
      smoothing
    );

    const scale = 2.6;
    group.current.scale.lerp(
      new THREE.Vector3(scale, scale, scale),
      smoothing
    );

    group.current.visible = visibility > 0.01;
    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          material.transparent = visibility < 0.999;
          material.opacity = visibility;
        });
      }
    });
  });

  return (
    <group ref={group} position={[0, -1.05, 3]} scale={2.6} visible={false}>
      <primitive object={cloned} />
      <pointLight
        position={[0, -0.25, 1.25]}
        color="#c8794a"
        intensity={0}
        distance={2.8}
        decay={2}
      />
    </group>
  );
}
