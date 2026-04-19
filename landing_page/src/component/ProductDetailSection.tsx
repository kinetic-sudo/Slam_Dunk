/**
 * HeroProductSection — replaces BOTH HeroSection and ProductDetailsSection.
 * Single Canvas, single scroll-pin, zero flicker.
 *
 * App.tsx should render this component directly after NavigationBar.
 * Remove any separate <HeroSection /> import from App.tsx.
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

const STATS = [
  {
    value: '100%', unit: '',
    label: 'Microfiber Composite',
    desc: 'Exclusive coating material providing superior grip management in all weather conditions.',
  },
  {
    value: '0.5', unit: 'mm',
    label: 'Pebble Depth',
    desc: 'Optimized surface texture for precision handling and rotational feedback.',
  },
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
  const gridRef      = useRef<HTMLDivElement>(null);   // grid — hidden in hero, visible in product
  const ballRef      = useRef<HTMLDivElement>(null);
  const floatTween   = useRef<gsap.core.Tween | null>(null);
  const isScrolling  = useRef(false);

  // Hero content
  const bgTextRef    = useRef<HTMLHeadingElement>(null);
  const priceRef     = useRef<HTMLDivElement>(null);
  const btnRef       = useRef<HTMLButtonElement>(null);
  const arrowsRef    = useRef<HTMLDivElement>(null);
  const dotsRef      = useRef<HTMLDivElement>(null);
  const nameLabelRef = useRef<HTMLDivElement>(null);

  // Product content — all start invisible, fade in via scrub
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const stat0Ref     = useRef<HTMLDivElement>(null);
  const stat1Ref     = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // Background colour — no CSS transition during scroll
  useEffect(() => {
    const root = document.getElementById('root');
    const animated = !isScrolling.current;
    const els = [root, document.body].filter(Boolean) as HTMLElement[];
    els.forEach(el => {
      el.style.transition = animated ? 'background-color 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none';
      el.style.backgroundColor = activeProduct.themeColor;
    });
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

    // ── Entry Animation (Time-based) ─────────────────────────────
    gsap.timeline()
      .fromTo(bgTextRef.current,
        { opacity: 0, scale: 0.92 }, 
        { opacity: 0.07, scale: 1, duration: 1.2, ease: 'power3.out' })
      .fromTo(ballRef.current,
        { opacity: 0, scale: 0.82 }, 
        { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.2)', force3D: true }, '-=0.8')
      .fromTo([priceRef.current, btnRef.current, arrowsRef.current, dotsRef.current],
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5');

    // ── 1. IMPROVED FLOAT LOGIC ──────────────────────────────────────────
    const startFloat = () => {
      if (floatTween.current) return;
      floatTween.current = gsap.to(ballRef.current, {
        y: -12,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        overwrite: 'auto'
  });
    };
  
    const stopFloat = () => {
      if (!floatTween.current) return;
      floatTween.current.kill();
      floatTween.current = null;
      // Animate to 0 instead of snapping
      gsap.to(ballRef.current, { y: 0, duration: 0.4, ease: 'power2.out' });
    };


    startFloat();

    // ── 2. OPTIMIZED SCROLL TIMELINE ──────────────────────────────────────
      const scroller = SCROLLER();
      
      // Start floating immediately
      startFloat();
  
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          scroller,
          start: 'top top',
          end: '+=100%',
          scrub: 0.8, // Slightly increased scrub for smoother feel
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onEnter: () => stopFloat(),
          onLeaveBack: () => startFloat(),
        },
      })
    

    // ── UI Exits (Hero Mode) ──────────────────────────────────────────────
    // Use 'none' or 'power1.inOut' for UI elements so they feel pinned to the finger
    tl.to(bgTextRef.current,    { opacity: 0, y: -40, ease: 'none', duration: 0.3 }, 0)
      .to(glowRef.current,      { opacity: 0, scale: 0.8, ease: 'none', duration: 0.3 }, 0)
      .to([priceRef.current, btnRef.current, arrowsRef.current, dotsRef.current, nameLabelRef.current], 
        { opacity: 0, y: -20, stagger: 0.02, ease: 'none', duration: 0.25 }, 0)

      // Grid Fade-in
      .fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, ease: 'power1.inOut', duration: 0.4 }, 0.1)

      // ── Ball Animation (The "Breathe and Fly" Motion) ──────────────────
      // Phase A: Scale up in center
      .to(ballRef.current, { 
        scale: 1.52, 
        ease: 'power1.inOut', 
        duration: 0.4,
        force3D: true 
      }, 0)
      // Phase B: Fly to the right
      .to(ballRef.current, { 
        scale: 1.65, 
        xPercent: 130, 
        ease: 'power2.inOut', 
        duration: 0.4,
        force3D: true 
      }, 0.35)

      // ── Product Content Entrance ────────────────────────── ────────────
      .fromTo(eyebrowRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.15 }, 0.65)
      .fromTo(headingRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.2 }, 0.70)
      .fromTo(stat0Ref.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.15 }, 0.78)
      .fromTo(stat1Ref.current,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.15 }, 0.85);

    // Initial state for product content (Ensures no flash on load)
    gsap.set([eyebrowRef.current, headingRef.current, stat0Ref.current, stat1Ref.current, gridRef.current], {
      opacity: 0,
    });

  },{scope: trackRef});
 

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height:'calc(100vh - 40px - 80px)', overflow:'clip' }}
    >

      {/* ── GRID — starts invisible, fades in during scrub ───────────────
        Only appears in the product state. z:1 so it sits above background
        but below all content.
      */}
      <div ref={gridRef} className="absolute inset-0 pointer-events-none" style={{ zIndex:1 }} aria-hidden>
        <div style={{ position:'absolute', left:'32%',  top:0, bottom:0, width:'1px', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', left:'66%',  top:0, bottom:0, width:'1px', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', top:'38%',   left:0, right:0, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', top:'62%',   left:0, right:0, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
      </div>

      {/* GLOW */}
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex:1 }}>
        <div className="rounded-full" style={{
          width:'55vw', height:'55vw', maxWidth:'680px', maxHeight:'680px',
          background:`radial-gradient(circle, ${activeProduct.themeColor}22 0%, transparent 68%)`,
        }}/>
      </div>

      {/* BG TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex:1 }}>
        <h1 ref={bgTextRef} className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity:0.07, letterSpacing:'-0.02em', fontSize:'clamp(60px, 17vw, 260px)' }}>
          {activeProduct.name}
        </h1>
      </div>

      {/* ── BALL ─────────────────────────────────────────────────────────
        Base 28vw. Centred via flex.
        Phase A scrub: scale 1→1.52 (no movement)
        Phase B scrub: scale 1.52→1.65, xPercent 0→130
        y is NEVER touched by scrub (only by float tween, killed before scrub).
        will-change + contain:layout = GPU compositing from frame 0.
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex:10 }}>
        <div ref={ballRef} style={{
          width:'28vw', height:'28vw', flexShrink:0, position:'relative',
          willChange:'transform', contain:'layout',
        }}>
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

      {/* ── HERO CONTENT (fades out on scrub) ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:20 }}>

        {/* Dots */}
        <div ref={dotsRef} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto" style={{ top:'24px' }}>
          {products.map((p, i) => (
            <button key={p.id} onClick={() => handleSelect(i)} aria-label={p.name}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? '26px' : '8px', height:'8px',
                backgroundColor: i === activeIndex ? p.themeColor : '#2a2a2a',
                border:`1px solid ${i === activeIndex ? p.themeColor : '#444'}`,
              }}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="absolute left-0 right-0 flex items-end justify-between pointer-events-auto"
          style={{ bottom:0, padding:'0 56px 40px 56px' }}>

          <div ref={priceRef} className="flex flex-col gap-1">
            <span className="font-heading leading-none"
              style={{ color:activeProduct.themeColor, fontSize:'clamp(24px, 4vw, 56px)', letterSpacing:'-0.02em' }}>
              {activeProduct.price}
            </span>
            <span className="font-body uppercase" style={{ fontSize:'9px', color:'#555', letterSpacing:'0.2em' }}>
              Size 29.5" · Official
            </span>
          </div>

          <button ref={btnRef} className="font-heading uppercase rounded-sm"
            style={{
              backgroundColor:activeProduct.themeColor, color:'#fff',
              boxShadow:`0 8px 32px ${activeProduct.themeColor}55`,
              fontSize:'clamp(11px, 0.85vw, 13px)', padding:'22px clamp(28px, 3.5vw, 56px)', letterSpacing:'0.22em',
            }}
            onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.05, duration:0.18 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale:1,    duration:0.18 })}
          >
            Add to Cart
          </button>

          <div ref={arrowsRef} className="flex items-center gap-3">
            <button onClick={handlePrev} className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border:'1px solid #333' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor='#666')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor='#333')}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="font-heading text-[#555] tracking-widest" style={{ fontSize:'11px', minWidth:'42px', textAlign:'center' }}>
              {String(activeIndex+1).padStart(2,'0')} / {String(products.length).padStart(2,'0')}
            </span>
            <button onClick={handleNext} className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border:`1px solid ${activeProduct.themeColor}` }}>
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

      {/* ── PRODUCT CONTENT ────────────────────────────────────────────
        All elements start at opacity:0 (set in useGSAP).
        NO visibility:hidden — avoids the flash-on-show artefact.
        Constrained to left ~32% via paddingRight:68%.
        Ball centre is at 86vw, left edge at 63vw — safe.
      */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none"
        style={{ zIndex:20, paddingLeft:'56px', paddingRight:'68%' }}>

        {/* Eyebrow */}
        <div ref={eyebrowRef} className="flex items-center gap-2 mb-5">
          <div style={{ width:7, height:7, borderRadius:'50%', backgroundColor:'#FF3C00', flexShrink:0 }}/>
          <span className="font-heading uppercase" style={{ color:'#FF3C00', fontSize:'10px', letterSpacing:'0.32em' }}>
            Performance Metrics
          </span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="mb-8">
          <h2 className="font-heading text-white uppercase"
            style={{ fontSize:'clamp(50px, 6.8vw, 108px)', letterSpacing:'-0.03em', lineHeight:'0.88' }}>
            ELITE<br/>CONTROL
          </h2>
        </div>

        {/* Stats */}
        <div className="flex flex-col">
          {STATS.map((s, i) => (
            <div key={i} ref={i === 0 ? stat0Ref : stat1Ref} className="flex flex-col"
              style={{
                borderLeft:'2px solid rgba(255,255,255,0.1)',
                paddingLeft:'18px',
                paddingTop: i === 0 ? 0 : '24px',
                paddingBottom:'24px',
                borderBottom: i < STATS.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading text-white"
                  style={{ fontSize:'clamp(26px, 2.8vw, 44px)', letterSpacing:'-0.02em', lineHeight:1 }}>
                  {s.value}
                </span>
                {s.unit && (
                  <span className="font-heading text-white"
                    style={{ fontSize:'clamp(13px, 1.2vw, 20px)', letterSpacing:'-0.01em' }}>
                    {s.unit}
                  </span>
                )}
              </div>
              <span className="font-heading uppercase mb-1"
                style={{ fontSize:'9px', color:'#555', letterSpacing:'0.22em' }}>
                {s.label}
              </span>
              <p className="font-body text-[#444] leading-relaxed"
                style={{ fontSize:'11px', maxWidth:'240px' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
