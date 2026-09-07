import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { clamp, lerp, sceneProgressRef, smoothstep } from '@/three/scrollState';

const MODEL_PATH = '/models/cup.glb';
const HANDLE_LEFT_ROTATION = Math.PI / 2;
useGLTF.preload(MODEL_PATH);

export function CupModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };

  const { cloned, offset, scale, coffeeY } = useMemo(() => {
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
    const targetHeight = 1.62;
    const modelScale = targetHeight / Math.max(size.y, 0.001);

    return {
      cloned: copy,
      offset: new THREE.Vector3(-center.x * modelScale, -box.min.y * modelScale, -center.z * modelScale),
      scale: modelScale,
      // Keep the liquid just inside the rim, not at saucer height.
      coffeeY: targetHeight * 0.955,
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = sceneProgressRef.current;
    const visibility = clamp(smoothstep(0.74, 0.81, p), 0, 1);
    const settle = smoothstep(0.80, 0.92, p);
    const target = new THREE.Vector3(
      lerp(0.32, 0, settle),
      -0.82 + Math.sin(state.clock.elapsedTime * 1.1) * 0.006 * settle,
      lerp(3.35, 3.1, settle)
    );

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    // Tiny presentation tilt exposes the drink while keeping the cup believable.
    group.current.rotation.x = lerp(group.current.rotation.x, -0.085, smoothing);
    group.current.rotation.y = lerp(group.current.rotation.y, HANDLE_LEFT_ROTATION + lerp(-0.03, 0.015, settle), smoothing);
    group.current.rotation.z = lerp(group.current.rotation.z, Math.sin(state.clock.elapsedTime * 0.6) * 0.005 * settle, smoothing);
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
      <group scale={scale} position={offset}><primitive object={cloned} /></group>

      {/* Keep the coffee inside the cup.  Do not derive its radius from the whole model,
          because this asset's bounds include the saucer and handle, which previously
          created the oversized black oval around the cup. */}
      <group position={[0, coffeeY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <circleGeometry args={[0.43, 64]} />
          <meshPhysicalMaterial
            color="#6f3217"
            roughness={0.26}
            metalness={0}
            clearcoat={0.18}
            clearcoatRoughness={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <circleGeometry args={[0.30, 64]} />
          <meshStandardMaterial color="#b56a2d" roughness={0.38} transparent opacity={0.42} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <pointLight position={[-1.2, 1.8, 2.2]} color="#f4d5aa" intensity={1.45} distance={6} decay={2} />
      <pointLight position={[1.3, 0.8, 1.4]} color="#c8794a" intensity={0.75} distance={4} decay={2} />
    </group>
  );
}