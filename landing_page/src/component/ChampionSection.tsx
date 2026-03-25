import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ChampionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const podiumRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(headingRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(podiumRef.current,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.4"
    )
    .fromTo(ballRef.current,
      { opacity: 0, scale: 0.5, y: -50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "bounce.out" },
      "-=0.6"
    )
    .fromTo(labelsRef.current?.children ? Array.from(labelsRef.current.children) : [],
      { opacity: 0, x: (i) => i === 0 ? -30 : 30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" },
      "-=0.4"
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        <h2 ref={headingRef} className="font-heading text-6xl md:text-8xl lg:text-9xl text-white uppercase tracking-tight mb-16 text-center z-20">
          THE CHAMPION
        </h2>

        <div className="relative w-full max-w-4xl flex justify-center items-end h-[400px] md:h-[500px]">
          
          {/* Labels */}
          <div ref={labelsRef} className="absolute inset-0 flex justify-between items-center px-4 md:px-12 z-20 pointer-events-none">
            <div className="flex flex-col items-start max-w-[150px] md:max-w-[200px]">
              <span className="font-heading text-lg md:text-xl text-[#FF3C00] uppercase mb-2 border-b-2 border-[#FF3C00] pb-1">Elite Tier</span>
              <p className="text-[#B0B0B0] text-xs md:text-sm font-body">Crafted for professional indoor play with premium composite leather.</p>
            </div>
            <div className="flex flex-col items-end text-right max-w-[150px] md:max-w-[200px]">
              <span className="font-heading text-lg md:text-xl text-[#FF3C00] uppercase mb-2 border-b-2 border-[#FF3C00] pb-1">Gold Standard</span>
              <p className="text-[#B0B0B0] text-xs md:text-sm font-body">Meets all official size and weight specifications for tournament use.</p>
            </div>
          </div>

          {/* Ball */}
          <img 
            ref={ballRef}
            src="https://images.unsplash.com/photo-1519861531473-920026073fdc?q=80&w=1000&auto=format&fit=crop" 
            alt="Champion Basketball" 
            className="absolute bottom-[15%] md:bottom-[20%] w-[250px] md:w-[350px] z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] mix-blend-screen"
            style={{ filter: 'contrast(1.2) saturate(1.5)' }}
          />

          {/* Podium */}
          <div ref={podiumRef} className="absolute bottom-0 w-[300px] md:w-[500px] h-[100px] md:h-[150px] flex flex-col items-center justify-end z-0">
            {/* Top Tier */}
            <div className="w-[80%] h-[30%] bg-gradient-to-b from-[#333] to-[#111] rounded-[100%] border-t border-[#555] shadow-[0_-10px_20px_rgba(255,60,0,0.1)] relative z-20 -mb-[5%]"></div>
            {/* Middle Tier */}
            <div className="w-[90%] h-[40%] bg-gradient-to-b from-[#222] to-[#0a0a0a] rounded-[100%] border-t border-[#444] relative z-10 -mb-[5%]"></div>
            {/* Bottom Tier */}
            <div className="w-full h-[50%] bg-gradient-to-b from-[#1a1a1a] to-[#000] rounded-[100%] border-t border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
