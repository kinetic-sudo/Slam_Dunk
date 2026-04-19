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

export default function HeroProductSection() {
  const trackRef     = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);

  // ballRef: ONLY receives GSAP scroll transforms (scale, xPercent)
  // NO y animation ever touches this element
  const ballRef      = useRef<HTMLDivElement>(null);

  // floatTween: stored so we can kill it when scroll starts and restart on scroll end
  const floatTween   = useRef<gsap.core.Tween | null>(null);

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

    // ── 2. Idle float — on ballRef but ONLY y, and killed when scroll starts ─
    // We animate y on ballRef directly (not a child wrapper).
    // When scroll starts we kill & reset this tween so the scrub has a clean y:0.
    // Note: the scrub timeline never animates y, so there is NO conflict.
    const startFloat = () => {
      floatTween.current = gsap.to(ballRef.current, {
        y: -10,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    };

    startFloat();

    // ── 3. Scroll scrub ───────────────────────────────────────────────────
    /*
     * KEY FIXES vs previous versions:
     *
     * A) scrub: true  →  perfect 1:1 direct scroll-to-animation mapping.
     *    No lerp lag. The browser's own scroll momentum handles smoothness.
     *    With a WebGL canvas inside, lerp-based scrub adds a conflicting
     *    animation loop that fights the GPU render cadence → jitter.
     *
     * B) Float tween is KILLED on scroll start, y reset to 0.
     *    The accumulated y from the repeating float was dragging the ball
     *    downward during scrub. Killing it + resetting y:0 prevents this.
     *
     * C) scale: 1.6 (down from 1.85).
     *    At 28vw base, scale 1.85 → 52vw, which overshoots vertically on
     *    16:9 screens. 1.6 → 45vw, which fills the right half with the ball
     *    vertically centred and equal top/bottom bleed — matching reference.
     *
     * D) xPercent: 90 (down from 100).
     *    xPercent 100 = +28vw shift → ball centre at 78vw.
     *    But with scale:1.6 the ball is 45vw wide, half = 22.5vw.
     *    78 + 22.5 = 100.5vw → only 0.5vw bleed. Looks flush, not bleeding.
     *    xPercent 90 = +25.2vw → centre at 75.2vw → right edge at 97.7vw
     *    → bleeds 2.3vw off right. Matches reference perfectly.
     *
     * E) end: '+=100%' stays — one scroll gesture completes the transition.
     */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trackRef.current,
        scroller,
        start: 'top top',
        end: '+=100%',
        scrub: true,          // TRUE = direct 1:1, zero lag, zero jitter
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onStart: () => {
          // Kill float and snap y back to 0 so scrub starts from clean state
          if (floatTween.current) {
            floatTween.current.kill();
            floatTween.current = null;
          }
          gsap.set(ballRef.current, { y: 0 });
        },
        onLeaveBack: () => {
          // User scrolled back to top — restart the idle float
          startFloat();
        },
      },
    });

    // ── Hero UI exits (progress 0 → ~0.4) ────────────────────────────────
    tl
      .to(bgTextRef.current,    { opacity:0, y:-24, ease:'power2.in', duration:0.38 }, 0)
      .to(dotsRef.current,      { opacity:0, y:-16, ease:'power2.in', duration:0.28 }, 0)
      .to(nameLabelRef.current, { opacity:0,        ease:'power2.in', duration:0.22 }, 0)
      .to(glowRef.current,      { opacity:0,        ease:'power2.in', duration:0.32 }, 0)
      .to(priceRef.current,     { opacity:0, y:-40, ease:'power2.in', duration:0.26 }, 0.05)
      .to(btnRef.current,       { opacity:0, y:-40, ease:'power2.in', duration:0.26 }, 0.07)
      .to(arrowsRef.current,    { opacity:0, y:-40, ease:'power2.in', duration:0.26 }, 0.09)

      // ── Ball: ONE fromTo, scale + xPercent only. y is NEVER touched. ──
      .fromTo(ballRef.current,
        { scale:1,   xPercent:0  },
        { scale:1.6, xPercent:90, ease:'power2.inOut', duration:0.62 },
        0
      )

    // ── Product content enters (progress 0.50 → 1.0) ─────────────────────
      .set(productContentRef.current, { visibility:'visible' }, 0.50)
      .fromTo(eyebrowRef.current,
        { opacity:0, y:12 }, { opacity:1, y:0, ease:'power2.out', duration:0.16 }, 0.52)
      .fromTo(headingRef.current,
        { opacity:0, x:-36 }, { opacity:1, x:0, ease:'power3.out', duration:0.20 }, 0.56)
      .fromTo(taglineRef.current,
        { opacity:0, y:10 }, { opacity:1, y:0, ease:'power2.out', duration:0.16 }, 0.68)
      .fromTo(
        statsRef.current?.children ? Array.from(statsRef.current.children) : [],
        { opacity:0, y:14 },
        { opacity:1, y:0, stagger:0.03, ease:'power2.out', duration:0.14 },
        0.76
      );

  }, { scope: trackRef });

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      // overflow:clip — does NOT create a scroll context (unlike hidden),
      // so it won't break ScrollTrigger pin measurements.
      style={{ height:'calc(100vh - 40px - 80px)', overflow:'clip' }}
    >

      {/* GLOW */}
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="rounded-full transition-colors duration-700"
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

      {/* ── BALL ──────────────────────────────────────────────────────────
          Base size: 28vw.
          Scrub animates: scale (1→1.6), xPercent (0→90).
          y is NEVER animated by scrub — only by the float tween which is
          killed before scrub starts.

          Final state geometry:
            scale 1.6  → rendered width = 44.8vw, radius = 22.4vw
            xPercent 90 → x shift = 0.9 × 28vw = 25.2vw
            ball centre = 50vw + 25.2vw = 75.2vw from left
            ball left edge  = 75.2 - 22.4 = 52.8vw  (text zone: 0→50vw ✓)
            ball right edge = 75.2 + 22.4 = 97.6vw  (bleeds ~2.4vw off ✓)
            ball top edge   = 50vh - 22.4×(9/16)vh = 50 - 12.6 = 37.4vh
            ball bottom edge= 50vh + 12.6 = 62.6vh  (equal bleed top/bottom ✓)
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={ballRef}
          style={{
            width:  '28vw',
            height: '28vw',
            flexShrink: 0,
            position: 'relative',
            // will-change tells the browser this element will be transformed,
            // enabling GPU compositing from frame 0 → no jank on first scroll tick
            willChange: 'transform',
          }}
        >
          <div className="w-full h-full pointer-events-auto">
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

      {/* PRODUCT CONTENT — fades in */}
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
              { value:'100%',  label:'Composite'   },
              { value:'0.5mm', label:'Pebble Depth' },
              { value:'1.2mm', label:'Channels'     },
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