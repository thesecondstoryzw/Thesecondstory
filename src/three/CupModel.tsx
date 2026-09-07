import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clamp, lerp, scrollProgressRef, smoothstep } from '@/three/scrollState';

const MODEL_PATH = '/models/cup.glb';

/**
 * Final product shot:
 * - rotate the asset so its detailed face is presented
 * - keep the handle on the viewer's LEFT
 * - tilt enough to reveal the cappuccino surface
 */
const HANDLE_LEFT_ROTATION = Math.PI / 2;

useGLTF.preload(MODEL_PATH);

export function CupModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };

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
    const targetHeight = 1.62;
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
    const enter = smoothstep(0.74, 0.81, p);
    const visibility = clamp(enter, 0, 1);
    const settle = smoothstep(0.80, 0.92, p);

    const target = new THREE.Vector3(
      lerp(0.35, 0, settle),
      -1.05 + Math.sin(state.clock.elapsedTime * 1.1) * 0.01 * settle,
      lerp(3.65, 3.18, settle)
    );

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    group.current.rotation.x = lerp(group.current.rotation.x, -0.16, smoothing);
    group.current.rotation.y = lerp(
      group.current.rotation.y,
      HANDLE_LEFT_ROTATION + lerp(-0.02, 0.02, settle),
      smoothing
    );
    group.current.rotation.z = lerp(
      group.current.rotation.z,
      Math.sin(state.clock.elapsedTime * 0.6) * 0.008 * settle,
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
      <pointLight position={[-1.4, 1.9, 2.2]} color="#f4d5aa" intensity={1.7} distance={6} decay={2} />
      <pointLight position={[1.5, 0.7, 1.4]} color="#c8794a" intensity={0.9} distance={4} decay={2} />
    </group>
  );
}
