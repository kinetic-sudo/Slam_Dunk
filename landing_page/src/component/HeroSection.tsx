import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import BasketballModel from './Basketball3D';

const products = [
  {
    id: "spaing",
    name: "SPAING",
    price: "$34.99",
    themeColor: "#FF3C00",
    ballColor: "#d32f2f",
    seamColor: "#111111"
  },
  {
    id: "vertex",
    name: "VERTEX",
    price: "$49.99",
    themeColor: "#00FF4D",
    ballColor: "#1a1a1a",
    seamColor: "#00FF4D"
  },
  {
    id: "nebula",
    name: "NEBULA",
    price: "$59.99",
    themeColor: "#00CFFF",
    ballColor: "#0044ff",
    seamColor: "#00CFFF"
  },
  {
    id: "inferno",
    name: "INFERNO",
    price: "$64.99",
    themeColor: "#cc0000",
    ballColor: "#330000",
    seamColor: "#cc0000"
  },
  {
    id: "stealth",
    name: "STEALTH",
    price: "$79.99",
    themeColor: "#ff0055",
    ballColor: "#ff2a5f",
    seamColor: "#220011"
  }
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // Entry animation
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 0.07, scale: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(ballRef.current,
      { opacity: 0, scale: 0.5, y: 80 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.5)" },
      "-=0.6"
    )
    .fromTo(priceRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(btnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(
      selectorRef.current?.children ? Array.from(selectorRef.current.children) : [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: "power2.out" },
      "-=0.3"
    );

    // Floating ball
    gsap.to(ballRef.current, {
      y: "-=18",
      duration: 2.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;

    // Flash/pulse the ball on switch
    gsap.fromTo(ballRef.current,
      { scale: 0.92 },
      { scale: 1, duration: 0.5, ease: "back.out(2)" }
    );

    // Animate price out/in
    gsap.fromTo(priceRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );

    // Flash bg text
    gsap.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 0.07, scale: 1, duration: 0.5, ease: "power2.out" }
    );

    setActiveIndex(index);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Background name text */}
      <h1
        ref={bgTextRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[18vw] leading-none text-white opacity-[0.07] whitespace-nowrap blur-[3px] select-none pointer-events-none z-0 transition-none"
        style={{ letterSpacing: '-0.02em' }}
      >
        {activeProduct.name}
      </h1>

      {/* Glow blob behind ball */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${activeProduct.themeColor}22 0%, transparent 70%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-6">

        {/* 3D Ball */}
        <div
          ref={ballRef}
          className="w-full max-w-[520px] aspect-square relative mb-6 pointer-events-none"
        >
          <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2.5} castShadow />
            <spotLight position={[-8, -8, -5]} angle={0.3} penumbra={1} intensity={0.8} color={activeProduct.themeColor} />
            <BasketballModel activeProduct={activeProduct} />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* CTA Button */}
        <button
          ref={btnRef}
          className="font-heading text-xl uppercase px-14 py-4 rounded-sm tracking-widest transition-all duration-300 hover:scale-105 pointer-events-auto mb-14"
          style={{
            backgroundColor: activeProduct.themeColor,
            color: '#ffffff',
            boxShadow: `0 10px 40px ${activeProduct.themeColor}55`,
          }}
        >
          Add to Cart
        </button>

        {/* Product Selector */}
        <div
          ref={selectorRef}
          className="flex items-center gap-6 md:gap-10"
        >
          {products.map((product, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={product.id}
                onClick={() => handleSelect(i)}
                className="flex flex-col items-center gap-2 group transition-all duration-300 pointer-events-auto"
              >
                {/* Color dot */}
                <div
                  className="w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: product.themeColor,
                    boxShadow: isActive ? `0 0 14px 4px ${product.themeColor}88` : 'none',
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                {/* Name */}
                <span
                  className="font-heading text-xs md:text-sm uppercase tracking-widest transition-all duration-300"
                  style={{
                    color: isActive ? product.themeColor : '#555',
                  }}
                >
                  {product.name}
                </span>
                {/* Active underline */}
                <div
                  className="h-[2px] w-full rounded transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? product.themeColor : 'transparent',
                    opacity: isActive ? 1 : 0,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Price tag — bottom left */}
      <div
        ref={priceRef}
        className="absolute bottom-10 left-10 md:bottom-16 md:left-14 flex flex-col items-start z-20"
      >
        <span
          className="font-heading text-5xl md:text-6xl leading-none transition-colors duration-500"
          style={{ color: activeProduct.themeColor }}
        >
          {activeProduct.price}
        </span>
        <span className="font-heading text-xs text-[#555] uppercase tracking-widest mt-2">
          Size 29.5" · Official
        </span>
      </div>
    </section>
  );
}