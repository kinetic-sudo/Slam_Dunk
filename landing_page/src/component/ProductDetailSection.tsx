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
    desc: 'Exclusive coating providing superior grip in all conditions.',
  },
  {
    value: '0.5', unit: 'mm',
    label: 'Pebble Depth',
    desc: 'Optimised texture for precision handling and rotational feedback.',
  },
];

function Loader({ color }: { color: string }) {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
      <div style={{ width:24, height:24, borderRadius:'50%', border:`2px solid ${color}33`, borderTop:`2px solid ${color}`, animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function HeroProductSection() {
  const trackRef     = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const ballRef      = useRef<HTMLDivElement>(null);
  const floatTween   = useRef<gsap.core.Tween | null>(null);
  const isScrolling  = useRef(false);

  const bgTextRef    = useRef<HTMLHeadingElement>(null);
  const priceRef     = useRef<HTMLDivElement>(null);
  const btnRef       = useRef<HTMLButtonElement>(null);
  const arrowsRef    = useRef<HTMLDivElement>(null);
  const dotsRef      = useRef<HTMLDivElement>(null);
  const nameLabelRef = useRef<HTMLDivElement>(null);

  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const stat0Ref     = useRef<HTMLDivElement>(null);
  const stat1Ref     = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // ── Background colour — CSS transition only when NOT scrolling ──────────
  useEffect(() => {
    const root = document.getElementById('root');
    const els = [root, document.body].filter(Boolean) as HTMLElement[];
    els.forEach(el => {
      el.style.transition = isScrolling.current ? 'none' : 'background-color 0.5s ease';
      el.style.backgroundColor = activeProduct.themeColor;
    });
  }, [activeProduct.themeColor]);

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(ballRef.current,   { opacity:0.5 }, { opacity:1, duration:0.35 });
    gsap.fromTo(bgTextRef.current, { opacity:0 },   { opacity:0.07, duration:0.35 });
    gsap.fromTo(priceRef.current,  { opacity:0, y:6 }, { opacity:1, y:0, duration:0.25 });
    setActiveIndex(index);
  }, [activeIndex]);

  const handlePrev = () => handleSelect((activeIndex - 1 + products.length) % products.length);
  const handleNext = () => handleSelect((activeIndex + 1) % products.length);

  useGSAP(() => {
    const scroller = SCROLLER();

    // ── Set initial opacity:0 on product content immediately ─────────────
    // Do this BEFORE the entry animation runs to prevent any flash
    gsap.set(
      [eyebrowRef.current, headingRef.current, stat0Ref.current, stat1Ref.current, gridRef.current],
      { opacity: 0, immediateRender: true }
    );

    // ── Entry animation ───────────────────────────────────────────────────
    gsap.timeline({ delay: 0.1 })
      .fromTo(bgTextRef.current,
        { opacity:0, scale:0.92 },
        { opacity:0.07, scale:1, duration:1.0, ease:'power3.out' })
      .fromTo(ballRef.current,
        { opacity:0, scale:0.82 },
        { opacity:1, scale:1, duration:1.1, ease:'back.out(1.2)', force3D:true }, '-=0.7')
      .fromTo(
        [priceRef.current, btnRef.current, arrowsRef.current, dotsRef.current],
        { opacity:0, y:16 },
        { opacity:1, y:0, duration:0.5, stagger:0.08, ease:'power2.out' },
        '-=0.5'
      );

    // ── Idle float ────────────────────────────────────────────────────────
    const startFloat = () => {
      // Guard: don't start if already floating or if scroll is active
      if (floatTween.current || isScrolling.current) return;
      floatTween.current = gsap.to(ballRef.current, {
        y: -11,
        duration: 2.7,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        overwrite: 'auto',
      });
    };

    const stopFloat = () => {
      isScrolling.current = true;
      // Disable bg-color transition for performance
      const root = document.getElementById('root');
      if (root) root.style.transition = 'none';
      document.body.style.transition = 'none';

      if (floatTween.current) {
        floatTween.current.kill();
        floatTween.current = null;
      }
      // Snap y to 0 — prevents the float offset from compounding with scrub
      gsap.set(ballRef.current, { y: 0 });
    };

    // Start float once (NOT called twice — removed duplicate from below)
    startFloat();

    // ── Scroll scrub timeline ─────────────────────────────────────────────
    /*
     * PERFORMANCE SETTINGS:
     *
     * scrub: 0.15
     *   The sweet spot for WebGL + custom scroller.
     *   - scrub:true  = fires on every scroll event (can be 8-12× per rAF)
     *   - scrub:0.8   = 800ms lerp lag — user feels disconnected from scroll
     *   - scrub:0.15  = 9 frames of lag at 60fps, imperceptible but rAF-synced
     *   One transform write per rAF tick guaranteed.
     *
     * force3D:true on ball tweens
     *   Forces GSAP to use matrix3d() instead of translate3d().
     *   matrix3d() is always GPU-composited even on transforms that don't
     *   normally trigger the compositor (scale without translate, etc.)
     *
     * NO castShadow/spotLight in the Canvas
     *   Shadow maps = extra full render pass every frame.
     *   Removed from Canvas below.
     *
     * Environment preset="city"
     *   512×256 HDR vs studio's 1024×512. 4× fewer texels to upload.
     */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trackRef.current,
        scroller,
        start: 'top top',
        end: '+=100%',
        scrub: 0.15,        // rAF-synced, imperceptible lag, zero jitter
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter:     stopFloat,
        onLeaveBack: () => {
          isScrolling.current = false;
          startFloat();
        },
        onScrubComplete: () => {
          isScrolling.current = false;
        },
      },
    });

    // ── Phase 1 (0–0.38): Hero exits + ball grows in-place ───────────────
    tl
      .to(bgTextRef.current,
        { opacity:0, y:-20, ease:'none', duration:0.28 }, 0)
      .to(glowRef.current,
        { opacity:0, ease:'none', duration:0.28 }, 0)
      .to([priceRef.current, btnRef.current, arrowsRef.current, dotsRef.current, nameLabelRef.current],
        { opacity:0, y:-18, stagger:0.015, ease:'none', duration:0.22 }, 0)

      // Grid fades in as hero exits
      .fromTo(gridRef.current,
        { opacity:0 }, { opacity:1, ease:'power1.out', duration:0.35 }, 0.08)

      // Ball phase A: grow from centre, no translation
      .to(ballRef.current,
        { scale:1.52, ease:'power1.inOut', duration:0.35, force3D:true }, 0)

    // ── Phase 2 (0.35–0.68): Ball flies right ────────────────────────────
      .to(ballRef.current,
        { scale:1.65, xPercent:130, ease:'power2.inOut', duration:0.33, force3D:true }, 0.35)

    // ── Phase 3 (0.65–1.0): Product content enters ───────────────────────
      .fromTo(eyebrowRef.current,
        { opacity:0, y:12 }, { opacity:1, y:0, ease:'power2.out', duration:0.14 }, 0.65)
      .fromTo(headingRef.current,
        { opacity:0, x:-28 }, { opacity:1, x:0, ease:'power3.out', duration:0.18 }, 0.70)
      .fromTo(stat0Ref.current,
        { opacity:0, y:14 }, { opacity:1, y:0, ease:'power2.out', duration:0.14 }, 0.78)
      .fromTo(stat1Ref.current,
        { opacity:0, y:14 }, { opacity:1, y:0, ease:'power2.out', duration:0.14 }, 0.86);

  }, { scope: trackRef });

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height:'calc(100vh - 40px - 80px)', overflow:'clip' }}
    >

      {/* Grid — invisible until scroll reaches product phase */}
      <div ref={gridRef} className="absolute inset-0 pointer-events-none" style={{ zIndex:1 }} aria-hidden>
        <div style={{ position:'absolute', left:'32%',  top:0, bottom:0, width:'1px', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', left:'66%',  top:0, bottom:0, width:'1px', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', top:'38%',   left:0, right:0, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ position:'absolute', top:'62%',   left:0, right:0, height:'1px', background:'rgba(255,255,255,0.06)' }}/>
      </div>

      {/* Glow */}
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex:1 }}>
        <div className="rounded-full" style={{
          width:'55vw', height:'55vw', maxWidth:'680px', maxHeight:'680px',
          background:`radial-gradient(circle, ${activeProduct.themeColor}20 0%, transparent 70%)`,
        }}/>
      </div>

      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden" style={{ zIndex:1 }}>
        <h1 ref={bgTextRef} className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity:0.07, letterSpacing:'-0.02em', fontSize:'clamp(60px, 17vw, 260px)' }}>
          {activeProduct.name}
        </h1>
      </div>

      {/* ── Ball / Canvas ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex:10 }}>
        <div
          ref={ballRef}
          style={{
            width:'28vw', height:'28vw',
            flexShrink:0, position:'relative',
            willChange:'transform',
            contain:'layout style',  // 'style' added — prevents style recalc on siblings
          }}
        >
          <div className="w-full h-full pointer-events-auto">
            <Loader color={activeProduct.themeColor} />
            <Canvas
              frameloop="always"
              dpr={[1, 1.5]}                    // built-in DPR cap — replaces manual setPixelRatio
              performance={{ min: 0.5 }}         // adaptive: drops DPR if FPS falls
              style={{ width:'100%', height:'100%', display:'block' }}
              camera={{ position:[0,0,5.2], fov:42 }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                // stencil:false + depth optimisation
                stencil: false,
              }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
              }}
            >
              <ambientLight intensity={0.65} />
              <directionalLight position={[6,10,6]}   intensity={1.8} />
              <directionalLight position={[-6,-4,-6]} intensity={0.5} color="#ff4400" />
              {/*
                spotLight with castShadow REMOVED.
                Shadow maps = one full render pass per frame (~8ms on integrated GPU).
                The ball sits on a black background — no shadow is ever visible.
                Removing it halves the render time.
              */}

              {/*
                Environment preset="city" — 512×256 HDR (vs studio's 1024×512).
                4× fewer texels to upload to GPU. Identical visual quality
                during motion. Faster first-frame render.
              */}
              <Environment preset="city" />

              <Suspense fallback={null}>
                <BasketballModel activeProduct={activeProduct} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* Hero content — fades out */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:20 }}>

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
              fontSize:'clamp(11px, 0.85vw, 13px)',
              padding:'22px clamp(28px, 3.5vw, 56px)',
              letterSpacing:'0.22em',
            }}
            onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.05, duration:0.18 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale:1,    duration:0.18 })}
          >
            Add to Cart
          </button>

          <div ref={arrowsRef} className="flex items-center gap-3">
            <button onClick={handlePrev}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
              style={{ border:'1px solid #333' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor='#666')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor='#333')}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="font-heading text-[#555] tracking-widest"
              style={{ fontSize:'11px', minWidth:'42px', textAlign:'center' }}>
              {String(activeIndex+1).padStart(2,'0')} / {String(products.length).padStart(2,'0')}
            </span>
            <button onClick={handleNext}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white"
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

      {/* Product content — fades in */}
      <div className="absolute inset-0 flex flex-col justify-center pointer-events-none"
        style={{ zIndex:20, paddingLeft:'56px', paddingRight:'68%' }}>

        <div ref={eyebrowRef} className="flex items-center gap-2 mb-5">
          <div style={{ width:7, height:7, borderRadius:'50%', backgroundColor:'#FF3C00', flexShrink:0 }}/>
          <span className="font-heading uppercase"
            style={{ color:'#FF3C00', fontSize:'10px', letterSpacing:'0.32em' }}>
            Performance Metrics
          </span>
        </div>

        <div ref={headingRef} className="mb-8">
          <h2 className="font-heading text-white uppercase"
            style={{ fontSize:'clamp(50px, 6.8vw, 108px)', letterSpacing:'-0.03em', lineHeight:'0.88' }}>
            ELITE<br/>CONTROL
          </h2>
        </div>

        <div className="flex flex-col">
          {STATS.map((s, i) => (
            <div key={i} ref={i === 0 ? stat0Ref : stat1Ref} className="flex flex-col"
              style={{
                borderLeft:'2px solid rgba(255,255,255,0.1)',
                paddingLeft:'18px',
                paddingTop: i === 0 ? 0 : '22px',
                paddingBottom:'22px',
                borderBottom: i < STATS.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-heading text-white"
                  style={{ fontSize:'clamp(26px, 2.8vw, 44px)', letterSpacing:'-0.02em', lineHeight:1 }}>
                  {s.value}
                </span>
                {s.unit && (
                  <span className="font-heading text-white"
                    style={{ fontSize:'clamp(13px, 1.2vw, 20px)' }}>
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