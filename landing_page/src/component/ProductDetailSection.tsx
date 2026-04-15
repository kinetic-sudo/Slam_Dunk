import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = () => document.querySelector('.site-card') as HTMLElement;

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

export default function ProductDetailsSection() {
  useModelViewerScript();

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const ballWrapRef  = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const taglineRef   = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(textRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo(taglineRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo(statsRef.current?.children ? Array.from(statsRef.current.children) : [],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(ballWrapRef.current,
      { opacity: 0, x: 80, scale: 0.85 },
      { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: 'power3.out' },
      '-=0.8'
    );

    // Parallax rotate on scroll
    gsap.to(ballWrapRef.current, {
      rotate: 45,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full max-w-7xl mx-auto px-8 md:px-14 py-28 md:py-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* Left — text */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <span
            className="font-heading uppercase tracking-[0.3em] mb-4 inline-block"
            style={{ color: '#FF3C00', fontSize: '11px', letterSpacing: '0.3em' }}
          >
            Performance Series
          </span>

          <div ref={textRef}>
            <h2
              className="font-heading text-white uppercase leading-[0.88]"
              style={{
                fontSize: 'clamp(52px, 7vw, 104px)',
                letterSpacing: '-0.02em',
              }}
            >
              ELITE<br />CONTROL
            </h2>
          </div>

          <p
            ref={taglineRef}
            className="font-body text-[#B0B0B0] max-w-md mt-6 mb-14 leading-relaxed"
            style={{ fontSize: '16px', lineHeight: '1.7' }}
          >
            Engineered with microscopic composite channels for unparalleled grip
            in any condition. Feel the difference on every crossover.
          </p>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-0 border-t"
            style={{ borderColor: '#222' }}
          >
            {[
              { value: '100%', label: 'Moisture Wicking' },
              { value: '0.5',  label: 'Sec Release' },
              { value: '1.2mm', label: 'Deep Channels' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex flex-col pt-6 pr-4"
                style={{ borderRight: i < 2 ? '1px solid #1e1e1e' : 'none', paddingLeft: i > 0 ? '20px' : 0 }}
              >
                <span
                  className="font-heading leading-none"
                  style={{ fontSize: 'clamp(28px, 3vw, 42px)', color: '#fff', letterSpacing: '-0.02em' }}
                >
                  {s.value}
                </span>
                <span
                  className="font-heading uppercase mt-2"
                  style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D ball */}
        <div className="relative w-full flex justify-end items-start" style={{ minHeight: '420px' }}>
          {/* Decorative glow behind ball */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: '85%',
              aspectRatio: '1/1',
              top: '-5%',
              right: '-10%',
              background: 'radial-gradient(circle, rgba(255,60,0,0.12) 0%, transparent 65%)',
            }}
          />

          <div
            ref={ballWrapRef}
            className="relative"
            style={{ width: '110%', aspectRatio: '1/1', marginRight: '-10%', marginTop: '-5%' }}
          >
            {/* @ts-ignore */}
            <model-viewer
              src="https://assets.meshy.ai/58117215-754b-47c0-bc1e-facd7a7f4ac1/tasks/019d25c0-e8d5-772f-b469-c17a3f1ad234/output/model.glb?Expires=4927996800&Signature=XyWRwryToz0pgaYF0tpF0WsgGjF89~5j8Uu~9zp1IKDG9JPjk-rIs7~5ez0UeaoXNOKIX3iVl7r8DOypEr3~H-iL6UJVrKAW-6Sec7BWOi3rQ99vfmOv3JCJzwJszZikm~jOEMOxqBClBPQ8fXjJAVSqlNNTNveuTNVYw8HEznlFyJB9pqiuDWEiad0CDvTLUB~htsGMmhLibb3hQg5h4bPQjw-1E6rZWnD~Q00EE9ne-bMigoaIK1oa5jv04Y99edg4XRXV7ThBBipnA2fJTRlMDiH-l0dwFGwhWJh7whxKKR4YzqEhBm74DEq4LdAeBusdGYHgH02nW6AenjtazA__&Key-Pair-Id=KL5I0C8H7HX83"
              auto-rotate
              camera-controls
              shadow-intensity="0.5"
              tone-mapping="aces"
              exposure="1.0"
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
              } as React.CSSProperties}
            />
            {/* @ts-ignore */}
          </div>
        </div>

      </div>
    </section>
  );
}