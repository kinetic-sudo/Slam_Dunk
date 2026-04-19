import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import BasketballModel from './Basketball3D';

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = () => document.querySelector('.site-card') as HTMLElement;

export type ActiveProduct = {
  id: string; name: string; price: string;
  themeColor: string; ballColor: string; seamColor: string;
};

const products: ActiveProduct[] = [
  { id: 'spaing',  name: 'SPAING',  price: '$34.99', themeColor: '#FF3C00', ballColor: '#B91C1C', seamColor: '#050505' },
  { id: 'vertex',  name: 'VERTEX',  price: '$49.99', themeColor: '#00FF4D', ballColor: '#047857', seamColor: '#050505' },
  { id: 'nebula',  name: 'NEBULA',  price: '$59.99', themeColor: '#00CFFF', ballColor: '#0369A1', seamColor: '#050505' },
  { id: 'inferno', name: 'INFERNO', price: '$64.99', themeColor: '#cc0000', ballColor: '#7F1D1D', seamColor: '#050505' },
  { id: 'stealth', name: 'STEALTH', price: '$79.99', themeColor: '#ff0055', ballColor: '#111111', seamColor: '#ff0055' },
];

function Loader({ color }: { color: string }) {
  return (
    <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none' }}>
      <div style={{ width:32,height:32,borderRadius:'50%',border:`2px solid ${color}33`,borderTop:`2px solid ${color}`,animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function HeroProductSection() {
  const trackRef      = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  // Single wrapper for the ball — GSAP will animate this
  const ballRef       = useRef<HTMLDivElement>(null);
  // Inner wrapper for idle float ONLY (separate to avoid transform conflict)
  const ballFloatRef  = useRef<HTMLDivElement>(null);

  const bgTextRef     = useRef<HTMLHeadingElement>(null);
  const priceRef      = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const arrowsRef     = useRef<HTMLDivElement>(null);
  const dotsRef       = useRef<HTMLDivElement>(null);
  const nameLabelRef  = useRef<HTMLDivElement>(null);

  const productContentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef    = useRef<HTMLSpanElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLParagraphElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = activeProduct.themeColor;
    document.body.style.backgroundColor = activeProduct.themeColor;
  }, [activeProduct.themeColor]);

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(ballRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(bgTextRef.current, { opacity: 0 }, { opacity: 0.07, duration: 0.4 });
    gsap.fromTo(priceRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
    setActiveIndex(index);
  }, [activeIndex]);

  const handlePrev = () => handleSelect((activeIndex - 1 + products.length) % products.length);
  const handleNext = () => handleSelect((activeIndex + 1) % products.length);

  useGSAP(() => {
    const scroller = SCROLLER();

    // ── 1. Load entry ─────────────────────────────────────────────────────
    gsap.timeline()
      .fromTo(bgTextRef.current,
        { opacity:0, scale:0.92 }, { opacity:0.07, scale:1, duration:1, ease:'power3.out' })
      .fromTo(ballRef.current,
        { opacity:0, scale:0.82 }, { opacity:1, scale:1, duration:1.2, ease:'back.out(1.4)' }, '-=0.7')
      .fromTo(priceRef.current,
        { opacity:0, x:-20 }, { opacity:1, x:0, duration:0.5 }, '-=0.4')
      .fromTo(btnRef.current,
        { opacity:0, y:16 }, { opacity:1, y:0, duration:0.5 }, '-=0.3')
      .fromTo(arrowsRef.current,
        { opacity:0 }, { opacity:1, duration:0.4 }, '-=0.2')
      .fromTo(dotsRef.current,
        { opacity:0 }, { opacity:1, duration:0.4 }, '-=0.3');

    // ── 2. Idle float on INNER wrapper only ───────────────────────────────
    // Animates `y` on ballFloatRef so it never conflicts with ballRef transforms
    gsap.to(ballFloatRef.current, {
      y: '-=10', duration:2.6, yoyo:true, repeat:-1, ease:'sine.inOut',
    });

    // ── 3. Scroll scrub ───────────────────────────────────────────────────
    /*
     * TARGET STATE (matching reference video):
     *
     * Hero (scroll 0):
     *   ball  — centred, ~44vw wide (scale 1)
     *   x     — 0 (flex-centred)
     *
     * Product state (scroll 100%):
     *   ball  — scale 1.55 → ball rendered width ≈ 68vw
     *   x     — shifted right so ball CENTRE is at ~75% of viewport
     *           from flex centre (50vw) → need +25vw shift
     *           ballRef width = 44vw, so xPercent 57 = 0.57×44vw = 25vw ✓
     *
     * What the video shows (WRONG in last version):
     *   - scale 2.65 made ball fill the entire screen (way too much)
     *   - two sequential .to() on ballRef caused GSAP scrub to interpolate
     *     the wrong keyframes — ball went UP not RIGHT
     *
     * FIX: ONE single fromTo per property on ballRef.
     *      scale: 1 → 1.55  (ball fills right half, not whole screen)
     *      xPercent: 0 → 57  (shifts centre from 50vw to ~75vw)
     *      No yPercent. No rotate.
     *
     * The scrub timeline must have NO duplicate property tweens.
     */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          scroller,
          start: 'top top',
          end: '+=200%',
          scrub: 1.5,       // 1.5s lag gives buttery feel
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          // onUpdate fires every frame during scrub for debugging:
          // onUpdate: (self) => console.log(self.progress.toFixed(2)),
        },
      });

      // ── Hero UI exits (progress 0 → 0.4) ────────────────────────────
      tl
        .to(bgTextRef.current,   { opacity:0, y:-30, ease:'power2.in', duration:0.4 }, 0)
        .to(dotsRef.current,     { opacity:0, y:-20, ease:'power2.in', duration:0.3 }, 0)
        .to(nameLabelRef.current,{ opacity:0,        ease:'power2.in', duration:0.25 }, 0)
        .to(glowRef.current,     { opacity:0,        ease:'power2.in', duration:0.35 }, 0)
        .to(priceRef.current,    { opacity:0, y:-48, ease:'power2.in', duration:0.3  }, 0.06)
        .to(btnRef.current,      { opacity:0, y:-48, ease:'power2.in', duration:0.3  }, 0.08)
        .to(arrowsRef.current,   { opacity:0, y:-48, ease:'power2.in', duration:0.3  }, 0.10)

        // ── Ball: SINGLE tween — scale + shift right (progress 0 → 0.65) ──
        // One fromTo per property = no scrub keyframe conflicts
        .fromTo(ballRef.current,
          {
            scale:    1,
            xPercent: 0,
          },
          {
            scale:    1.55,   // fills right half nicely, doesn't overflow whole screen
            xPercent: 57,     // 57% of 44vw = 25vw rightward → ball centre at 75vw
            ease:     'power2.inOut',
            duration: 0.65,   // occupies first 65% of the total scrub travel
          },
          0                   // starts at progress 0, runs in parallel with UI exit
        )

        // ── Product content enters (progress 0.55 → 1.0) ─────────────────
        .set(productContentRef.current, { visibility:'visible' }, 0.55)
        .fromTo(eyebrowRef.current,
          { opacity:0, y:14 }, { opacity:1, y:0, ease:'power2.out', duration:0.2 }, 0.57)
        .fromTo(headingRef.current,
          { opacity:0, x:-40 }, { opacity:1, x:0, ease:'power3.out', duration:0.24 }, 0.61)
        .fromTo(taglineRef.current,
          { opacity:0, y:12 }, { opacity:1, y:0, ease:'power2.out', duration:0.2 }, 0.72)
        .fromTo(
          statsRef.current?.children ? Array.from(statsRef.current.children) : [],
          { opacity:0, y:16 },
          { opacity:1, y:0, stagger:0.04, ease:'power2.out', duration:0.18 },
          0.80
        );
    });

    return () => ctx.revert();

  }, { scope: trackRef });

  return (
    /*
     * trackRef: the pinned container.
     * CRITICAL: overflow must be 'clip' not 'hidden'.
     * 'overflow:hidden' on a ScrollTrigger-pinned element breaks pin
     * calculations in some browsers and clips the ball before it exits right.
     * 'overflow:clip' clips visually without creating a scroll context.
     */
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height:'calc(100vh - 40px - 80px)', overflow:'clip' }}
    >

      {/* ── GLOW ──────────────────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div
          className="rounded-full transition-colors duration-700"
          style={{
            width:'65vw', height:'65vw', maxWidth:'800px', maxHeight:'800px',
            background:`radial-gradient(circle, ${activeProduct.themeColor}28 0%, transparent 68%)`,
          }}
        />
      </div>

      {/* ── BG TEXT ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1
          ref={bgTextRef}
          className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity:0.07, letterSpacing:'-0.02em', fontSize:'clamp(64px, 18vw, 280px)' }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* ── BALL ──────────────────────────────────────────────────────── */}
      {/*
        Outer div (ballRef): centred via flex, GSAP animates scale + xPercent
        Inner div (ballFloatRef): idle y-float only, never touched by scroll tween
        
        heroCanvasSize sets the base size. At scale:1.55 this becomes ~68vw.
        With xPercent:57 (25vw right) the ball centre sits at ~75vw.
        The right quarter of the ball bleeds off-screen — matching the reference.
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={ballRef}
          style={{
            width:  'min(44vw, calc(100vh - 40px - 80px - 120px))',
            height: 'min(44vw, calc(100vh - 40px - 80px - 120px))',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <div ref={ballFloatRef} className="w-full h-full pointer-events-auto">
            <Loader color={activeProduct.themeColor} />
            <Canvas
              style={{ width:'100%', height:'100%', display:'block' }}
              camera={{ position:[0,0,5.2], fov:42 }}
              gl={{ antialias:true, alpha:true }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
              <ambientLight intensity={0.55} />
              <directionalLight position={[6,10,6]}   intensity={1.6} />
              <directionalLight position={[-6,-4,-6]} intensity={0.4} color="#ff4400" />
              <spotLight position={[0,8,4]} angle={0.25} penumbra={1} intensity={2.2} castShadow />
              <Environment preset="studio" />
              <Suspense fallback={null}>
                <BasketballModel activeProduct={activeProduct} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* ── HERO CONTENT (fades out) ───────────────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        {/* Dots */}
        <div
          ref={dotsRef}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto"
          style={{ top:'24px' }}
        >
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handleSelect(i)}
              aria-label={p.name}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === activeIndex ? '26px' : '8px',
                height: '8px',
                backgroundColor: i === activeIndex ? p.themeColor : '#2a2a2a',
                border: `1px solid ${i === activeIndex ? p.themeColor : '#444'}`,
              }}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="absolute left-0 right-0 flex items-end justify-between pointer-events-auto"
          style={{ bottom:0, padding:'0 56px 40px 56px' }}
        >
          {/* Price */}
          <div ref={priceRef} className="flex flex-col gap-1">
            <span
              className="font-heading leading-none transition-colors duration-500"
              style={{ color:activeProduct.themeColor, fontSize:'clamp(24px, 4vw, 56px)', letterSpacing:'-0.02em' }}
            >
              {activeProduct.price}
            </span>
            <span className="font-body uppercase" style={{ fontSize:'9px', color:'#555', letterSpacing:'0.2em' }}>
              Size 29.5" · Official
            </span>
          </div>

          {/* CTA */}
          <button
            ref={btnRef}
            className="font-heading uppercase rounded-sm"
            style={{
              backgroundColor: activeProduct.themeColor,
              color: '#fff',
              boxShadow: `0 8px 32px ${activeProduct.themeColor}55`,
              fontSize: 'clamp(11px, 0.85vw, 13px)',
              padding: '22px clamp(28px, 3.5vw, 56px)',
              letterSpacing: '0.22em',
            }}
            onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.05, duration:0.18 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale:1,    duration:0.18 })}
          >
            Add to Cart
          </button>

          {/* Arrows */}
          <div ref={arrowsRef} className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border:'1px solid #333' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor='#666')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor='#333')}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="font-heading text-[#555] tracking-widest" style={{ fontSize:'11px', minWidth:'42px', textAlign:'center' }}>
              {String(activeIndex+1).padStart(2,'0')} / {String(products.length).padStart(2,'0')}
            </span>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border:`1px solid ${activeProduct.themeColor}` }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Name label */}
        <div ref={nameLabelRef} className="absolute left-1/2 -translate-x-1/2 bottom-28 pointer-events-none">
          <span className="font-heading uppercase text-[#3a3a3a] tracking-[0.28em]" style={{ fontSize:'10px' }}>
            {activeProduct.name}
          </span>
        </div>
      </div>

      {/* ── PRODUCT CONTENT (fades in) ─────────────────────────────────── */}
      {/*
        Constrained to left 48% of viewport.
        Ball at xPercent:57 is centred at ~75vw, so its left edge ≈ 53vw.
        paddingRight:'52%' keeps text clear of the ball.
      */}
      <div
        ref={productContentRef}
        className="absolute inset-0 z-20 flex items-center pointer-events-none"
        style={{ visibility:'hidden', paddingLeft:'56px', paddingRight:'52%' }}
      >
        <div className="flex flex-col w-full">
          <span
            ref={eyebrowRef}
            className="font-heading uppercase mb-4"
            style={{ color:'#FF3C00', fontSize:'11px', letterSpacing:'0.35em' }}
          >
            Performance Series
          </span>

          <div ref={headingRef}>
            <h2
              className="font-heading text-white uppercase"
              style={{ fontSize:'clamp(52px, 7vw, 108px)', letterSpacing:'-0.025em', lineHeight:'0.88' }}
            >
              ELITE<br/>CONTROL
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="font-body text-[#777] mt-6 mb-10 leading-relaxed"
            style={{ fontSize:'14px', maxWidth:'340px' }}
          >
            Engineered with microscopic composite channels for unparalleled grip.
            Texture optimised for precision handling.
          </p>

          <div
            ref={statsRef}
            className="grid grid-cols-3 border-t"
            style={{ borderColor:'#1e1e1e', maxWidth:'440px' }}
          >
            {[
              { value:'100%',  label:'Composite'    },
              { value:'0.5mm', label:'Pebble Depth'  },
              { value:'1.2mm', label:'Channels'      },
            ].map((s,i) => (
              <div
                key={i}
                className="flex flex-col pt-5"
                style={{
                  paddingLeft:  i > 0 ? '16px' : 0,
                  paddingRight: '16px',
                  borderRight:  i < 2 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                <span className="font-heading text-white" style={{ fontSize:'clamp(22px, 2vw, 34px)', letterSpacing:'-0.02em' }}>
                  {s.value}
                </span>
                <span className="font-heading uppercase mt-2" style={{ fontSize:'9px', color:'#555', letterSpacing:'0.22em' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}