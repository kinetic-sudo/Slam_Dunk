import { useRef, useState, useCallback } from 'react';
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
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // Drag state passed into the 3D model
  const dragRef = useRef({ x: 0, y: 0, dragging: false });
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });

  // ── Drag handlers ──────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const next = { x: e.clientX, y: e.clientY, dragging: true };
    dragRef.current = next;
    setDrag(next);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const next = { x: e.clientX, y: e.clientY, dragging: true };
    dragRef.current = next;
    setDrag(next);
  }, []);

  const onPointerUp = useCallback(() => {
    const next = { ...dragRef.current, dragging: false };
    dragRef.current = next;
    setDrag(next);
  }, []);

  // ── Entry animation ────────────────────────────────────────────
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 0.09, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(canvasWrapRef.current,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.4)" },
      "-=0.7"
    )
    .fromTo(priceRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(btnRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(arrowsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      "-=0.2"
    );

    // Subtle float — only when not dragging
    gsap.to(canvasWrapRef.current, {
      y: "-=14",
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;

    gsap.fromTo(canvasWrapRef.current,
      { scale: 0.94 },
      { scale: 1, duration: 0.5, ease: "back.out(2)" }
    );
    gsap.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 0.09, scale: 1, duration: 0.45, ease: "power2.out" }
    );
    gsap.fromTo(priceRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );

    setActiveIndex(index);
  };

  const handlePrev = () => handleSelect((activeIndex - 1 + products.length) % products.length);
  const handleNext = () => handleSelect((activeIndex + 1) % products.length);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* ── Background name text — true viewport center ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          ref={bgTextRef}
          className="font-heading text-[22vw] leading-none text-white select-none"
          style={{ opacity: 0.09, letterSpacing: '-0.02em' }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* ── Radial glow — viewport center ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div
          className="w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${activeProduct.themeColor}22 0%, transparent 68%)`,
          }}
        />
      </div>

      {/* ── 3D Ball — same center anchor as the text ── */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          ref={canvasWrapRef}
          className="w-[min(58vw,540px)] aspect-square"
          style={{ cursor: drag.dragging ? 'grabbing' : 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
            <ambientLight intensity={0.45} />
            <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2.5} castShadow />
            <spotLight
              position={[-8, -5, -5]}
              angle={0.3}
              penumbra={1}
              intensity={1.2}
              color={activeProduct.themeColor}
            />
            <BasketballModel activeProduct={activeProduct} drag={drag} />
            <Environment preset="city" />
          </Canvas>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between px-10 md:px-14 pb-10 md:pb-12">

        {/* Price — bottom left */}
        <div ref={priceRef} className="flex flex-col items-start">
          <span
            className="font-heading text-5xl md:text-6xl leading-none transition-colors duration-500"
            style={{ color: activeProduct.themeColor }}
          >
            {activeProduct.price}
          </span>
          <span className="font-heading text-[10px] text-[#444] uppercase tracking-widest mt-2">
            Size 29.5" · Official
          </span>
        </div>

        {/* CTA — bottom center */}
        <button
          ref={btnRef}
          className="font-heading text-sm md:text-base uppercase px-12 py-4 tracking-widest transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: activeProduct.themeColor,
            color: '#ffffff',
            boxShadow: `0 8px 32px ${activeProduct.themeColor}55`,
          }}
        >
          Add to Cart
        </button>

        {/* Arrows — bottom right */}
        <div ref={arrowsRef} className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-[#3a3a3a] flex items-center justify-center text-white hover:border-[#666] transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-[#3a3a3a] flex items-center justify-center text-white hover:border-[#666] transition-colors duration-200"
            style={{ borderColor: activeProduct.themeColor }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}