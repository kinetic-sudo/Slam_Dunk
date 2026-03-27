import { useEffect, useRef, useMemo } from 'react';
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

type Props = {
  activeProduct: ActiveProduct;
  drag: { x: number; y: number; dragging: boolean };
};

// ── Procedural leather texture via canvas ──────────────────────────
function makeLeatherTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base: mid-grey (normal map neutral or roughness base)
  ctx.fillStyle = '#888';
  ctx.fillRect(0, 0, size, size);

  // Layer 1 — coarse pebble grain (large blobs)
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 5 + 2;
    const brightness = Math.random() > 0.5 ? 180 : 60;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},0.18)`;
    ctx.fill();
  }

  // Layer 2 — fine micro-grain (tiny bumps)
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.5 + 0.5;
    const brightness = Math.random() > 0.5 ? 220 : 40;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${brightness},${brightness},${brightness},0.25)`;
    ctx.fill();
  }

  // Layer 3 — pore indentations (dark dots)
  for (let i = 0; i < 2500; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,0.35)`;
    ctx.fill();
  }

  // Layer 4 — leather panel streaks (directional micro-scratches)
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = Math.random() * 18 + 4;
    const angle = Math.random() * Math.PI;
    const brightness = Math.random() > 0.5 ? 200 : 30;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.strokeStyle = `rgba(${brightness},${brightness},${brightness},0.08)`;
    ctx.lineWidth = Math.random() * 1.2 + 0.2;
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

// ── Roughness map — light areas = rough, dark = smoother ──────────
function makeRoughnessTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base roughness: fairly rough (light grey)
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(0, 0, size, size);

  // Smoother highlight streaks
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = Math.random() * 30 + 5;
    const angle = Math.random() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.strokeStyle = `rgba(60,60,60,0.15)`;
    ctx.lineWidth = Math.random() * 2 + 0.5;
    ctx.stroke();
  }

  // Rougher pore dots
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,0.3)`;
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
}

export default function BasketballModel({ activeProduct, drag }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const ballMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const seamMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const spinVelocityRef = useRef({ x: 0, y: 0 });
  const prevDrag = useRef({ x: drag.x, y: drag.y });

  const targetBallColor = useRef(new THREE.Color(activeProduct.ballColor));
  const targetSeamColor = useRef(new THREE.Color(activeProduct.seamColor));

  // Generate textures once
  const leatherBump = useMemo(() => makeLeatherTexture(512), []);
  const roughnessTex = useMemo(() => makeRoughnessTexture(512), []);

  useEffect(() => {
    targetBallColor.current = new THREE.Color(activeProduct.ballColor);
    targetSeamColor.current = new THREE.Color(activeProduct.seamColor);
    spinVelocityRef.current = { x: 0, y: Math.PI * 5 };
  }, [activeProduct]);

  useFrame((_, delta) => {
    if (ballMaterialRef.current) {
      ballMaterialRef.current.color.lerp(targetBallColor.current, 0.08);
    }
    if (seamMaterialRef.current) {
      seamMaterialRef.current.color.lerp(targetSeamColor.current, 0.08);
    }

    if (!groupRef.current) return;

    if (drag.dragging) {
      const dx = drag.x - prevDrag.current.x;
      const dy = drag.y - prevDrag.current.y;
      groupRef.current.rotation.y += dx * 0.01;
      groupRef.current.rotation.x += dy * 0.01;
      spinVelocityRef.current.x = dy * 0.01;
      spinVelocityRef.current.y = dx * 0.01;
      prevDrag.current = { x: drag.x, y: drag.y };
    } else {
      prevDrag.current = { x: drag.x, y: drag.y };
      spinVelocityRef.current.x *= 0.93;
      spinVelocityRef.current.y *= 0.93;
      groupRef.current.rotation.x += spinVelocityRef.current.x;
      groupRef.current.rotation.y += spinVelocityRef.current.y;
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Ball body with leather texture ── */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          ref={ballMaterialRef}
          color={activeProduct.ballColor}
          roughness={0.82}
          metalness={0.0}
          bumpMap={leatherBump}
          bumpScale={0.18}
          roughnessMap={roughnessTex}
        />
      </mesh>

      {/* ── Seam lines ── */}
      {(
        [
          [0, 0, 0],
          [Math.PI / 2, 0, 0],
          [0, 0, Math.PI / 2],
        ] as [number, number, number][]
      ).map((rotation, i) => (
        <mesh key={i} rotation={rotation}>
          <torusGeometry args={[2.015, 0.028, 12, 160]} />
          <meshStandardMaterial
            ref={i === 0 ? seamMaterialRef : undefined}
            color={activeProduct.seamColor}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}