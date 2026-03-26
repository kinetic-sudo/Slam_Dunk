import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type ActiveProduct = {
  id: string;
  name: string;
  price: string;
  themeColor: string;
  ballColor: string;
  seamColor: string;
};

export default function BasketballModel({ activeProduct }: { activeProduct: ActiveProduct }) {
  const groupRef = useRef<THREE.Group>(null);
  const ballMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const seamMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const spinVelocityRef = useRef(0);

  const targetBallColor = useRef(new THREE.Color(activeProduct.ballColor));
  const targetSeamColor = useRef(new THREE.Color(activeProduct.seamColor));

  useEffect(() => {
    targetBallColor.current = new THREE.Color(activeProduct.ballColor);
    targetSeamColor.current = new THREE.Color(activeProduct.seamColor);
    // Kick a fast spin
    spinVelocityRef.current = Math.PI * 6;
  }, [activeProduct]);

  useFrame((_, delta) => {
    if (ballMaterialRef.current) {
      ballMaterialRef.current.color.lerp(targetBallColor.current, 0.08);
    }
    if (seamMaterialRef.current) {
      seamMaterialRef.current.color.lerp(targetSeamColor.current, 0.08);
    }

    if (groupRef.current) {
      // Decay the spin velocity
      spinVelocityRef.current *= 0.92;
      const totalRotation = delta * 0.3 + spinVelocityRef.current * delta;
      groupRef.current.rotation.y += totalRotation;
      groupRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main ball */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          ref={ballMaterialRef}
          color={activeProduct.ballColor}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Seam lines — 3 great circles at different angles */}
      {[
        [0, 0, 0],
        [Math.PI / 2, 0, 0],
        [0, 0, Math.PI / 2],
      ].map((rotation, i) => (
        <mesh key={i} rotation={rotation as [number, number, number]}>
          <torusGeometry args={[2.01, 0.022, 8, 128]} />
          <meshStandardMaterial
            ref={i === 0 ? seamMaterialRef : undefined}
            color={activeProduct.seamColor}
            roughness={0.8}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}