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

// The uploaded model is a cup + saucer, but its GLB does not reliably expose
// the drink surface from every material setup. A subtle procedural coffee layer
// guarantees the final hero shot always reads as a filled cappuccino.

useGLTF.preload(MODEL_PATH);

export function CupModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group };

  const { cloned, offset, scale, coffeeY, coffeeRadius } = useMemo(() => {
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

    // Overall bounds include the saucer. The cup rim sits near the top of the
    // normalized model, so place the liquid just below that rim.
    const normalizedWidth = size.x * modelScale;
    const normalizedDepth = size.z * modelScale;
    const rimDiameter = Math.min(normalizedWidth, normalizedDepth) * 0.62;

    return {
      cloned: copy,
      offset: new THREE.Vector3(
        -center.x * modelScale,
        -box.min.y * modelScale,
        -center.z * modelScale
      ),
      scale: modelScale,
      coffeeY: targetHeight * 0.945,
      coffeeRadius: Math.max(0.28, rimDiameter * 0.5),
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
      -0.98 + Math.sin(state.clock.elapsedTime * 1.1) * 0.008 * settle,
      lerp(3.55, 3.12, settle)
    );

    const smoothing = 1 - Math.pow(0.001, delta);
    group.current.position.lerp(target, smoothing);
    // Keep the cup almost upright. The camera, rather than an exaggerated cup
    // tilt, reveals the drink surface like a controlled commercial product shot.
    group.current.rotation.x = lerp(group.current.rotation.x, -0.035, smoothing);
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

      {/* Filled cappuccino surface: dark coffee body + warm crema centre. */}
      <group position={[0, coffeeY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <circleGeometry args={[coffeeRadius, 64]} />
          <meshStandardMaterial
            color="#2a1209"
            roughness={0.24}
            metalness={0.02}
            transparent
            opacity={0.98}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <circleGeometry args={[coffeeRadius * 0.72, 64]} />
          <meshStandardMaterial
            color="#8a4b1f"
            roughness={0.36}
            metalness={0}
            transparent
            opacity={0.82}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <pointLight position={[-1.4, 1.9, 2.2]} color="#f4d5aa" intensity={1.7} distance={6} decay={2} />
      <pointLight position={[1.5, 0.7, 1.4]} color="#c8794a" intensity={0.9} distance={4} decay={2} />
    </group>
  );
}
