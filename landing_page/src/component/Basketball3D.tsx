import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export type ActiveProduct = {
  id: string; name: string; price: string;
  themeColor: string; ballColor: string; seamColor: string;
};

type Props = {
  activeProduct: ActiveProduct;
  modelUrl?: string;
};

const MODEL_URL = '/models/basketball.glb';

// Lerp speed — how fast color transitions happen
const COLOR_LERP = 0.06;
// Stop lerping when this close to target (avoids infinite micro-updates)
const COLOR_EPSILON = 0.002;

export default function BasketballModel({ activeProduct, modelUrl = MODEL_URL }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);

  const targetBall = useRef(new THREE.Color(activeProduct.ballColor));
  const targetSeam = useRef(new THREE.Color(activeProduct.seamColor));
  // Track whether colors are still transitioning
  const colorsDirty = useRef(false);

  // ── Pre-build material lists once (not every frame) ──────────────────
  // meshData: array of { mat, isSeam } built at clone time.
  // useFrame reads this directly — zero traverse, zero allocations per frame.
  type MeshData = { mat: THREE.MeshStandardMaterial; isSeam: boolean };
  const meshDataRef = useRef<MeshData[]>([]);

  const [clonedScene] = useState(() => {
    const clone = scene.clone(true);

    // Centre the model
    const box = new THREE.Box3().setFromObject(clone);
    const centre = new THREE.Vector3();
    box.getCenter(centre);
    clone.position.sub(centre);

    const list: MeshData[] = [];

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      // Clone materials so we don't mutate the cached GLTF
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      const cloned = mats.map((m: THREE.Material) => m.clone());
      child.material = cloned.length === 1 ? cloned[0] : cloned;

      const isSeam =
        child.name.toLowerCase().includes('seam') ||
        child.name.toLowerCase().includes('line');

      cloned.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          list.push({ mat: m, isSeam });
        }
      });
    });

    meshDataRef.current = list;
    return clone;
  });

  // When product changes: mark dirty, update targets
  useEffect(() => {
    targetBall.current.set(activeProduct.ballColor);
    targetSeam.current.set(activeProduct.seamColor);
    colorsDirty.current = true;
  }, [activeProduct.ballColor, activeProduct.seamColor]);

  useFrame(() => {
    // ── Rotate ────────────────────────────────────────────────────────
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
    }

    // ── Color lerp — only runs when dirty ─────────────────────────────
    // This is the key perf fix: skip the entire loop when colors have settled.
    if (!colorsDirty.current) return;

    let stillMoving = false;
    const list = meshDataRef.current;

    for (let i = 0; i < list.length; i++) {
      const { mat, isSeam } = list[i];
      const target = isSeam ? targetSeam.current : targetBall.current;

      mat.color.lerp(target, COLOR_LERP);

      // Check if we've reached the target
      if (
        Math.abs(mat.color.r - target.r) > COLOR_EPSILON ||
        Math.abs(mat.color.g - target.g) > COLOR_EPSILON ||
        Math.abs(mat.color.b - target.b) > COLOR_EPSILON
      ) {
        stillMoving = true;
      }
    }

    // Once all colors have settled, stop running the loop
    if (!stillMoving) {
      colorsDirty.current = false;
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={clonedScene} scale={2.4} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);