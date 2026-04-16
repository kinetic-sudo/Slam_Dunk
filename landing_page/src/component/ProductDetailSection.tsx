/**
 * ARCHITECTURE OVERVIEW
 * ─────────────────────
 * The video shows ONE ball that persists across two "sections".
 * It does NOT jump between two Canvas elements.
 *
 * Layout:
 *   ┌─ .site-card (overflow-y: auto, scroll container) ──────────────┐
 *   │  ┌─ nav (sticky z-50) ──────────────────────────────────────┐  │
 *   │  └──────────────────────────────────────────────────────────┘  │
 *   │                                                                 │
 *   │  ┌─ #scroll-track (height: 300vh, position: relative) ──────┐  │
 *   │  │                                                           │  │
 *   │  │  ┌─ #ball-canvas (position: sticky, top: 80px) ────────┐ │  │
 *   │  │  │  Single <Canvas> — ball grows & moves right         │ │  │
 *   │  │  └────────────────────────────────────────────────────── ┘ │  │
 *   │  │                                                           │  │
 *   │  │  ┌─ #hero-content (position: absolute, inset-0) ───────┐ │  │
 *   │  │  │  SPAING text, price, CTA, arrows                    │ │  │
 *   │  │  └─────────────────────────────────────────────────────┘ │  │
 *   │  │                                                           │  │
 *   │  │  ┌─ #product-content (position: absolute, top: 100vh) ─┐ │  │
 *   │  │  │  ELITE CONTROL text, stats                          │ │  │
 *   │  │  └─────────────────────────────────────────────────────┘ │  │
 *   │  └───────────────────────────────────────────────────────────┘  │
 *   │                                                                 │
 *   │  ... rest of page (SpecsSection, etc.) ...                      │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * The scroll-track is 300vh tall so we have room to scrub:
 *   0–100vh  → hero phase  (ball centred, normal size)
 *   100–200vh→ transition  (ball grows, moves right, text swaps)
 *   200–300vh→ product phase (ball huge on right, ELITE CONTROL on left)
 */

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
      <div style={{ width:36,height:36,borderRadius:'50%',border:`2px solid ${color}33`,borderTop:`2px solid ${color}`,animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function HeroProductSection() {
  // ── Refs ────────────────────────────────────────────────────────────────
  const trackRef      = useRef<HTMLDivElement>(null);   // 300vh scroll track
  const ballCanvasRef = useRef<HTMLDivElement>(null);   // sticky canvas wrapper
  const glowRef       = useRef<HTMLDivElement>(null);

  // Hero content refs
  const bgTextRef  = useRef<HTMLHeadingElement>(null);
  const priceRef   = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLButtonElement>(null);
  const arrowsRef  = useRef<HTMLDivElement>(null);
  const dotsRef    = useRef<HTMLDivElement>(null);
  const nameLabelRef = useRef<HTMLDivElement>(null);

  // Product content refs
  const productContentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // ── Sync frame colour ───────────────────────────────────────────────────
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = activeProduct.themeColor;
    document.body.style.backgroundColor = activeProduct.themeColor;
  }, [activeProduct.themeColor]);

  // ── Product navigation ──────────────────────────────────────────────────
  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(ballCanvasRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo(bgTextRef.current, { opacity: 0 }, { opacity: 0.07, duration: 0.4 });
    gsap.fromTo(priceRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 });
    setActiveIndex(index);
  }, [activeIndex]);
  const handlePrev = () => handleSelect((activeIndex - 1 + products.length) % products.length);
  const handleNext = () => handleSelect((activeIndex + 1) % products.length);

  // ── GSAP scroll animation ───────────────────────────────────────────────
  useGSAP(() => {
    const scroller = SCROLLER();

    // ── 1. Entry animation (on load, no scroll) ─────────────────────────
    const loadTl = gsap.timeline();
    loadTl
      .fromTo(bgTextRef.current, { opacity:0, scale:0.92 }, { opacity:0.07, scale:1, duration:1, ease:'power3.out' })
      .fromTo(ballCanvasRef.current, { opacity:0, scale:0.82 }, { opacity:1, scale:1, duration:1.2, ease:'back.out(1.4)' }, '-=0.7')
      .fromTo(priceRef.current, { opacity:0, x:-20 }, { opacity:1, x:0, duration:0.5 }, '-=0.4')
      .fromTo(btnRef.current, { opacity:0, y:16 }, { opacity:1, y:0, duration:0.5 }, '-=0.3')
      .fromTo(arrowsRef.current, { opacity:0 }, { opacity:1, duration:0.4 }, '-=0.2')
      .fromTo(dotsRef.current, { opacity:0 }, { opacity:1, duration:0.4 }, '-=0.3');

    // Idle float on ball
    gsap.to(ballCanvasRef.current, {
      y: '-=10', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
    });

    // ── 2. THE MAIN SCRUB TRANSITION ────────────────────────────────────
    // This is the single timeline that drives everything from hero → product.
    // It is scrubbed by scroll so the user controls speed.
    //
    // Scroll track: 300vh total
    //   start: top of track hits top of viewport  (we're at scroll=0)
    //   end:   bottom of track hits bottom of viewport (scroll = 200vh worth)
    //
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: trackRef.current,
        scroller,
        start: 'top top',        // pin starts immediately
        end:   '+=200%',         // 2× viewport of scroll travel
        scrub: 1.2,
        pin: true,               // PINS the entire track so sticky content works
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    // ── Phase 1 (progress 0 → 0.35): hero UI fades out, ball grows ──────
    mainTl
      // Background text fades out
      .to(bgTextRef.current, { opacity: 0, y: -40, ease: 'power2.in' }, 0)

      // Hero UI elements scroll upward off screen
      .to(priceRef.current,   { opacity: 0, y: -60, ease: 'power2.in' }, 0)
      .to(btnRef.current,     { opacity: 0, y: -60, ease: 'power2.in' }, 0.02)
      .to(arrowsRef.current,  { opacity: 0, y: -60, ease: 'power2.in' }, 0.04)
      .to(dotsRef.current,    { opacity: 0, y: -40, ease: 'power2.in' }, 0)
      .to(nameLabelRef.current,{ opacity: 0, y: -40, ease: 'power2.in' }, 0)
      .to(glowRef.current,    { opacity: 0, ease: 'power2.in' }, 0)

      // Ball: grow from ~35vw centred → giant on right, bleeding off edge
      // Initial state: centred (translateX 0, translateY 0, scale 1 relative to its size)
      // Final state: shifted right by ~30% of viewport, scaled 2.2×, translateY -5%
      .to(ballCanvasRef.current, {
        // Move ball to right side: x shift + scale up
        xPercent: 28,          // shift right (% of its own width)
        yPercent: -8,           // slight upward shift
        scale: 2.0,             // grow large — fills right half of screen
        ease: 'power2.inOut',
        duration: 0.55,         // takes up 55% of total scroll distance
      }, 0)

    // ── Phase 2 (progress 0.35 → 1.0): product content fades in ─────────
      // Make product content visible
      .set(productContentRef.current, { visibility: 'visible' }, 0.35)

      .fromTo(eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0.38
      )
      .fromTo(headingRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, ease: 'power3.out' },
        0.42
      )
      .fromTo(taglineRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0.54
      )
      .fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.04, ease: 'power2.out' },
        0.62
      );

  }, { scope: trackRef });

  // ── Canvas sizing ───────────────────────────────────────────────────────
  // Hero size: min(44vw, viewport_height - nav - bars)
  const heroCanvasSize = 'min(44vw, calc(100vh - 40px - 80px - 160px))';

  return (
    /**
     * SCROLL TRACK — 300vh.
     * ScrollTrigger will PIN this element for 200vh of scroll.
     * Inside we have two layers of content:
     *   1. The sticky ball canvas
     *   2. Hero content (absolute, fades out)
     *   3. Product content (absolute, fades in)
     */
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height: 'calc(100vh - 40px - 80px)' }}
    >
      {/* ── BACKGROUND GLOW ─────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        <div
          className="rounded-full transition-colors duration-700"
          style={{
            width: '65vw', height: '65vw', maxWidth: '800px', maxHeight: '800px',
            background: `radial-gradient(circle, ${activeProduct.themeColor}2a 0%, transparent 68%)`,
          }}
        />
      </div>

      {/* ── BACKGROUND TEXT ─────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1
          ref={bgTextRef}
          className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity: 0.07, letterSpacing: '-0.02em', fontSize: 'clamp(64px, 18vw, 280px)' }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* ── THE BALL — sticky, centred, this is the one that moves ──── */}
      {/*
        Key: this sits at absolute inset-0 with flex centering.
        GSAP will animate scale + xPercent + yPercent on this element.
        Its initial centred position IS the hero ball position.
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={ballCanvasRef}
          className="relative pointer-events-auto"
          style={{ width: heroCanvasSize, height: heroCanvasSize, flexShrink: 0 }}
        >
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

      {/* ── HERO CONTENT — fades out on scroll ──────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Dots */}
        <div ref={dotsRef} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto" style={{ top: '24px' }}>
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => handleSelect(i)}
              aria-label={p.name}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? '26px' : '8px', height: '8px',
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
          {/* Price */}
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
            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.18 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.18 })}
          >
            Add to Cart
          </button>

          {/* Arrows */}
          <div ref={arrowsRef} className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border: '1px solid #333' }}
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

      {/* ── PRODUCT CONTENT — invisible until scroll triggers it ───── */}
      <div
        ref={productContentRef}
        className="absolute inset-0 z-15 flex items-center pointer-events-none"
        style={{
          visibility: 'hidden',
          // Left half only — ball is on right
          paddingLeft: '56px',
          paddingRight: '50%',
        }}
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
            className="font-body text-[#777] mt-6 mb-12 leading-relaxed"
            style={{ fontSize: '15px', maxWidth: '360px' }}
          >
            Engineered with microscopic composite channels for unparalleled grip.
            Texture optimised for precision handling.
          </p>

          <div
            ref={statsRef}
            className="grid grid-cols-3 border-t"
            style={{ borderColor: '#1e1e1e', maxWidth: '480px' }}
          >
            {[
              { value: '100%',  label: 'Composite'    },
              { value: '0.5mm', label: 'Pebble Depth'  },
              { value: '1.2mm', label: 'Channels'      },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col pt-5"
                style={{
                  paddingLeft: i > 0 ? '16px' : 0,
                  paddingRight: '16px',
                  borderRight: i < 2 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                <span className="font-heading text-white" style={{ fontSize: 'clamp(24px, 2.2vw, 36px)', letterSpacing: '-0.02em' }}>
                  {s.value}
                </span>
                <span className="font-heading uppercase mt-2" style={{ fontSize: '9px', color: '#555', letterSpacing: '0.22em' }}>
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