import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Instagram, Twitter, Youtube } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function GravityPromoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(textRef.current,
      { opacity: 0, scale: 0.5, filter: "blur(10px)" },
      { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "back.out(1.2)" }
    )
    .fromTo(iconRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(btnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(socialRef.current?.children ? Array.from(socialRef.current.children) : [],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    );

    // Pulse animation for play icon
    gsap.to(iconRef.current, {
      scale: 1.15,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-32 flex flex-col items-center justify-center min-h-[60vh]">
      
      <div className="relative flex items-center justify-center mb-16">
        <div ref={iconRef} className="absolute -left-12 md:-left-24 text-[#FF3C00]">
          <Play size={48} className="md:w-16 md:h-16 fill-current" />
        </div>
        <h2 ref={textRef} className="font-heading text-7xl md:text-9xl lg:text-[12rem] text-white uppercase tracking-tighter leading-none">
          GRAVITY
        </h2>
      </div>

      <button 
        ref={btnRef}
        className="bg-transparent border-2 border-[#FF3C00] text-white font-heading text-xl md:text-2xl uppercase px-12 py-4 rounded-sm tracking-wide transition-all duration-300 hover:bg-[#FF3C00] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,60,0,0.5)] mb-16"
      >
        Shop Collection
      </button>

      <div ref={socialRef} className="flex items-center gap-8">
        <a href="#" className="text-white hover:text-[#FF3C00] transition-colors hover:scale-110 transform duration-300">
          <Instagram size={24} />
        </a>
        <a href="#" className="text-white hover:text-[#FF3C00] transition-colors hover:scale-110 transform duration-300">
          <Twitter size={24} />
        </a>
        <a href="#" className="text-white hover:text-[#FF3C00] transition-colors hover:scale-110 transform duration-300">
          <Youtube size={24} />
        </a>
      </div>

    </section>
  );
}
