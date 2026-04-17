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
  const trackRef       = useRef<HTMLDivElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);
  const ballScrollRef  = useRef<HTMLDivElement>(null); // outer: scroll transforms
  const ballFloatRef   = useRef<HTMLDivElement>(null); // inner: idle float only

  const bgTextRef      = useRef<HTMLHeadingElement>(null);
  const priceRef       = useRef<HTMLDivElement>(null);
  const btnRef         = useRef<HTMLButtonElement>(null);
  const arrowsRef      = useRef<HTMLDivElement>(null);
  const dotsRef        = useRef<HTMLDivElement>(null);
  const nameLabelRef   = useRef<HTMLDivElement>(null);

  const productContentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef     = useRef<HTMLSpanElement>(null);
  const headingRef     = useRef<HTMLDivElement>(null);
  const taglineRef     = useRef<HTMLParagraphElement>(null);
  const statsRef       = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = activeProduct.themeColor;
    document.body.style.backgroundColor = activeProduct.themeColor;
  }, [activeProduct.themeColor]);

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(ballScrollRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(bgTextRef.current, { opacity: 0 }, { opacity: 0.07, duration: 0.4 });
    gsap.fromTo(priceRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
    setActiveIndex(index);
  }, [activeIndex]);

  const handlePrev = () => handleSelect((activeIndex - 1 + products.length) % products.length);
  const handleNext = () => handleSelect((activeIndex + 1) % products.length);

  useGSAP(() => {
    const scroller = SCROLLER();

    // ─── 1. Load entry (no scroll) ───────────────────────────────────────
    gsap.timeline()
      .fromTo(bgTextRef.current,
        { opacity: 0, scale: 0.92 }, { opacity: 0.07, scale: 1, duration: 1, ease: 'power3.out' })
      .fromTo(ballScrollRef.current,
        { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }, '-=0.7')
      .fromTo(priceRef.current,
        { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, '-=0.4')
      .fromTo(btnRef.current,
        { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .fromTo(arrowsRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2')
      .fromTo(dotsRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.3');

    // ─── 2. Idle float on inner wrapper only ─────────────────────────────
    gsap.to(ballFloatRef.current, {
      y: '-=10', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
    });

    // ─── 3. Main scrubbed scroll transition ──────────────────────────────
    /*
     * REFERENCE VIDEO ANALYSIS (frame by frame):
     *
     * Phase A  (scroll 0%→40%):
     *   - Hero UI (bg text, price, CTA, arrows) fades out quickly
     *   - Ball stays centred but begins scaling up: 1× → ~1.6×
     *   - NO rotation, NO lateral movement yet
     *   - The "growing from centre" feel dominates
     *
     * Phase B  (scroll 40%→70%):
     *   - Ball BOTH grows AND moves right simultaneously
     *   - Scale goes 1.6× → 2.6×
     *   - Ball translates from viewport centre to right edge (bleeds off)
     *   - Ball stays vertically centred — NO yPercent movement
     *
     * Phase C  (scroll 60%→100%):
     *   - Product text (ELITE CONTROL, stats) fades in from left
     *   - Ball fully off-right, only ~40% visible
     *
     * KEY FIXES vs previous version:
     *   1. NO rotate — reference shows zero CSS tilt
     *   2. NO yPercent — ball stays vertically centred throughout
     *   3. Scale must reach ~2.6× (not 2.0×) to bleed off right edge
     *   4. x translation uses vw units (not xPercent which is self-relative)
     *      Ball starts at viewport centre → needs to move ~35vw rightward
     *   5. Hero UI fades out in phase A (0→0.35), not dragged into phase B
     *   6. Two-phase ball motion: grow-in-place THEN grow+translate
     */
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: trackRef.current,
        scroller,
        start: 'top top',
        end: '+=200%',
        scrub: 1.0,         // tighter scrub = more responsive, less lag
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    // ── Phase A: Hero UI exits, ball grows in-place ──────────────────────
    mainTl
      .to(bgTextRef.current,  { opacity: 0, y: -30, duration: 0.3, ease: 'power2.in' }, 0)
      .to(dotsRef.current,    { opacity: 0, y: -24, duration: 0.25, ease: 'power2.in' }, 0)
      .to(nameLabelRef.current,{ opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
      .to(glowRef.current,    { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0)
      // Price and CTA exit slightly later
      .to(priceRef.current,   { opacity: 0, y: -50, duration: 0.28, ease: 'power2.in' }, 0.05)
      .to(btnRef.current,     { opacity: 0, y: -50, duration: 0.28, ease: 'power2.in' }, 0.07)
      .to(arrowsRef.current,  { opacity: 0, y: -50, duration: 0.28, ease: 'power2.in' }, 0.09)

      // Ball: pure scale-up from centre, no movement yet
      // Progress 0 → 0.38: scale 1 → 1.7, position unchanged
      .to(ballScrollRef.current, {
        scale: 1.72,
        // x/y stays at 0 — ball grows from the exact centre
        duration: 0.38,
        ease: 'power1.inOut',
      }, 0)

    // ── Phase B: Ball grows + translates right ───────────────────────────
    // Progress 0.38 → 0.78: scale 1.72 → 2.65, x 0 → ~34vw
    // We use x in pixels derived from vw: window.innerWidth * 0.34
    // But since GSAP processes this at animation time, use a function-based
    // getter OR simply use a large enough xPercent.
    // ballScrollRef width ≈ 44vw, so xPercent 80 = 0.8 × 44vw = 35.2vw ✓
      .to(ballScrollRef.current, {
        scale: 2.65,
        xPercent: 78,       // 0.78 × 44vw ≈ 34vw shift right from centre
        duration: 0.40,
        ease: 'power2.inOut',
      }, 0.38)

    // ── Phase C: Product content fades in ────────────────────────────────
      .set(productContentRef.current, { visibility: 'visible' }, 0.52)
      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.54)
      .fromTo(headingRef.current,
        { opacity: 0, x: -44 }, { opacity: 1, x: 0, duration: 0.22, ease: 'power3.out' }, 0.58)
      .fromTo(taglineRef.current,
        { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }, 0.68)
      .fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.16, ease: 'power2.out' },
        0.76
      );

  }, { scope: trackRef });

  // Hero canvas size — sized to fill viewport nicely
  const heroCanvasSize = 'min(46vw, calc(100vh - 40px - 80px - 120px))';

  return (
    <div
      ref={trackRef}
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100vh - 40px - 80px)' }}
    >
      {/* ── GLOW ────────────────────────────────────────────────────── */}
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="rounded-full transition-colors duration-700"
          style={{
            width: '65vw', height: '65vw', maxWidth: '800px', maxHeight: '800px',
            background: `radial-gradient(circle, ${activeProduct.themeColor}2a 0%, transparent 68%)`,
          }}
        />
      </div>

      {/* ── BG TEXT ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1
          ref={bgTextRef}
          className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity: 0.07, letterSpacing: '-0.02em', fontSize: 'clamp(64px, 18vw, 280px)' }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* ── BALL (outer = scroll transforms, inner = float) ──────────── */}
      {/*
        The outer div (ballScrollRef) is centred via absolute+flex.
        GSAP animates: scale (grows), xPercent (moves right).
        NO rotation, NO yPercent movement — matching the reference.
        
        The inner div (ballFloatRef) gets the repeating y float.
        Separating these prevents the scrub from fighting the float tween.
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={ballScrollRef}
          style={{ width: heroCanvasSize, height: heroCanvasSize, flexShrink: 0, position: 'relative' }}
        >
          <div ref={ballFloatRef} className="w-full h-full pointer-events-auto">
            <Loader color={activeProduct.themeColor} />
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
                <BasketballModel activeProduct={activeProduct} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* ── HERO CONTENT (fades out) ─────────────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Dots */}
        <div
          ref={dotsRef}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto"
          style={{ top: '24px' }}
        >
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handleSelect(i)}
              aria-label={p.name}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? '26px' : '8px',
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
          style={{ bottom: 0, padding: '0 56px 40px 56px' }}
        >
          <div ref={priceRef} className="flex flex-col gap-1">
            <span
              className="font-heading leading-none transition-colors duration-500"
              style={{ color: activeProduct.themeColor, fontSize: 'clamp(24px, 4vw, 56px)', letterSpacing: '-0.02em' }}
            >
              {activeProduct.price}
            </span>
            <span className="font-body uppercase" style={{ fontSize: '9px', color: '#555', letterSpacing: '0.2em' }}>
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
            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.18 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.18 })}
          >
            Add to Cart
          </button>

          <div ref={arrowsRef} className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border: '1px solid #333' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#666')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = '#333')}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="font-heading text-[#555] tracking-widest" style={{ fontSize: '11px', minWidth: '42px', textAlign: 'center' }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
            </span>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border: `1px solid ${activeProduct.themeColor}` }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Product name label */}
        <div ref={nameLabelRef} className="absolute left-1/2 -translate-x-1/2 bottom-28 pointer-events-none">
          <span className="font-heading uppercase text-[#3a3a3a] tracking-[0.28em]" style={{ fontSize: '10px' }}>
            {activeProduct.name}
          </span>
        </div>
      </div>

      {/* ── PRODUCT CONTENT (fades in) ───────────────────────────────── */}
      {/*
        Restricted to left 50% of viewport.
        Ball is on the right 50%+ (xPercent:78 of 46vw ≈ 36vw rightward).
        paddingRight: '52%' keeps text safely left of ball.
      */}
      <div
        ref={productContentRef}
        className="absolute inset-0 z-20 flex items-center pointer-events-none"
        style={{ visibility: 'hidden', paddingLeft: '56px', paddingRight: '52%' }}
      >
        <div className="flex flex-col w-full">
          <span
            ref={eyebrowRef}
            className="font-heading uppercase mb-4"
            style={{ color: '#FF3C00', fontSize: '11px', letterSpacing: '0.35em' }}
          >
            Performance Series
          </span>

          <div ref={headingRef}>
            <h2
              className="font-heading text-white uppercase"
              style={{ fontSize: 'clamp(52px, 7vw, 108px)', letterSpacing: '-0.025em', lineHeight: '0.88' }}
            >
              ELITE<br />CONTROL
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="font-body text-[#777] mt-6 mb-10 leading-relaxed"
            style={{ fontSize: '14px', maxWidth: '340px' }}
          >
            Engineered with microscopic composite channels for unparalleled grip.
            Texture optimised for precision handling.
          </p>

          <div
            ref={statsRef}
            className="grid grid-cols-3 border-t"
            style={{ borderColor: '#1e1e1e', maxWidth: '440px' }}
          >
            {[
              { value: '100%',  label: 'Composite'   },
              { value: '0.5mm', label: 'Pebble Depth' },
              { value: '1.2mm', label: 'Channels'     },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col pt-5"
                style={{
                  paddingLeft:  i > 0 ? '16px' : 0,
                  paddingRight: '16px',
                  borderRight:  i < 2 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                <span
                  className="font-heading text-white"
                  style={{ fontSize: 'clamp(22px, 2vw, 34px)', letterSpacing: '-0.02em' }}
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
      </div>
    </div>
  );
}