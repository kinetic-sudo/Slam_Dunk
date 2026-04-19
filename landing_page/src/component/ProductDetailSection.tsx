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
      <div style={{ width:28,height:28,borderRadius:'50%',border:`2px solid ${color}33`,borderTop:`2px solid ${color}`,animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function HeroProductSection() {
  const trackRef     = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const ballRef      = useRef<HTMLDivElement>(null);      // GSAP scroll transforms
  const ballFloatRef = useRef<HTMLDivElement>(null);      // idle float only

  const bgTextRef    = useRef<HTMLHeadingElement>(null);
  const priceRef     = useRef<HTMLDivElement>(null);
  const btnRef       = useRef<HTMLButtonElement>(null);
  const arrowsRef    = useRef<HTMLDivElement>(null);
  const dotsRef      = useRef<HTMLDivElement>(null);
  const nameLabelRef = useRef<HTMLDivElement>(null);

  const productContentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLSpanElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLParagraphElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = activeProduct.themeColor;
    document.body.style.backgroundColor = activeProduct.themeColor;
  }, [activeProduct.themeColor]);

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(ballRef.current,   { opacity:0.5 }, { opacity:1, duration:0.4 });
    gsap.fromTo(bgTextRef.current, { opacity:0 },   { opacity:0.07, duration:0.4 });
    gsap.fromTo(priceRef.current,  { opacity:0, y:8 }, { opacity:1, y:0, duration:0.3 });
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

    // ── 2. Idle float on inner wrapper only ───────────────────────────────
    gsap.to(ballFloatRef.current, {
      y:'-=10', duration:2.6, yoyo:true, repeat:-1, ease:'sine.inOut',
    });

    // ── 3. Scroll scrub ───────────────────────────────────────────────────
    /*
     * MEASUREMENTS from reference video:
     *
     * Hero ball: ~30% of viewport height tall  →  base size = 30vh = ~28vw on 16:9
     * Final ball: fills right ~45% of screen, top+bottom both clipped equally
     *   → scale ≈ 1.85  (28vw × 1.85 = 52vw, fits right half with bleed)
     *
     * Ball final X position:
     *   Base width = 28vw. Ball centre needs to land at ~78vw from left.
     *   Current centre = 50vw. Need to move +28vw rightward.
     *   xPercent = 28vw / 28vw × 100 = 100%   → xPercent: 100
     *
     * SCROLL DISTANCE:
     *   Reference completes full transition in ONE wheel scroll (~100vh).
     *   end: '+=100%'  (not 200%)
     *
     * SCRUB:
     *   scrub:0.6 — tight/responsive. Reference feels very direct, not laggy.
     */

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trackRef.current,
        scroller,
        start: 'top top',
        end: '+=100%',       // ONE viewport of scroll — completes in one scroll gesture
        scrub: 0.6,          // tight scrub — direct, responsive feel
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    // Phase 1 (0 → 0.45): Hero UI exits fast
    tl
      .to(bgTextRef.current,    { opacity:0, y:-24, ease:'power2.in', duration:0.4 }, 0)
      .to(dotsRef.current,      { opacity:0, y:-16, ease:'power2.in', duration:0.3 }, 0)
      .to(nameLabelRef.current, { opacity:0,        ease:'power2.in', duration:0.25 }, 0)
      .to(glowRef.current,      { opacity:0,        ease:'power2.in', duration:0.35 }, 0)
      .to(priceRef.current,     { opacity:0, y:-40, ease:'power2.in', duration:0.28 }, 0.04)
      .to(btnRef.current,       { opacity:0, y:-40, ease:'power2.in', duration:0.28 }, 0.06)
      .to(arrowsRef.current,    { opacity:0, y:-40, ease:'power2.in', duration:0.28 }, 0.08)

      // ── Ball: single fromTo, scale + translate right ─────────────────
      // Base size: 28vw.
      // scale:1.85 → rendered width 52vw → fills right half + slight bleed
      // xPercent:100 → shifts 28vw right → ball centre at 50+28 = 78vw ✓
      .fromTo(ballRef.current,
        { scale:1,    xPercent:0   },
        { scale:1.85, xPercent:100, ease:'power2.inOut', duration:0.65 },
        0
      )

    // Phase 2 (0.52 → 1.0): Product content enters
      .set(productContentRef.current, { visibility:'visible' }, 0.52)
      .fromTo(eyebrowRef.current,
        { opacity:0, y:12 }, { opacity:1, y:0, ease:'power2.out', duration:0.18 }, 0.54)
      .fromTo(headingRef.current,
        { opacity:0, x:-36 }, { opacity:1, x:0, ease:'power3.out', duration:0.22 }, 0.58)
      .fromTo(taglineRef.current,
        { opacity:0, y:10 }, { opacity:1, y:0, ease:'power2.out', duration:0.18 }, 0.70)
      .fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity:0, y:14 },
        { opacity:1, y:0, stagger:0.035, ease:'power2.out', duration:0.16 },
        0.78
      );

  }, { scope: trackRef });

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height:'calc(100vh - 40px - 80px)', overflow:'clip' }}
    >

      {/* GLOW */}
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="rounded-full transition-colors duration-700"
          style={{
            width:'60vw', height:'60vw', maxWidth:'720px', maxHeight:'720px',
            background:`radial-gradient(circle, ${activeProduct.themeColor}25 0%, transparent 68%)`,
          }}
        />
      </div>

      {/* BG TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1
          ref={bgTextRef}
          className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity:0.07, letterSpacing:'-0.02em', fontSize:'clamp(60px, 17vw, 260px)' }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* ── BALL ─────────────────────────────────────────────────────────
        Base size: 28vw (≈ 30% of viewport height on 16:9).
        This matches the reference where the ball is clearly smaller than
        the viewport — not dominating it.

        At scale:1.85 → 52vw rendered width.
        At xPercent:100 → centre moves to 50 + 28 = 78vw.
        Ball left edge = 78 - 26 = 52vw → left half is clear for text.
        Ball right edge = 78 + 26 = 104vw → bleeds 4vw off screen. ✓
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={ballRef}
          style={{
            width:  '28vw',
            height: '28vw',
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

      {/* HERO CONTENT — fades out */}
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

        <div ref={nameLabelRef} className="absolute left-1/2 -translate-x-1/2 bottom-28 pointer-events-none">
          <span className="font-heading uppercase text-[#3a3a3a] tracking-[0.28em]" style={{ fontSize:'10px' }}>
            {activeProduct.name}
          </span>
        </div>
      </div>

      {/* PRODUCT CONTENT — fades in
        paddingRight:'50%' keeps text left of ball.
        Ball centre at 78vw, left edge at 52vw → 50% padding gives 4vw clearance.
      */}
      <div
        ref={productContentRef}
        className="absolute inset-0 z-20 flex items-center pointer-events-none"
        style={{ visibility:'hidden', paddingLeft:'56px', paddingRight:'50%' }}
      >
        <div className="flex flex-col w-full">
          <span
            ref={eyebrowRef}
            className="font-heading uppercase mb-3"
            style={{ color:'#FF3C00', fontSize:'11px', letterSpacing:'0.35em' }}
          >
            Performance Series
          </span>

          <div ref={headingRef}>
            <h2
              className="font-heading text-white uppercase"
              style={{ fontSize:'clamp(48px, 6.5vw, 104px)', letterSpacing:'-0.025em', lineHeight:'0.88' }}
            >
              ELITE<br/>CONTROL
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="font-body text-[#666] mt-5 mb-8 leading-relaxed"
            style={{ fontSize:'13px', maxWidth:'320px' }}
          >
            Engineered with microscopic composite channels for unparalleled grip.
            Texture optimised for precision handling.
          </p>

          <div
            ref={statsRef}
            className="grid grid-cols-3 border-t"
            style={{ borderColor:'#1e1e1e', maxWidth:'420px' }}
          >
            {[
              { value:'100%',  label:'Composite'    },
              { value:'0.5mm', label:'Pebble Depth'  },
              { value:'1.2mm', label:'Channels'      },
            ].map((s,i) => (
              <div
                key={i}
                className="flex flex-col pt-4"
                style={{
                  paddingLeft:  i > 0 ? '14px' : 0,
                  paddingRight: '14px',
                  borderRight:  i < 2 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                <span className="font-heading text-white" style={{ fontSize:'clamp(20px, 1.8vw, 32px)', letterSpacing:'-0.02em' }}>
                  {s.value}
                </span>
                <span className="font-heading uppercase mt-1" style={{ fontSize:'9px', color:'#555', letterSpacing:'0.2em' }}>
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