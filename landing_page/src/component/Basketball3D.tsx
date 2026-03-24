import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d'; 

// 1. Material Logic Generator
const useBasketballMaterial = () => {
  return useMemo(() => {
    const size = 1024; // Scaled down slightly to save memory/processing on load
    const canvas = document.createElement('canvas');
    const bCanvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    bCanvas.width = bCanvas.height = size;
    const ctx = canvas.getContext('2d');
    const bCtx = bCanvas.getContext('2d');

    ctx.fillStyle = '#8a1a0b';
    ctx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    for (let i = 0; i < 80000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.5 + 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
      ctx.fill();
      
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fillStyle = `rgba(200, 200, 200, 0.8)`;
      bCtx.fill();
    }

    const colorTex = new THREE.CanvasTexture(canvas);
    const bumpTex = new THREE.CanvasTexture(bCanvas);
    [colorTex, bumpTex].forEach(t => { 
      t.wrapS = t.wrapT = THREE.RepeatWrapping; 
      t.anisotropy = 8; 
    });

    return { 
      map: colorTex, 
      bumpMap: bumpTex, 
      bumpScale: 0.02, 
      roughness: 0.75, 
      metalness: 0.1, 
      clearcoat: 0.1 
    };
  }, []);
};

// 2. The Exploding Mesh Component
const ExplodingBasketball = ({ isExploded }) => {
  const materialProps = useBasketballMaterial();
  const explosionFactor = isExploded ? 0.8 : 0; 

  return (
    <motion.group 
      animate={{ rotateY: isExploded ? Math.PI / 4 : 0 }} 
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      {/* Top Half Panel */}
      <motion.mesh 
        animate={{ y: explosionFactor, rotateX: isExploded ? -0.2 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* phiStart, phiLength, thetaStart, thetaLength applied to halve the sphere */}
        <sphereGeometry args={[2.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial {...materialProps} />
      </motion.mesh>

      {/* Bottom Half Pasnel */}
      <motion.mesh 
        animate={{ y: -explosionFactor, rotateX: isExploded ? 0.2 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <sphereGeometry args={[2.5, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial {...materialProps} />
      </motion.mesh>
    </motion.group>
  );
};

// 3. Main 3D Wrapper
export default function Basketball3D({ isExploded }) {
  return (
    <div className="w-full h-full pointer-events-auto">
      <Canvas gl={{ alpha: true, antialias: true }}>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, isExploded ? 6.5 : 8]} 
          fov={40} 
        />
        <ambientLight intensity={0.15} />
        <directionalLight position={[-5, 8, 8]} intensity={2.5} />
        <pointLight position={[10, 0, -5]} intensity={5} color="#ff4c00" />
        
        <ExplodingBasketball isExploded={isExploded} />
        
        {/* OrbitControls disabled zooming/panning to prevent user from breaking the fixed UI layout */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!isExploded} autoRotateSpeed={2} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}