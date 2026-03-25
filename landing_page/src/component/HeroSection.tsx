import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(textRef.current, 
      { opacity: 0, scale: 0.8, y: 50 }, 
      { opacity: 0.1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
    )
    .fromTo(ballRef.current,
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

    // Floating animation for the ball
    gsap.to(ballRef.current, {
      y: "-=20",
      rotation: "+=5",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
      {/* Background Text Overlay */}
      <h1 
        ref={textRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[15vw] leading-none text-[#444444] opacity-10 whitespace-nowrap blur-[2px] select-none pointer-events-none z-0"
      >
        NEBULA
      </h1>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-7xl mx-auto px-6">
        
        {/* 3D Ball Image */}
        <div className="w-full max-w-[600px] aspect-square relative mb-8">
          <img 
            ref={ballRef}
            src="https://images.unsplash.com/photo-1519861531473-920026073fdc?q=80&w=1000&auto=format&fit=crop" 
            alt="Premium Basketball" 
            className="w-full h-full object-contain drop-shadow-[0_30px_50px_rgba(255,60,0,0.3)] mix-blend-screen"
            style={{ filter: 'contrast(1.2) saturate(1.5)' }}
          />
        </div>

        {/* CTA Button */}
        <button 
          ref={btnRef}
          className="bg-[#00CFFF] hover:bg-[#00b5e6] text-white font-heading text-2xl uppercase px-16 py-5 rounded-sm tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,207,255,0.4)]"
        >
          Buy Now
        </button>

        {/* Price Tag - Absolute positioned on larger screens, relative on mobile */}
        <div 
          ref={priceRef}
          className="mt-12 md:mt-0 md:absolute md:bottom-24 md:left-12 flex flex-col items-start"
        >
          <span className="font-heading text-5xl md:text-6xl text-[#FF3C00]">$129.99</span>
          <span className="font-heading text-sm text-[#B0B0B0] uppercase tracking-wider mt-1">Pay in 4 installments</span>
        </div>
      </div>
    </section>
  );
}
