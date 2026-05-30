import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Icosahedron, TorusKnot, Sparkles } from '@react-three/drei';
import useVegaStore from '../store/useVegaStore';

function Aurora() {
  return (
    <Sparkles count={100} scale={20} size={10} speed={0.5} color="#00B37E" opacity={0.5} />
  );
}

function MovingShapes({ intensity = 1 }) {
  const mesh1 = useRef();
  const mesh2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh1.current) {
      mesh1.current.rotation.x = t * 0.1 * intensity;
      mesh1.current.rotation.y = t * 0.15 * intensity;
    }
    if (mesh2.current) {
      mesh2.current.rotation.z = t * 0.2 * intensity;
    }
  });

  return (
    <>
      <Float speed={2 * intensity} rotationIntensity={0.5} floatIntensity={1}>
        <Icosahedron ref={mesh1} args={[1, 0]} position={[-3, 2, -5]}>
          <meshStandardMaterial color="var(--color-secondary)" wireframe />
        </Icosahedron>
      </Float>
      <Float speed={1.5 * intensity} rotationIntensity={1} floatIntensity={0.5}>
        <TorusKnot ref={mesh2} args={[1, 0.3, 100, 16]} position={[4, -2, -8]}>
          <meshStandardMaterial color="var(--color-secondary)" wireframe />
        </TorusKnot>
      </Float>
    </>
  );
}

const ThreeBackground = () => {
  const theme = JSON.parse(localStorage.getItem('vega_theme_v2') || '{"background":"deepspace","intensity":1}');

  return (
    <div className="fixed inset-0 z-[-1]" style={{ backgroundColor: 'var(--color-ink)' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        {theme.background === 'aurora' && <Aurora />}
        <MovingShapes intensity={theme.intensity} />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
