import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export type ActiveProduct = {
  id: string;
  name: string;
  price: string;
  themeColor: string;
  ballColor: string;
  seamColor: string;
};

type Props = {
  activeProduct: ActiveProduct;
  modelUrl?: string;
};

const MODEL_URL =
'/models/basketball.glb'
export default function BasketballModel({
  activeProduct,
  modelUrl = MODEL_URL,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);

  // Track whether we've cloned materials yet
  const clonedRef = useRef(false);

  const targetBallColor = useRef(new THREE.Color(activeProduct.ballColor));
  const targetSeamColor = useRef(new THREE.Color(activeProduct.seamColor));

  // Clone the scene once so mutations don't affect the GLTF cache
  const [clonedScene] = useState(() => {
    const clone = scene.clone(true);
    // Deep-clone all materials so they're instance-independent
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => m.clone());
        } else {
          child.material = child.material.clone();
        }
      }
    });
    return clone;
  });

  useEffect(() => {
    targetBallColor.current = new THREE.Color(activeProduct.ballColor);
    targetSeamColor.current = new THREE.Color(activeProduct.seamColor);
  }, [activeProduct]);

  useFrame(() => {
    if (!clonedScene) return;

    // Slow auto-rotate
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
    }

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      mats.forEach((mat) => {
        if (!(mat instanceof THREE.MeshStandardMaterial)) return;

        const isSeam =
          child.name.toLowerCase().includes('seam') ||
          mat.name.toLowerCase().includes('seam') ||
          child.name.toLowerCase().includes('line') ||
          mat.name.toLowerCase().includes('line');

        if (isSeam) {
          mat.color.lerp(targetSeamColor.current, 0.06);
          mat.roughness = 0.85;
          mat.metalness = 0.0;
        } else {
          mat.color.lerp(targetBallColor.current, 0.06);
          // Keep the model's built-in PBR roughness/metalness intact
          // so the photorealistic leather texture is preserved.
          // Only nudge if materials seem flat:
          if (mat.roughness > 0.95) mat.roughness = 0.72;
          if (mat.metalness < 0.05) mat.metalness = 0.08;
        }

        mat.needsUpdate = false; // color.lerp doesn't need needsUpdate
      });
    });
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={clonedScene}
        // Scale up — the model is small by default
        scale={2.6}
        position={[0, 0, 0]}
      />
    </group>
  );
}

// Kick off the network request immediately
useGLTF.preload(MODEL_URL);