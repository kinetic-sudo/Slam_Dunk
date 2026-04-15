import { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import BasketballModel from './Basketball3D';

export type ActiveProduct = {
  id: string;
  name: string;
  price: string;
  themeColor: string;
  ballColor: string;
  seamColor: string;
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
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `2px solid ${color}33`,
        borderTop: `2px solid ${color}`,
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function HeroSection() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const bgTextRef     = useRef<HTMLHeadingElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const priceRef      = useRef<HTMLDivElement>(null);
  const arrowsRef     = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const activeProduct = products[activeIndex];

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = activeProduct.themeColor;
    document.body.style.backgroundColor = activeProduct.themeColor;
  }, [activeProduct.themeColor]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 0.07, scale: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo(canvasWrapRef.current,
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)' },
      '-=0.7'
    )
    .fromTo(priceRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(btnRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(arrowsRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 },
      '-=0.2'
    );

    gsap.to(canvasWrapRef.current, {
      y: '-=12', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(canvasWrapRef.current,
      { scale: 0.92, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2)' }
    );
    gsap.fromTo(bgTextRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 0.07, scale: 1, duration: 0.45, ease: 'power2.out' }
    );
    gsap.fromTo(priceRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    );
    setActiveIndex(index);
  }, [activeIndex]);

  const handlePrev = () => handleSelect((activeIndex - 1 + products.length) % products.length);
  const handleNext = () => handleSelect((activeIndex + 1) % products.length);

  const canvasSize = 'min(62vw, calc(100vh - 40px - 80px - 140px))';

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#111111]"
      style={{ height: 'calc(100vh - 40px - 80px)', overflow: 'hidden' }}
    >
      {/* Giant background name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          ref={bgTextRef}
          className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{ opacity: 0.07, letterSpacing: '-0.02em', fontSize: 'clamp(64px, 18vw, 280px)' }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="rounded-full transition-all duration-700"
          style={{
            width: '65vw', height: '65vw', maxWidth: '800px', maxHeight: '800px',
            background: `radial-gradient(circle, ${activeProduct.themeColor}2a 0%, transparent 68%)`,
          }}
        />
      </div>

      {/* Dots */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-3" style={{ top: '24px' }}>
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

      {/*
        ── 3D Canvas ────────────────────────────────────────────────────
        FIX: absolute + inset-0 + flex-center means the ball is centred
        at pixel 0 before any JS runs — no layout jump.
      */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div
          ref={canvasWrapRef}
          className="relative pointer-events-auto"
          style={{ width: canvasSize, height: canvasSize }}
        >
          {!modelLoaded && <Loader color={activeProduct.themeColor} />}

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

            {/* studio gives the metallic gloss from screenshot 2 */}
            <Environment preset="studio" />

            <Suspense fallback={null}>
              <BasketballModel
                activeProduct={activeProduct}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute left-0 right-0 z-20 flex items-end justify-between"
        style={{ bottom: 0, padding: '0 56px 40px 56px' }}
      >
        {/* Price */}
        <div ref={priceRef} className="flex flex-col items-start gap-1">
          <span
            className="font-heading leading-none transition-colors duration-500"
            style={{ color: activeProduct.themeColor, fontSize: 'clamp(24px, 4vw, 56px)', letterSpacing: '-0.02em' }}
          >
            {activeProduct.price}
          </span>
          <span className="font-body uppercase" style={{ fontSize: '9px', color: '#555', letterSpacing: '0.2em' }}>
            Pay in 4 installments
          </span>
        </div>

        {/* CTA */}
        <button
          ref={btnRef}
          className="font-heading uppercase rounded-sm transition-all duration-300"
          style={{
            backgroundColor: activeProduct.themeColor,
            color: '#fff',
            boxShadow: `0 8px 32px ${activeProduct.themeColor}55`,
            fontSize: 'clamp(11px, 0.85vw, 13px)',
            padding: '22px clamp(28px, 3.5vw, 56px)',
            letterSpacing: '0.22em',
          }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.18 });
            (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 44px ${activeProduct.themeColor}88`;
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.18 });
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${activeProduct.themeColor}55`;
          }}
        >
          Add to Cart
        </button>

        {/* Nav arrows */}
        <div ref={arrowsRef} className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors"
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
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ border: `1px solid ${activeProduct.themeColor}` }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Product name label */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none" style={{ bottom: '112px' }}>
        <span className="font-heading uppercase text-[#3a3a3a] tracking-[0.28em]" style={{ fontSize: '10px' }}>
          {activeProduct.name}
        </span>
      </div>
    </section>
  );
}