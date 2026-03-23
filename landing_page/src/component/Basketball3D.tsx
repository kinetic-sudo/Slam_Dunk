import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const BasketballMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const textures = useMemo(() => {
    const size = 2048; // High resolution is key for pebbles
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // 1. BASE LEATHER COLOR (Deep saturated red-orange)
    ctx.fillStyle = '#8a1a0b'; 
    ctx.fillRect(0, 0, size, size);

    // 2. PROCEDURAL PEBBLES (Normal Map logic)
    const nCanvas = document.createElement('canvas');
    nCanvas.width = nCanvas.height = size;
    const nCtx = nCanvas.getContext('2d')!;
    nCtx.fillStyle = '#8080ff'; // Neutral Normal Color
    nCtx.fillRect(0, 0, size, size);

    // Draw thousands of tiny pebbles
    for (let i = 0; i < 80000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.5 + 0.8;
      
      // Color variation for leather grain
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`; 
      ctx.fill();

      // Normal Map "Bump"
      nCtx.beginPath();
      nCtx.arc(x, y, r, 0, Math.PI * 2);
      nCtx.fillStyle = `rgba(180, 120, 255, 0.3)`; 
      nCtx.fill();
    }

    // 3. THE SEAMS (Deep, indented rubber)
    const drawSeams = (context: CanvasRenderingContext2D, isNormal: boolean) => {
      context.lineWidth = isNormal ? 20 : 16;
      context.strokeStyle = isNormal ? '#404080' : '#0a0a0a';
      context.lineCap = 'round';

      const path = () => {
        // Vertical/Horizontal
        context.beginPath(); context.moveTo(size/2, 0); context.lineTo(size/2, size); context.stroke();
        context.beginPath(); context.moveTo(0, size/2); context.lineTo(size, size/2); context.stroke();
        
        // Panels
        const drawCurve = (x: number, inv: boolean) => {
          context.beginPath();
          for(let y=0; y<=size; y+=10){
            const xPos = x + (inv ? -1 : 1) * Math.sin((y/size)*Math.PI) * (size/4.2);
            y === 0 ? context.moveTo(xPos, y) : context.lineTo(xPos, y);
          }
          context.stroke();
        };
        drawCurve(size/4, false);
        drawCurve(3*size/4, true);
      }
      path();
    };

    drawSeams(ctx, false);
    drawSeams(nCtx, true);

    const colorTex = new THREE.CanvasTexture(canvas);
    const normalTex = new THREE.CanvasTexture(nCanvas);
    
    // Set wrapping and anisotropy for sharpness
    [colorTex, normalTex].forEach(t => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 16;
    });

    return { colorTex, normalTex };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      // Subtle float yoyo 3s loop matches spec
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * (Math.PI / 1.5)) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[2.5, 128, 128]} />
      <meshPhysicalMaterial
        map={textures.colorTex}
        normalMap={textures.normalTex}
        normalScale={new THREE.Vector2(1.5, 1.5)} // This gives the pebbles their "pop"
        roughness={0.8} // High roughness for leather feel
        metalness={0.0}
        clearcoat={0.05} // Subtle "new ball" sheen
        clearcoatRoughness={0.4}
        sheen={1}
        sheenRoughness={0.8}
        sheenColor="#ff4c00" // Subsurface scattering feel
      />
    </mesh>
  );
};

export default function Basketball3D() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full h-full">
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center w-full h-full"
      >
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 w-[300px] h-[300px] pointer-events-auto cursor-grab active:cursor-grabbing"
        >
          <Canvas camera={{ position: [0, 0, 7.5], fov: 40 }} gl={{ alpha: true, antialias: true }}>
            <ambientLight intensity={0.15} />
            
            {/* Top-Left Key Light matching Screenshot Highlight */}
            <directionalLight position={[-5, 8, 8]} intensity={2.5} color="#ffffff" />
            
            {/* Soft Fill Light Bottom-Right */}
            <directionalLight position={[5, -5, 5]} intensity={0.5} color="#ffaa88" />

            {/* Subtle Rim Light Right Side */}
            <pointLight position={[10, 0, -5]} intensity={5} color="#ff4c00" />
            
            <BasketballMesh />
            <Environment preset="studio" />
          </Canvas>
        </motion.div>
        
        {/* Soft shadow below */}
        <motion.div
          animate={{ scale: [1, 0.9, 1], opacity: [0.6, 0.4, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[65%] w-[180px] h-[15px] bg-black blur-xl rounded-full z-0"
        />
      </motion.div>
    </div>
  );
}