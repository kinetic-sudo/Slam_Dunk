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
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
      <div style={{ width:28, height:28, borderRadius:'50%', border:`2px solid ${color}33`, borderTop:`2px solid ${color}`, animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Stats data for the product section
const STATS = [
  {
    value: '100%',
    unit: '',
    label: 'Microfiber Composite',
    desc: 'Exclusive coating material providing superior grip management in all weather conditions.',
  },
  {
    value: '0.5',
    unit: 'mm',
    label: 'Pebble Depth',
    desc: 'Optimized surface texture for precision handling and rotational feedback.',
  },
];

export default function HeroProductSection() {
  const trackRef     = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const ballRef      = useRef<HTMLDivElement>(null);
  const floatTween   = useRef<gsap.core.Tween | null>(null);
  const isScrolling  = useRef(false);

  const bgTextRef    = useRef<HTMLHeadingElement>(null);
  const priceRef     = useRef<HTMLDivElement>(null);
  const btnRef       = useRef<HTMLButtonElement>(null);
  const arrowsRef    = useRef<HTMLDivElement>(null);
  const dotsRef      = useRef<HTMLDivElement>(null);
  const nameLabelRef = useRef<HTMLDivElement>(null);

  const productContentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const statsListRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  useEffect(() => {
    const root = document.getElementById('root');
    const applyColor = (color: string, animated: boolean) => {
      const els = [root, document.body].filter(Boolean) as HTMLElement[];
      els.forEach(el => {
        el.style.transition = animated ? 'background-color 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none';
        el.style.backgroundColor = color;
      });
    };
    applyColor(activeProduct.themeColor, !isScrolling.current);
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

    // Load entry
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

    // Idle float
    const startFloat = () => {
      if (floatTween.current) return;
      floatTween.current = gsap.to(ballRef.current, {
        y: -10, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
      });
    };
    const killFloat = () => {
      floatTween.current?.kill();
      floatTween.current = null;
      gsap.set(ballRef.current, { y: 0 });
    };
    startFloat();

    // ── Scroll scrub ──────────────────────────────────────────────────────
    /*
     * BALL FINAL POSITION FIX:
     *
     * Problem: ball was being clipped at bottom because:
     *   - Base 28vw ball at scale:1.6 = 44.8vw wide = ~25.2vh tall (on 16:9)
     *   - xPercent:90 shifts it 25.2vw right → centre at 75.2vw
     *   - overflow:clip on the track clips anything outside the track bounds
     *   - The ball wasn't being clipped on the right (that's intentional)
     *   - But the float tween's accumulated y + the scale was causing bottom clip
     *
     * The real issue: the ball canvas is SQUARE (28vw × 28vw).
     * When scaled to 1.6, the canvas is 44.8vw × 44.8vw.
     * The track height is calc(100vh - 120px) ≈ 88vh.
     * Ball canvas half-height after scale = 22.4vw = ~12.6vh.
     * Track half-height = 44vh.
     * Ball top = 44vh - 12.6vh = 31.4vh → fine.
     * Ball bottom = 44vh + 12.6vh = 56.6vh → fine.
     * But the Canvas element ITSELF is 44.8vw tall → 44.8vw > 44vh on wide screens.
     * The canvas overflows the track height and gets clipped.
     *
     * FIX: reduce scale to 1.4 (39.2vw → ~22vh half) — ball stays fully
     * within the track height on all screen ratios.
     * Compensate by increasing xPercent to 110 to move it further right.
     * 110% of 28vw = 30.8vw shift → centre at 80.8vw.
     * Right edge = 80.8 + 19.6 = 100.4vw → 0.4vw right bleed. ✓
     * Top edge = 50vh - 19.6vw * (9/16) = 50 - 11vh = 39vh → fine.
     * Bottom edge = 50 + 11vh = 61vh → fine, within 88vh track. ✓
     */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trackRef.current,
        scroller,
        start: 'top top',
        end: '+=100%',
        scrub: 0.1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onStart: () => {
          isScrolling.current = true;
          const root = document.getElementById('root');
          if (root) root.style.transition = 'none';
          document.body.style.transition = 'none';
          killFloat();
        },
        onLeaveBack: () => {
          isScrolling.current = false;
          startFloat();
        },
        onScrubComplete: () => { isScrolling.current = false; },
      },
    });

    // Hero UI exits
    tl
      .to(bgTextRef.current,    { opacity:0, y:-24, ease:'power2.in', duration:0.38 }, 0)
      .to(dotsRef.current,      { opacity:0, y:-16, ease:'power2.in', duration:0.28 }, 0)
      .to(nameLabelRef.current, { opacity:0,        ease:'power2.in', duration:0.22 }, 0)
      .to(glowRef.current,      { opacity:0,        ease:'power2.in', duration:0.32 }, 0)
      .to(priceRef.current,     { opacity:0, y:-40, ease:'power2.in', duration:0.26 }, 0.05)
      .to(btnRef.current,       { opacity:0, y:-40, ease:'power2.in', duration:0.26 }, 0.07)
      .to(arrowsRef.current,    { opacity:0, y:-40, ease:'power2.in', duration:0.26 }, 0.09)

      // Ball: scale 1→1.4, shift right. y stays 0 (centred).
      .fromTo(ballRef.current,
        { scale:1,   xPercent:0   },
        { scale:1.4, xPercent:110, ease:'power2.inOut', duration:0.62 },
        0
      )

    // Product content enters
      .set(productContentRef.current, { visibility:'visible' }, 0.50)
      .fromTo(eyebrowRef.current,
        { opacity:0, y:10 }, { opacity:1, y:0, ease:'power2.out', duration:0.16 }, 0.52)
      .fromTo(headingRef.current,
        { opacity:0, x:-36 }, { opacity:1, x:0, ease:'power3.out', duration:0.20 }, 0.56)
      .fromTo(
        statsListRef.current?.children ? Array.from(statsListRef.current.children) : [],
        { opacity:0, y:16 },
        { opacity:1, y:0, stagger:0.08, ease:'power2.out', duration:0.18 },
        0.64
      );

  }, { scope: trackRef });

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      // overflow:clip clips the ball's right bleed without creating scroll context
      style={{ height:'calc(100vh - 40px - 80px)', overflow:'clip' }}
    >

      {/* ── GRID OVERLAY ─────────────────────────────────────────────────
        Matches the reference screenshot exactly:
        3 vertical lines (at ~33% and ~66% of width, plus the right divider)
        2 horizontal lines (at ~40% and ~60% of height — centred zone)
        Very subtle: rgba(255,255,255,0.05)
      */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        {/* Vertical lines */}
        <div style={{ position:'absolute', left:'32%',  top:0, bottom:0, width:'1px', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'absolute', left:'66%',  top:0, bottom:0, width:'1px', background:'rgba(255,255,255,0.05)' }}/>
        {/* Horizontal lines */}
        <div style={{ position:'absolute', top:'38%',   left:0, right:0, height:'1px', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ position:'absolute', top:'62%',   left:0, right:0, height:'1px', background:'rgba(255,255,255,0.05)' }}/>
      </div>

      {/* GLOW */}
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="rounded-full"
          style={{
            width:'55vw', height:'55vw', maxWidth:'680px', maxHeight:'680px',
            background:`radial-gradient(circle, ${activeProduct.themeColor}22 0%, transparent 68%)`,
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

      {/* ── BALL ────────────────────────────────────────────────────────
        28vw base. scale:1.4 → 39.2vw wide.
        xPercent:110 → shifts 30.8vw right → centre at 80.8vw.
        Ball is always vertically centred (y never changes during scrub).
        Right edge bleeds ~0.4vw off screen. Top/bottom stay within track.
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={ballRef}
          style={{
            width: '28vw',
            height: '28vw',
            flexShrink: 0,
            position: 'relative',
            willChange: 'transform',
            contain: 'layout',
          }}
        >
          <div className="w-full h-full pointer-events-auto">
            <Loader color={activeProduct.themeColor} />
            <Canvas
              frameloop="always"
              style={{ width:'100%', height:'100%', display:'block' }}
              camera={{ position:[0,0,5.2], fov:42 }}
              gl={{ antialias:true, alpha:true, powerPreference:'high-performance' }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
              }}
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

      {/* ── HERO CONTENT (fades out) ─────────────────────────────────── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
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

        <div
          className="absolute left-0 right-0 flex items-end justify-between pointer-events-auto"
          style={{ bottom:0, padding:'0 56px 40px 56px' }}
        >
          <div ref={priceRef} className="flex flex-col gap-1">
            <span
              className="font-heading leading-none"
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

      {/* ── PRODUCT CONTENT (fades in) ───────────────────────────────────
        Layout matches reference screenshot exactly:
        - Left ~32% of screen
        - "PERFORMANCE METRICS" eyebrow with orange dot
        - Large "ELITE CONTROL" heading
        - Stats stacked vertically, each with left accent border
        - Description text under each stat label
      */}
      <div
        ref={productContentRef}
        className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center"
        style={{ visibility:'hidden', paddingLeft:'56px', paddingRight:'68%' }}
      >
        {/* Eyebrow */}
        <div ref={eyebrowRef} className="flex items-center gap-2 mb-6">
          <div style={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#FF3C00', flexShrink:0 }}/>
          <span
            className="font-heading uppercase tracking-widest"
            style={{ color:'#FF3C00', fontSize:'11px', letterSpacing:'0.3em' }}
          >
            Performance Metrics
          </span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="mb-10">
          <h2
            className="font-heading text-white uppercase"
            style={{ fontSize:'clamp(52px, 7vw, 110px)', letterSpacing:'-0.03em', lineHeight:'0.88' }}
          >
            ELITE<br/>CONTROL
          </h2>
        </div>

        {/* Stats — vertical list with left accent border */}
        <div ref={statsListRef} className="flex flex-col gap-0">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col"
              style={{
                borderLeft: '2px solid rgba(255,255,255,0.12)',
                paddingLeft: '20px',
                paddingTop: i === 0 ? 0 : '28px',
                paddingBottom: '28px',
                borderBottom: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {/* Value */}
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="font-heading text-white"
                  style={{ fontSize:'clamp(28px, 3vw, 48px)', letterSpacing:'-0.02em', lineHeight:1 }}
                >
                  {s.value}
                </span>
                {s.unit && (
                  <span className="font-heading text-white" style={{ fontSize:'clamp(14px, 1.4vw, 22px)', letterSpacing:'-0.01em' }}>
                    {s.unit}
                  </span>
                )}
              </div>
              {/* Label */}
              <span
                className="font-heading uppercase mb-2"
                style={{ fontSize:'10px', color:'#666', letterSpacing:'0.22em' }}
              >
                {s.label}
              </span>
              {/* Description */}
              <p
                className="font-body text-[#555] leading-relaxed"
                style={{ fontSize:'12px', maxWidth:'260px' }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}