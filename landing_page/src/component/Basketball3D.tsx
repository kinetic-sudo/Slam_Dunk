import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

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
  
  // Create refs for the materials so we can animate them
  const ballMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const seamMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Target colors for smooth interpolation
  const targetBallColor = new THREE.Color(activeProduct.ballColor);
  const targetSeamColor = new THREE.Color(activeProduct.seamColor);

  // If you have a real GLTF model, load it here:
  // const { nodes, materials } = useGLTF('/models/basketball.glb');

  // Trigger a spin animation when the product changes
  useEffect(() => {
    if (groupRef.current) {
      // Add a quick 360-degree spin to the current rotation
      groupRef.current.rotation.y += Math.PI * 2;
    }
  }, [activeProduct]);

  useFrame((_, delta) => {
    // 1. Smoothly interpolate colors (lerp)
    if (ballMaterialRef.current) {
      ballMaterialRef.current.color.lerp(targetBallColor, 0.1);
    }
    if (seamMaterialRef.current) {
      seamMaterialRef.current.color.lerp(targetSeamColor, 0.1);
    }

    // 2. Add a constant, slow idle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <motion.group ref={groupRef}>
      {/* NOTE: Replace this generic sphere with your actual GLTF nodes.
        Example using GLTF nodes:
        <mesh geometry={nodes.BallMesh.geometry}>
          <meshStandardMaterial ref={ballMaterialRef} roughness={0.4} />
        </mesh>
        <mesh geometry={nodes.SeamsMesh.geometry}>
          <meshStandardMaterial ref={seamMaterialRef} roughness={0.8} />
        </mesh>
      */}

      {/* Placeholder Geometry to demonstrate the effect */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial ref={ballMaterialRef} roughness={0.3} metalness={0.2} />
      </mesh>
    </motion.group>
  );
}