import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, Icosahedron, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Institutional Three.js Background Engine
 * High-performance cinematic atmosphere with drifting stars,
 * rotating wireframe meshes, and smooth mouse parallax.
 */

const FloatingScene = ({ intensity = 0.5 }) => {
  const meshRef1 = useRef();
  const meshRef2 = useRef();
  const { mouse } = useThree();

  // Custom parallax drift logic
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.08;
      meshRef1.current.rotation.y = time * 0.12;
      // Parallax with lerping
      meshRef1.current.position.x = THREE.MathUtils.lerp(meshRef1.current.position.x, mouse.x * 2.5, 0.03);
      meshRef1.current.position.y = THREE.MathUtils.lerp(meshRef1.current.position.y, mouse.y * 2.5, 0.03);
    }

    if (meshRef2.current) {
      meshRef2.current.rotation.x = -time * 0.04;
      meshRef2.current.rotation.z = time * 0.06;
      // Counter-parallax
      meshRef2.current.position.x = THREE.MathUtils.lerp(meshRef2.current.position.x, mouse.x * -1.8, 0.02);
      meshRef2.current.position.y = THREE.MathUtils.lerp(meshRef2.current.position.y, mouse.y * -1.8, 0.02);
    }
  });

  const accentColor = useMemo(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#F5C518';
  }, []);

  return (
    <>
      <ambientLight intensity={0.15 * intensity} />
      <pointLight position={[10, 10, 10]} intensity={intensity} color={accentColor} />
      <pointLight position={[-10, -10, -10]} intensity={intensity * 0.5} />

      {/* 2000 Star Particle System */}
      <Stars
        radius={100}
        depth={60}
        count={2000}
        factor={5}
        saturation={0}
        fade
        speed={1.5}
      />

      {/* Floating Institutional Meshes */}
      <Float speed={1.2} rotationIntensity={intensity * 2} floatIntensity={intensity * 2}>
        <mesh ref={meshRef1} position={[6, 3, -8]}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color={accentColor}
            wireframe
            transparent
            opacity={0.15 * intensity}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={intensity * 1.5} floatIntensity={intensity * 3}>
        <mesh ref={meshRef2} position={[-8, -4, -12]}>
          <torusKnotGeometry args={[2.5, 0.6, 128, 16]} />
          <meshStandardMaterial
            color={accentColor}
            wireframe
            transparent
            opacity={0.1 * intensity}
          />
        </mesh>
      </Float>
    </>
  );
};

const ThreeBackground = () => {
  const intensity = parseFloat(localStorage.getItem('vega_bg_intensity') || '0.5');
  const bgType = localStorage.getItem('vega_bg_type') || 'Deep Space';

  if (bgType === 'Off') return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#111318] transition-colors duration-1000">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <FloatingScene intensity={intensity} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
