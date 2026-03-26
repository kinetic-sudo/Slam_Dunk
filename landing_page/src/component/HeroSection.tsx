import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import BasketballModel from './Basketball3D'; // Adjust path if needed

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null); // Changed to HTMLDivElement
  const textRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  // We define the active product here to pass into the 3D model.
  // In a full app, this might come from state or a parent component.
  const activeProduct = {
    id: "nebula",
    name: "NEBULA",
    price: "$59.99",
    themeColor: "#00CFFF",
    ballColor: "#0044ff",
    seamColor: "#00CFFF"
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(textRef.current, 
      { opacity: 0, scale: 0.8, y: 50 }, 
      { opacity: 0.1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(ballRef.current,
      // GSAP will animate the wrapper div containing the 3D Canvas
      { opacity: 0, scale: 0.5, y: 100, rotation: -45 },
      { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 1.2, ease: "back.out(1.5)" },
      "-=0.6"
    )
    .fromTo(btnRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(priceRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    // Floating animation for the 3D Canvas wrapper
    gsap.to(ballRef.current, {
      y: "-=20",
      rotation: "+=5", // A slight CSS tilt while the 3D model spins internally
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-[#0a0a0a]">
      
      {/* Background Text Overlay */}
      <h1 
        ref={textRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[15vw] leading-none text-[#444444] opacity-10 whitespace-nowrap blur-[2px] select-none pointer-events-none z-0"
      >
        {activeProduct.name}
      </h1>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-6">
        
        {/* 3D Ball Container - GSAP animates this div */}
        <div 
          ref={ballRef} 
          className="w-full max-w-[600px] aspect-square relative mb-8 pointer-events-none"
        >
          {/* Transparent 3D Canvas layered perfectly over the background text */}
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            
            <BasketballModel activeProduct={activeProduct} />
            
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* CTA Button */}
        <button 
          ref={btnRef}
          className="bg-[#00CFFF] hover:bg-[#00b5e6] text-white font-heading text-2xl uppercase px-16 py-5 rounded-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,207,255,0.4)] pointer-events-auto"
        >
          Add to Cart
        </button>

        {/* Price Tag */}
        <div 
          ref={priceRef}
          className="mt-12 md:mt-0 md:absolute md:bottom-24 md:left-12 flex flex-col items-start"
        >
          <span className="font-heading text-5xl md:text-6xl" style={{ color: activeProduct.themeColor }}>
            {activeProduct.price}
          </span>
          <span className="font-heading text-sm text-[#B0B0B0] uppercase tracking-wider mt-1">
            SIZE: 29.5" • OFFICIAL
          </span>
        </div>
      </div>
    </section>
  );
}       