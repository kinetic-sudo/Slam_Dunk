import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProductDetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(textRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(statsRef.current?.children ? Array.from(statsRef.current.children) : [],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(ballRef.current,
      { opacity: 0, x: 100, rotation: 45 },
      { opacity: 1, x: 0, rotation: 0, duration: 1, ease: "power3.out" },
      "-=0.8"
    );

    // Parallax rotation on scroll
    gsap.to(ballRef.current, {
      rotation: 180,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Content */}
        <div ref={textRef} className="flex flex-col">
          <h2 className="font-heading text-6xl md:text-8xl lg:text-9xl leading-[0.85] text-white mb-4">
            ELITE<br />CONTROL
          </h2>
          <p className="text-[#B0B0B0] text-lg max-w-md mb-12 font-body">
            Engineered with microscopic composite channels for unparalleled grip in any condition. Feel the difference on every crossover.
          </p>

          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-3 gap-8 border-t border-[#333] pt-8">
            <div className="flex flex-col">
              <span className="font-heading text-4xl text-white">100%</span>
              <span className="font-heading text-sm text-[#B0B0B0] uppercase tracking-wider mt-1">Moisture Wicking</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-4xl text-white">0.5</span>
              <span className="font-heading text-sm text-[#B0B0B0] uppercase tracking-wider mt-1">Sec Release</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-4xl text-white">1.2<span className="text-2xl">mm</span></span>
              <span className="font-heading text-sm text-[#B0B0B0] uppercase tracking-wider mt-1">Deep Channels</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full aspect-square md:aspect-[4/5] flex justify-end items-start overflow-visible">
          <div className="absolute top-0 right-0 w-[120%] h-[120%] -translate-y-10 translate-x-10">
            <img 
              ref={ballRef}
              src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop" 
              alt="Basketball Detail" 
              className="w-full h-full object-cover rounded-full drop-shadow-[0_20px_40px_rgba(255,60,0,0.2)] mix-blend-screen"
              style={{ filter: 'contrast(1.3) saturate(1.2)' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
