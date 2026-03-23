import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const BasketballMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const { colorMap, bumpMap } = useMemo(() => {
    const size = 1024;
    const cCanvas = document.createElement('canvas');
    const bCanvas = document.createElement('canvas');

    cCanvas.width = bCanvas.width = size;
    cCanvas.height = bCanvas.height = size;

    const cCtx = cCanvas.getContext('2d')!;
    const bCtx = bCanvas.getContext('2d')!;

    // Base colors
    cCtx.fillStyle = '#d95c14'; // Basketball orange
    cCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080'; // Mid-gray for bump map
    bCtx.fillRect(0, 0, size, size);

    // Noise for bump map (pebbles)
    const imgData = bCtx.getImageData(0, 0, size, size);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 60;
      const val = 128 + noise;
      data[i] = data[i + 1] = data[i + 2] = val;
      data[i + 3] = 255;
    }
    bCtx.putImageData(imgData, 0, 0);

    // Draw seams function
    const drawSeams = (ctx: CanvasRenderingContext2D, isBump: boolean) => {
      ctx.lineWidth = isBump ? 12 : 8; // Slightly wider on bump map for indentation
      ctx.strokeStyle = isBump ? '#000000' : '#1a1a1a';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Horizontal equator
      ctx.beginPath();
      ctx.moveTo(0, size / 2);
      ctx.lineTo(size, size / 2);
      ctx.stroke();

      // Vertical meridian
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.stroke();

      // Wrap around vertical edges
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size, 0);
      ctx.lineTo(size, size);
      ctx.stroke();

      // Left curve
      ctx.beginPath();
      for (let y = 0; y <= size; y += 5) {
        const x = size / 4 + Math.sin((y / size) * Math.PI) * (size / 5.5);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Right curve
      ctx.beginPath();
      for (let y = 0; y <= size; y += 5) {
        const x = (3 * size) / 4 - Math.sin((y / size) * Math.PI) * (size / 5.5);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    drawSeams(cCtx, false);
    drawSeams(bCtx, true);

    const colorTex = new THREE.CanvasTexture(cCanvas);
    const bumpTex = new THREE.CanvasTexture(bCanvas);

    colorTex.anisotropy = 16;
    bumpTex.anisotropy = 16;

    // Ensure seamless wrapping
    colorTex.wrapS = THREE.RepeatWrapping;
    colorTex.wrapT = THREE.ClampToEdgeWrapping;
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.ClampToEdgeWrapping;

    return { colorMap: colorTex, bumpMap: bumpTex };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x += delta * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        bumpMap={bumpMap}
        bumpScale={0.015}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

export default function Basketball3D() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.9, type: 'spring', bounce: 0.3 }}
        className="relative flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[450px] lg:h-[450px] pointer-events-auto cursor-grab active:cursor-grabbing"
        >
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <Environment preset="city" />
            <BasketballMesh />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </motion.div>
        {/* Shadow */}
        <motion.div
          animate={{ scale: [1, 0.8, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-6 md:-bottom-8 lg:-bottom-12 w-[100px] md:w-[150px] lg:w-[200px] h-[10px] md:h-[15px] lg:h-[20px] bg-black/80 blur-xl rounded-full z-0"
        />
      </motion.div>
    </div>
  );
}
