import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const products = [
  { id: "spaing",  name: "SPAING",  price: "$34.99", themeColor: "#FF3C00", exposure: "1.0" },
  { id: "vertex",  name: "VERTEX",  price: "$49.99", themeColor: "#00FF4D", exposure: "0.9" },
  { id: "nebula",  name: "NEBULA",  price: "$59.99", themeColor: "#00CFFF", exposure: "0.9" },
  { id: "inferno", name: "INFERNO", price: "$64.99", themeColor: "#cc0000", exposure: "0.8" },
  { id: "stealth", name: "STEALTH", price: "$79.99", themeColor: "#ff0055", exposure: "1.0" },
];

// Inject model-viewer script once
function useModelViewerScript() {
  useEffect(() => {
    if (document.querySelector('script[data-mv]')) return;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    s.setAttribute('data-mv', '1');
    document.head.appendChild(s);
  }, []);
}

export default function HeroSection() {
  useModelViewerScript();

  const containerRef  = useRef<HTMLDivElement>(null);
  const bgTextRef     = useRef<HTMLHeadingElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const priceRef      = useRef<HTMLDivElement>(null);
  const arrowsRef     = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const installRef    = useRef<HTMLSpanElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // Sync outer frame colour
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
      { opacity: 0, scale: 0.7 },
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

    // Floating animation
    gsap.to(canvasWrapRef.current, {
      y: '-=14',
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  const handleSelect = useCallback((index: number) => {
    if (index === activeIndex) return;
    gsap.fromTo(canvasWrapRef.current,
      { scale: 0.92, opacity: 0.6 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
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

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0a0a0a]"
      style={{
        height: 'calc(100vh - 40px - 80px)',
        overflow: 'hidden',
      }}
    >
      {/* Background giant name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          ref={bgTextRef}
          className="font-heading leading-none text-white select-none whitespace-nowrap"
          style={{
            opacity: 0.07,
            letterSpacing: '-0.02em',
            fontSize: 'clamp(60px, 18vw, 260px)',
          }}
        >
          {activeProduct.name}
        </h1>
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          ref={glowRef}
          className="rounded-full transition-all duration-700"
          style={{
            width: '60vw',
            height: '60vw',
            maxWidth: '750px',
            maxHeight: '750px',
            background: `radial-gradient(circle, ${activeProduct.themeColor}28 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Product dots / color swatches */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
        style={{ top: '28px' }}>
        {products.map((p, i) => (
          <button
            key={p.id}
            onClick={() => handleSelect(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? '28px' : '8px',
              height: '8px',
              backgroundColor: i === activeIndex ? p.themeColor : '#333',
              border: i === activeIndex ? `1px solid ${p.themeColor}` : '1px solid #444',
            }}
            aria-label={p.name}
          />
        ))}
      </div>

      {/* 3D Ball — model-viewer */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div
          ref={canvasWrapRef}
          style={{
            width: 'min(52vw, calc(100vh - 40px - 80px - 180px))',
            aspectRatio: '1 / 1',
          }}
        >
          {/* @ts-ignore */}
          <model-viewer
            src="https://assets.meshy.ai/58117215-754b-47c0-bc1e-facd7a7f4ac1/tasks/019d25c0-e8d5-772f-b469-c17a3f1ad234/output/model.glb?Expires=4927996800&Signature=XyWRwryToz0pgaYF0tpF0WsgGjF89~5j8Uu~9zp1IKDG9JPjk-rIs7~5ez0UeaoXNOKIX3iVl7r8DOypEr3~H-iL6UJVrKAW-6Sec7BWOi3rQ99vfmOv3JCJzwJszZikm~jOEMOxqBClBPQ8fXjJAVSqlNNTNveuTNVYw8HEznlFyJB9pqiuDWEiad0CDvTLUB~htsGMmhLibb3hQg5h4bPQjw-1E6rZWnD~Q00EE9ne-bMigoaIK1oa5jv04Y99edg4XRXV7ThBBipnA2fJTRlMDiH-l0dwFGwhWJh7whxKKR4YzqEhBm74DEq4LdAeBusdGYHgH02nW6AenjtazA__&Key-Pair-Id=KL5I0C8H7HX83"
            auto-rotate
            camera-controls
            shadow-intensity="0.6"
            tone-mapping="aces"
            exposure={activeProduct.exposure}
            environment-image="neutral"
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              '--progress-bar-color': activeProduct.themeColor,
            } as React.CSSProperties}
          />
          {/* @ts-ignore */}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute left-0 right-0 z-20 flex items-end justify-between"
        style={{ bottom: 0, padding: '0 56px 40px 56px' }}
      >
        {/* Price left */}
        <div ref={priceRef} className="flex flex-col items-start gap-1">
          <span
            className="font-heading leading-none transition-colors duration-500"
            style={{
              color: activeProduct.themeColor,
              fontSize: 'clamp(22px, 4vw, 52px)',
              letterSpacing: '-0.02em',
            }}
          >
            {activeProduct.price}
          </span>
          <span
            ref={installRef}
            className="uppercase tracking-widest font-body"
            style={{ fontSize: '9px', color: '#555', letterSpacing: '0.18em' }}
          >
            Pay in 4 installments
          </span>
        </div>

        {/* CTA center */}
        <button
          ref={btnRef}
          className="font-heading font-bold uppercase group relative overflow-hidden rounded-sm transition-all duration-300"
          style={{
            backgroundColor: activeProduct.themeColor,
            color: '#fff',
            boxShadow: `0 8px 32px ${activeProduct.themeColor}55`,
            fontSize: 'clamp(11px, 0.9vw, 14px)',
            padding: '20px clamp(24px, 3vw, 52px)',
            letterSpacing: '0.18em',
          }}
          onMouseEnter={e => {
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${activeProduct.themeColor}88`;
          }}
          onMouseLeave={e => {
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${activeProduct.themeColor}55`;
          }}
        >
          Add to Cart
        </button>

        {/* Arrows right */}
        <div ref={arrowsRef} className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:border-[#666]"
            style={{ border: '1px solid #3a3a3a' }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="font-heading text-xs text-[#555] tracking-widest">
            {String(activeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
          </span>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-200"
            style={{ border: `1px solid ${activeProduct.themeColor}` }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Product name label — bottom center above CTA */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none"
        style={{ bottom: '108px' }}
      >
        <span
          className="font-heading uppercase tracking-[0.25em] text-[#444]"
          style={{ fontSize: '11px' }}
        >
          {activeProduct.name}
        </span>
      </div>
    </section>
  );
}