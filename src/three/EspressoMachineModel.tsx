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
        child.material = Array.isArray(child.material) ? child.material.map((m) => m.clone()) : child.material.clone();
      }
    });
    const box = new THREE.Box3().setFromObject(copy);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const targetHeight = 1.72;
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
    // Do not overlap the outgoing grinder with the incoming espresso machine.
    const enter = smoothstep(0.575, 0.625, p);
    const leave = 1 - smoothstep(0.72, 0.77, p);
    const visibility = clamp(enter * leave, 0, 1);
    const brewing = smoothstep(0.63, 0.66, p) * (1 - smoothstep(0.70, 0.73, p));
    const vibration = brewing * (Math.sin(state.clock.elapsedTime * 45) * 0.004 + Math.sin(state.clock.elapsedTime * 21) * 0.002);

    const target = new THREE.Vector3(
      lerp(2.45, 1.75, smoothstep(0.60, 0.70, p)) + vibration,
      -0.9 + vibration * 0.2,
      3.2
    );

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    group.current.rotation.y = lerp(group.current.rotation.y, 0.16, smoothing);
    group.current.rotation.z = lerp(group.current.rotation.z, vibration * 0.15, smoothing);
    group.current.visible = visibility > 0.01;

    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => { material.transparent = visibility < 0.999; material.opacity = visibility; });
      }
    });
  });

  return (
    <group ref={group} visible={false}>
      {/* The uploaded asset's local up axis is inverted in the supplied GLB. Correct it once here. */}
      <group scale={scale} position={offset} rotation={[0, 0, Math.PI]}>
        <primitive object={cloned} />
      </group>
      <pointLight position={[0.3, 1.05, 1.3]} color="#d79a58" intensity={1.1} distance={5} decay={2} />
    </group>
  );
}