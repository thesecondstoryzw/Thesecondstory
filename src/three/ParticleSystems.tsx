import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProgressRef, smoothstep } from '@/three/scrollState';

interface ParticleSystemProps { count?: number; }

export function AtmosphereParticles({ count = 200 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      sizes[i] = Math.random() * 0.05 + 0.01;
    }
    return { positions, sizes };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.15 + smoothstep(0.04, 0.12, scrollProgressRef.current) * 0.1;
  });

  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /><bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} /></bufferGeometry><pointsMaterial size={0.05} color="#c9a04e" transparent opacity={0.15} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}

export function RoastingParticles({ count = 100 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { v[i * 3] = (Math.random() - 0.5) * 0.02; v[i * 3 + 1] = Math.random() * 0.03 + 0.01; v[i * 3 + 2] = (Math.random() - 0.5) * 0.02; }
    return v;
  }, [count]);
  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { positions[i * 3] = (Math.random() - 0.5) * 6; positions[i * 3 + 1] = Math.random() * 4 - 2; positions[i * 3 + 2] = (Math.random() - 0.5) * 4; }
    return { positions };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current;
    (ref.current.material as THREE.PointsMaterial).opacity = smoothstep(0.24, 0.34, p) * (1 - smoothstep(0.36, 0.42, p)) * 0.4;
    const arr = (ref.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta * 30; arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 30; arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 30;
      if (arr[i * 3 + 1] > 4) { arr[i * 3] = (Math.random() - 0.5) * 6; arr[i * 3 + 1] = -2; arr[i * 3 + 2] = (Math.random() - 0.5) * 4; }
    }
    (ref.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial size={0.15} color="#d4632a" transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}

export function GrindingParticles({ count = 120 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const outlet = useMemo(() => new THREE.Vector3(1.85, -0.25, 3.9), []);
  const { positions, velocities, drift } = useMemo(() => {
    const positions = new Float32Array(count * 3); const velocities = new Float32Array(count * 3); const drift = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = outlet.x + (Math.random() - 0.5) * 0.12; positions[i * 3 + 1] = outlet.y; positions[i * 3 + 2] = outlet.z + (Math.random() - 0.5) * 0.12;
      velocities[i * 3] = (Math.random() - 0.5) * 0.04; velocities[i * 3 + 1] = -(Math.random() * 0.055 + 0.025); velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.025; drift[i] = Math.random() * Math.PI * 2;
    }
    return { positions, velocities, drift };
  }, [count, outlet]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current; const intensity = smoothstep(0.46, 0.49, p) * (1 - smoothstep(0.54, 0.585, p));
    (ref.current.material as THREE.PointsMaterial).opacity = intensity * 0.72;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute; const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      if (intensity > 0.01) {
        arr[i * 3] += (velocities[i * 3] + Math.sin(state.clock.elapsedTime * 4 + drift[i]) * 0.004) * delta * 60; arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60; arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
        if (arr[i * 3 + 1] < -2.5 || Math.random() < delta * 0.08) { arr[i * 3] = outlet.x + (Math.random() - 0.5) * 0.12; arr[i * 3 + 1] = outlet.y; arr[i * 3 + 2] = outlet.z + (Math.random() - 0.5) * 0.12; }
      } else { arr[i * 3] = outlet.x + (Math.random() - 0.5) * 0.12; arr[i * 3 + 1] = outlet.y; arr[i * 3 + 2] = outlet.z + (Math.random() - 0.5) * 0.12; }
    }
    attr.needsUpdate = true;
  });

  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial size={0.05} color="#4b2815" transparent opacity={0} sizeAttenuation depthWrite={false} /></points>;
}

export function BrewingParticles({ count = 120 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const { positions, angles, radii } = useMemo(() => {
    const positions = new Float32Array(count * 3); const angles = new Float32Array(count); const radii = new Float32Array(count);
    for (let i = 0; i < count; i++) { angles[i] = Math.random() * Math.PI * 2; radii[i] = Math.random() * 1.5 + 0.4; positions[i * 3] = 1.75 + Math.cos(angles[i]) * radii[i]; positions[i * 3 + 1] = (Math.random() - 0.5) * 2; positions[i * 3 + 2] = 2.8 + Math.sin(angles[i]) * radii[i] * 0.4; }
    return { positions, angles, radii };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current; (ref.current.material as THREE.PointsMaterial).opacity = smoothstep(0.58, 0.64, p) * (1 - smoothstep(0.68, 0.72, p)) * 0.45;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute; const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) { angles[i] += delta * 0.5; arr[i * 3] = 1.75 + Math.cos(angles[i]) * radii[i]; arr[i * 3 + 2] = 2.8 + Math.sin(angles[i]) * radii[i] * 0.4; arr[i * 3 + 1] += Math.sin(delta + i) * 0.005; }
    attr.needsUpdate = true;
  });

  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial size={0.055} color="#c8794a" transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}

export function SteamParticles({ count = 60 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  // Matches the final cup's calibrated world-space rim after the cup settles.
  const origin = useMemo(() => new THREE.Vector3(0, 0.72, 3.1), []);
  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { v[i * 3] = (Math.random() - 0.5) * 0.004; v[i * 3 + 1] = Math.random() * 0.018 + 0.009; v[i * 3 + 2] = (Math.random() - 0.5) * 0.004; }
    return v;
  }, [count]);
  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { positions[i * 3] = origin.x + (Math.random() - 0.5) * 0.18; positions[i * 3 + 1] = origin.y + Math.random() * 0.55; positions[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.14; }
    return { positions };
  }, [count, origin]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current; (ref.current.material as THREE.PointsMaterial).opacity = smoothstep(0.78, 0.85, p) * 0.42;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute; const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta * 60; arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60; arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
      if (arr[i * 3 + 1] > 2.5) { arr[i * 3] = origin.x + (Math.random() - 0.5) * 0.18; arr[i * 3 + 1] = origin.y; arr[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.14; }
    }
    attr.needsUpdate = true;
  });

  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} /></bufferGeometry><pointsMaterial size={0.11} color="#f5ebe0" transparent opacity={0} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}