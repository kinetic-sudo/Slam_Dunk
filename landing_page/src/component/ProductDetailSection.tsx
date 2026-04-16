import { useRef, Suspense } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import BasketballModel from './Basketball3D';

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = () => document.querySelector('.site-card') as HTMLElement;

const FEATURED = {
  id: 'spaing', name: 'SPAING', price: '$34.99',
  themeColor: '#FF3C00', ballColor: '#B91C1C', seamColor: '#050505',
};

export default function ProductDetailsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLParagraphElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const ballWrapRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scroller = SCROLLER();

    // ─── ENTRY: ball travels from hero-centre → right column ──────────────
    // scrub ties progress 1:1 to scroll position, matching the video exactly
    const entryTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller,
        start: 'top 92%',    // section just enters viewport
        end:   'top 20%',    // section top reaches near viewport top
        scrub: 1.4,
      },
    });

    // Ball starts at the hero's visual centre:
    //   - xPercent -55 shifts it left of its natural grid column
    //   - scale 0.55 makes it match the hero's apparent size
    //   - opacity 0 so it doesn't ghost before scrolling starts
    entryTl
      .fromTo(ballWrapRef.current,
        { xPercent: -52, yPercent: -8, scale: 0.58, opacity: 0, rotate: -20 },
        { xPercent: 0,   yPercent: 0,  scale: 1,    opacity: 1, rotate: 0,
          ease: 'power2.out' }
      )
      // Text slides in as the ball arrives
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 14 }, { opacity: 1, y: 0, ease: 'power2.out' },
        0.3
      )
      .fromTo(textRef.current,
        { opacity: 0, x: -36 }, { opacity: 1, x: 0, ease: 'power3.out' },
        0.38
      )
      .fromTo(taglineRef.current,
        { opacity: 0, y: 10 }, { opacity: 1, y: 0, ease: 'power2.out' },
        0.5
      )
      .fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.05, ease: 'power2.out' },
        0.58
      );

    // ─── PARALLAX: gentle drift while scrolling through section ───────────
    gsap.to(ballWrapRef.current, {
      rotate: 28,
      y: 36,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        scroller,
        start: 'top 20%',
        end:   'bottom top',
        scrub: 1.8,
      },
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-8 md:px-14 py-28 md:py-36 overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

        {/* LEFT — Text */}
        <div className="flex flex-col z-10">
          <span
            ref={eyebrowRef}
            className="font-heading uppercase mb-4"
            style={{ color: '#FF3C00', fontSize: '11px', letterSpacing: '0.35em' }}
          >
            Performance Series
          </span>

          <div ref={textRef}>
            <h2
              className="font-heading text-white uppercase"
              style={{ fontSize: 'clamp(56px, 8vw, 118px)', letterSpacing: '-0.025em', lineHeight: '0.88' }}
            >
              ELITE<br />CONTROL
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="font-body text-[#777] mt-8 mb-14 leading-relaxed max-w-sm"
            style={{ fontSize: '16px' }}
          >
            Engineered with microscopic composite channels for unparalleled grip.
            Texture optimised for precision handling and consistent feedback.
          </p>

          <div ref={statsRef} className="grid grid-cols-3 border-t" style={{ borderColor: '#1e1e1e' }}>
            {[
              { value: '100%',  label: 'Composite'   },
              { value: '0.5mm', label: 'Pebble Depth' },
              { value: '1.2mm', label: 'Channels'    },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col pt-6"
                style={{
                  paddingLeft:  i > 0 ? '16px' : 0,
                  paddingRight: '16px',
                  borderRight:  i < 2 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                <span
                  className="font-heading text-white"
                  style={{ fontSize: 'clamp(26px, 2.5vw, 38px)', letterSpacing: '-0.02em' }}
                >
                  {s.value}
                </span>
                <span
                  className="font-heading uppercase mt-2"
                  style={{ fontSize: '9px', color: '#555', letterSpacing: '0.22em' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Ball
            Intentionally 130% wide + negative right margin so it bleeds
            off the screen edge, matching the video reference.
        */}
        <div className="relative flex justify-center md:justify-end items-center">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,60,0,0.12) 0%, transparent 65%)' }}
          />

          <div
            ref={ballWrapRef}
            style={{
              width: 'clamp(340px, 52vw, 660px)',
              aspectRatio: '1/1',
              marginRight: '-18%',   // bleeds off right edge
              flexShrink: 0,
              position: 'relative',
              zIndex: 5,
            }}
          >
            <Canvas
              style={{ width: '100%', height: '100%', display: 'block' }}
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
              <ambientLight intensity={0.55} />
              <directionalLight position={[6, 10, 6]}   intensity={1.6} />
              <directionalLight position={[-6, -4, -6]} intensity={0.4} color="#ff4400" />
              <spotLight position={[0, 8, 4]} angle={0.25} penumbra={1} intensity={2.2} castShadow />
              <Environment preset="studio" />
              <Suspense fallback={null}>
                <BasketballModel activeProduct={FEATURED} />
              </Suspense>
            </Canvas>
          </div>
        </div>

      </div>
    </section>
  );
}