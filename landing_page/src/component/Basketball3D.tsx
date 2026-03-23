import { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const BasketballMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const textures = useMemo(() => {
    const size = 2048; // High res for sharp leather bumps
    const canvas = document.createElement('canvas');
    const bCanvas = document.createElement('canvas'); // Bump map canvas
    canvas.width = canvas.height = size;
    bCanvas.width = bCanvas.height = size;
    
    const ctx = canvas.getContext('2d')!;
    const bCtx = bCanvas.getContext('2d')!;

    // 1. BASE COLOR & BUMP HEIGHT
    ctx.fillStyle = '#8a1a0b'; // Deep saturated red-orange
    ctx.fillRect(0, 0, size, size);
    
    bCtx.fillStyle = '#808080'; // Mid-gray (Neutral height for bump map)
    bCtx.fillRect(0, 0, size, size);

    // 2. PROCEDURAL PEBBLES (Grayscale Depth)
    for (let i = 0; i < 120000; i++) { // Increased pebble count for realism
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.5 + 0.5;
      
      // Color map: Subtle dark/light spots for leather grain
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`; 
      ctx.fill();

      // Bump map: Lighter gray = Raised physical bumps
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fillStyle = `rgba(200, 200, 200, 0.8)`; 
      bCtx.fill();
    }

    // 3. THE SEAMS (Deep, indented rubber)
    const drawSeams = (context: CanvasRenderingContext2D, isBump: boolean) => {
      // Make the seam slightly wider on the bump map for a smooth slope
      context.lineWidth = isBump ? 24 : 16; 
      // Black (#000000) on a bump map means "Maximum Depth" (indented)
      context.strokeStyle = isBump ? '#000000' : '#0a0a0a'; 
      context.lineCap = 'round';
      context.lineJoin = 'round';

      const path = () => {
        // Vertical/Horizontal
        context.beginPath(); context.moveTo(size/2, 0); context.lineTo(size/2, size); context.stroke();
        context.beginPath(); context.moveTo(0, size/2); context.lineTo(size, size/2); context.stroke();
        
        // Curved Panels
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
    drawSeams(bCtx, true);

    const colorTex = new THREE.CanvasTexture(canvas);
    const bumpTex = new THREE.CanvasTexture(bCanvas);
    
    [colorTex, bumpTex].forEach(t => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 16;
    });

    return { colorTex, bumpTex };
  }, []);

  // Removed manual useFrame rotation so it doesn't fight user mouse controls

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[2.5, 128, 128]} />
      <meshPhysicalMaterial
        map={textures.colorTex}
        bumpMap={textures.bumpTex}
        bumpScale={0.02} // Controls how deep the seams/pebbles look
        roughness={0.75} // Grippy leather texture
        metalness={0.1}  // Adds physical density to the material
        clearcoat={0.1}  // Very subtle sheen for that "New NBA Ball" look
        clearcoatRoughness={0.6}
        sheen={1}
        sheenRoughness={0.8}
        sheenColor="#ff4c00"
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
            
            <directionalLight position={[-5, 8, 8]} intensity={2.5} color="#ffffff" />
            <directionalLight position={[5, -5, 5]} intensity={0.5} color="#ffaa88" />
            <pointLight position={[10, 0, -5]} intensity={5} color="#ff4c00" />
            
            <BasketballMesh />
            
            {/* Added OrbitControls for Mouse Interaction */}
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate={true}       // Idle spinning
              autoRotateSpeed={1.5}   // Speed of idle spin
              makeDefault
            />
            
            <Environment preset="studio" />
          </Canvas>
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 0.9, 1], opacity: [0.6, 0.4, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[65%] w-[180px] h-[15px] bg-black blur-xl rounded-full z-0"
        />
      </motion.div>
    </div>
  );
}