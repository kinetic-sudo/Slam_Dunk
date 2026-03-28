import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = () => document.querySelector('.site-card') as HTMLElement;

export default function SpecsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const calloutsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const callouts = calloutsRef.current?.children ? Array.from(calloutsRef.current.children) : [];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      }
    });

    tl.fromTo(ballRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(callouts,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.2, ease: 'back.out(1.5)' },
      '-=0.5'
    );

    callouts.forEach((callout, i) => {
      gsap.to(callout as Element, {
        y: i % 2 === 0 ? '-=15' : '+=15',
        duration: 2 + i * 0.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });

    gsap.to(ballRef.current, {
      rotation: -90,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative flex justify-center items-center min-h-[600px]">
        <div className="w-[300px] md:w-[400px] aspect-square relative z-10">
          <img
            ref={ballRef}
            src="https://images.unsplash.com/photo-1519861531473-920026073fdc?q=80&w=1000&auto=format&fit=crop"
            alt="Basketball Specs"
            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,60,0,0.4)] mix-blend-screen"
            style={{ filter: 'contrast(1.2) saturate(1.5) hue-rotate(340deg)' }}
          />
        </div>

        <div ref={calloutsRef} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] md:left-[20%] flex items-center gap-4">
            <div className="font-heading text-sm md:text-base text-white uppercase tracking-wider bg-[#111111]/80 px-4 py-2 rounded border border-[#333] backdrop-blur-sm">High-Tack Surface</div>
            <div className="w-16 md:w-32 h-[1px] bg-white/30 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="absolute top-[30%] right-[10%] md:right-[20%] flex items-center gap-4 flex-row-reverse">
            <div className="font-heading text-sm md:text-base text-white uppercase tracking-wider bg-[#111111]/80 px-4 py-2 rounded border border-[#333] backdrop-blur-sm">1.2mm Channels</div>
            <div className="w-16 md:w-32 h-[1px] bg-white/30 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="absolute bottom-[30%] left-[5%] md:left-[15%] flex items-center gap-4">
            <div className="font-heading text-sm md:text-base text-white uppercase tracking-wider bg-[#111111]/80 px-4 py-2 rounded border border-[#333] backdrop-blur-sm">Cushion Core</div>
            <div className="w-20 md:w-40 h-[1px] bg-white/30 relative transform rotate-12 origin-right">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="absolute bottom-[20%] right-[15%] md:right-[25%] flex items-center gap-4 flex-row-reverse">
            <div className="font-heading text-sm md:text-base text-white uppercase tracking-wider bg-[#111111]/80 px-4 py-2 rounded border border-[#333] backdrop-blur-sm">Air Retention</div>
            <div className="w-12 md:w-24 h-[1px] bg-white/30 relative transform -rotate-12 origin-left">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}