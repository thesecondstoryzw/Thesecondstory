import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clamp, lerp, scrollProgressRef, smoothstep } from '@/three/scrollState';

const MODEL_PATH = '/models/espresso-machine.glb';

useGLTF.preload(MODEL_PATH);

export function EspressoMachineModel() {
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
    const targetHeight = 3.8;
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
    const enter = smoothstep(0.52, 0.59, p);
    const leave = 1 - smoothstep(0.72, 0.78, p);
    const visibility = clamp(enter * leave, 0, 1);
    const brewing = smoothstep(0.60, 0.64, p) * (1 - smoothstep(0.69, 0.73, p));

    const vibration =
      brewing *
      (Math.sin(state.clock.elapsedTime * 58) * 0.012 +
        Math.sin(state.clock.elapsedTime * 23) * 0.006);

    const target = new THREE.Vector3(
      lerp(0.8, -0.15, smoothstep(0.52, 0.68, p)) + vibration,
      -1.9 + vibration * 0.35,
      2.4
    );

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    group.current.rotation.y = lerp(
      group.current.rotation.y,
      lerp(-0.35, 0.18, smoothstep(0.56, 0.70, p)),
      smoothing
    );
    group.current.rotation.z = lerp(group.current.rotation.z, vibration * 0.35, smoothing);
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
      <pointLight
        position={[0.25, 1.4, 1.2]}
        color="#d79a58"
        intensity={1.6}
        distance={6}
        decay={2}
      />
    </group>
  );
}
