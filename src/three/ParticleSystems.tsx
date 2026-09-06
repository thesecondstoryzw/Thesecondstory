import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollProgressRef, smoothstep, mapRange, lerp } from '@/three/scrollState';

interface ParticleSystemProps {
  count?: number;
}

// Atmospheric dust particles — visible throughout
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
    const p = scrollProgressRef.current;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.15 + smoothstep(0.04, 0.12, p) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#c9a04e"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Roasting smoke/heat particles
export function RoastingParticles({ count = 100 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      v[i * 3] = (Math.random() - 0.5) * 0.02;
      v[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return v;
  }, [count]);

  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 4 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return { positions };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = smoothstep(0.24, 0.34, p) * smoothstep(0.42, 0.36, p) * 0.4;

    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta * 30;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 30;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 30;
      if (arr[i * 3 + 1] > 4) {
        arr[i * 3] = (Math.random() - 0.5) * 6;
        arr[i * 3 + 1] = -2;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#d4632a"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Grinding fragments — particles bursting outward
export function GrindingParticles({ count = 80 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 3;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.04 + 0.01;
      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = Math.sin(angle) * speed + 0.02;
      velocities[i * 3 + 2] = Math.random() * 0.02;
    }
    return { positions, velocities };
  }, [count]);

  const seed = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current;
    const mat = ref.current.material as THREE.PointsMaterial;

    const intensity = smoothstep(0.42, 0.50, p) * smoothstep(0.56, 0.48, p);
    mat.opacity = intensity * 0.6;

    if (intensity > 0.01) {
      seed.current += delta;
      const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3] += velocities[i * 3] * delta * 60;
        arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60 - 0.01 * delta * 30;
        arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 30;
      }
      posAttr.needsUpdate = true;
    } else if (intensity < 0.05) {
      // Reset particles
      const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        arr[i * 3] = 0;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = 3;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#3b2417"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Brewing — swirling liquid particles
export function BrewingParticles({ count = 120 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const { positions, angles, radii } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const angles = new Float32Array(count);
    const radii = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = Math.random() * 2 + 0.5;
      positions[i * 3] = Math.cos(angles[i]) * radii[i];
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i] * 0.5 + 2;
    }
    return { positions, angles, radii };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = smoothstep(0.48, 0.56, p) * smoothstep(0.70, 0.62, p) * 0.5;

    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      angles[i] += delta * 0.5;
      arr[i * 3] = Math.cos(angles[i]) * radii[i];
      arr[i * 3 + 2] = Math.sin(angles[i]) * radii[i] * 0.5 + 2;
      arr[i * 3 + 1] += Math.sin(delta + i) * 0.005;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c8794a"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Final cup steam
export function SteamParticles({ count = 60 }: ParticleSystemProps) {
  const ref = useRef<THREE.Points>(null);
  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      v[i * 3] = (Math.random() - 0.5) * 0.005;
      v[i * 3 + 1] = Math.random() * 0.02 + 0.008;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return v;
  }, [count]);

  const { positions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.8;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = 4;
    }
    return { positions };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = scrollProgressRef.current;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = smoothstep(0.72, 0.80, p) * 0.3;

    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta * 60;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
      if (arr[i * 3 + 1] > 5) {
        arr[i * 3] = (Math.random() - 0.5) * 0.8;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = 4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#f5ebe0"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
