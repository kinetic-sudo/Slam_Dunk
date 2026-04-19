import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
const COLOR_LERP = 0.055;
const EPSILON = 0.0015;

type MeshEntry = { mat: THREE.MeshStandardMaterial; isSeam: boolean };

export default function BasketballModel({ activeProduct, modelUrl = MODEL_URL }: Props) {
  const groupRef    = useRef<THREE.Group>(null);
  const { scene }   = useGLTF(modelUrl);
  const { invalidate } = useThree(); // used with frameloop="demand" if needed

  const targetBall  = useRef(new THREE.Color(activeProduct.ballColor));
  const targetSeam  = useRef(new THREE.Color(activeProduct.seamColor));
  const colorsDirty = useRef(false);
  const meshList    = useRef<MeshEntry[]>([]);

  // ── Clone scene ONCE, pre-build flat material list ───────────────────────
  const [clonedScene] = useState(() => {
    const clone = scene.clone(true);

    // Centre the model
    const box = new THREE.Box3().setFromObject(clone);
    const ctr = new THREE.Vector3();
    box.getCenter(ctr);
    clone.position.sub(ctr);

    const list: MeshEntry[] = [];
    clone.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const src = Array.isArray(child.material) ? child.material : [child.material];
      const cloned = src.map((m: THREE.Material) => {
        const c = m.clone() as THREE.MeshStandardMaterial;
        return c;
      });
      child.material = cloned.length === 1 ? cloned[0] : cloned;

      const nm = child.name.toLowerCase();
      const isSeam = nm.includes('seam') || nm.includes('line') || nm.includes('groove');

      cloned.forEach(m => {
        if (m instanceof THREE.MeshStandardMaterial) {
          list.push({ mat: m, isSeam });
        }
      });
    });

    meshList.current = list;
    return clone;
  });

  // Update colour targets when product changes
  useEffect(() => {
    targetBall.current.set(activeProduct.ballColor);
    targetSeam.current.set(activeProduct.seamColor);
    colorsDirty.current = true;
  }, [activeProduct.ballColor, activeProduct.seamColor]);

  useFrame(() => {
    // Always rotate — this is the only constant work
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
    }

    // Skip colour loop entirely when settled
    if (!colorsDirty.current) return;

    let moving = false;
    const list = meshList.current;
    const lb   = targetBall.current;
    const ls   = targetSeam.current;

    for (let i = 0; i < list.length; i++) {
      const { mat, isSeam } = list[i];
      const t = isSeam ? ls : lb;
      mat.color.lerp(t, COLOR_LERP);
      if (!moving) {
        const dr = Math.abs(mat.color.r - t.r);
        const dg = Math.abs(mat.color.g - t.g);
        const db = Math.abs(mat.color.b - t.b);
        if (dr > EPSILON || dg > EPSILON || db > EPSILON) moving = true;
      }
    }

    if (!moving) colorsDirty.current = false;
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={clonedScene} scale={2.4} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);