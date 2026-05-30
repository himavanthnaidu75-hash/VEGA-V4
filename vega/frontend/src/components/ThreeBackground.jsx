import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Icosahedron, TorusKnot } from '@react-three/drei';

function MovingShapes() {
  const mesh1 = useRef();
  const mesh2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh1.current.rotation.x = t * 0.1;
    mesh1.current.rotation.y = t * 0.15;
    mesh2.current.rotation.z = t * 0.2;
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Icosahedron ref={mesh1} args={[1, 0]} position={[-3, 2, -5]}>
          <meshStandardMaterial color="#F5C518" wireframe />
        </Icosahedron>
      </Float>
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
        <TorusKnot ref={mesh2} args={[1, 0.3, 100, 16]} position={[4, -2, -8]}>
          <meshStandardMaterial color="#F5C518" wireframe />
        </TorusKnot>
      </Float>
    </>
  );
}

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-ink">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <MovingShapes />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
