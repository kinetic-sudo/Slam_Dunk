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

const CALLOUTS = [
  { label: 'High-Tack Surface',  side: 'left',  top: '18%', desc: 'Superior grip zone' },
  { label: '1.2mm Channels',     side: 'right', top: '28%', desc: 'Deep-cut precision' },
  { label: 'Cushion Core',       side: 'left',  top: '55%', desc: 'Impact absorption' },
  { label: 'Air Retention',      side: 'right', top: '65%', desc: '99.8% seal rate' },
];

export default function SpecsSection() {
  useModelViewerScript();

  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef      = useRef<HTMLDivElement>(null);
  const calloutsRef  = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const callouts = calloutsRef.current?.children
      ? Array.from(calloutsRef.current.children)
      : [];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top 60%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(headingRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
    .fromTo(ballRef.current,
      { opacity: 0, scale: 0.75 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(callouts,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(1.5)' },
      '-=0.5'
    );

    // Individual float animations
    callouts.forEach((callout, i) => {
      gsap.to(callout as Element, {
        y: i % 2 === 0 ? '-=12' : '+=12',
        duration: 2.2 + i * 0.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });

    // Ball slow rotate on scroll
    gsap.to(ballRef.current, {
      rotate: -90,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full py-32 overflow-hidden">
      {/* Section heading */}
      <div ref={headingRef} className="text-center mb-16 px-6">
        <span
          className="font-heading uppercase tracking-[0.3em]"
          style={{ color: '#FF3C00', fontSize: '11px', letterSpacing: '0.3em' }}
        >
          Technical Breakdown
        </span>
        <h2
          className="font-heading text-white uppercase mt-3"
          style={{ fontSize: 'clamp(36px, 5vw, 72px)', letterSpacing: '-0.02em', lineHeight: '1' }}
        >
          Built Different
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative flex justify-center items-center min-h-[580px]">
        {/* 3D Ball */}
        <div
          ref={ballRef}
          style={{ width: '340px', height: '340px', position: 'relative', zIndex: 10, flexShrink: 0 }}
        >
          {/* @ts-ignore */}
          <model-viewer
            src="https://assets.meshy.ai/58117215-754b-47c0-bc1e-facd7a7f4ac1/tasks/019d25c0-e8d5-772f-b469-c17a3f1ad234/output/model.glb?Expires=4927996800&Signature=XyWRwryToz0pgaYF0tpF0WsgGjF89~5j8Uu~9zp1IKDG9JPjk-rIs7~5ez0UeaoXNOKIX3iVl7r8DOypEr3~H-iL6UJVrKAW-6Sec7BWOi3rQ99vfmOv3JCJzwJszZikm~jOEMOxqBClBPQ8fXjJAVSqlNNTNveuTNVYw8HEznlFyJB9pqiuDWEiad0CDvTLUB~htsGMmhLibb3hQg5h4bPQjw-1E6rZWnD~Q00EE9ne-bMigoaIK1oa5jv04Y99edg4XRXV7ThBBipnA2fJTRlMDiH-l0dwFGwhWJh7whxKKR4YzqEhBm74DEq4LdAeBusdGYHgH02nW6AenjtazA__&Key-Pair-Id=KL5I0C8H7HX83"
            auto-rotate
            camera-controls
            shadow-intensity="0.6"
            tone-mapping="aces"
            exposure="1.1"
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
            } as React.CSSProperties}
          />
          {/* @ts-ignore */}
        </div>

        {/* Callouts */}
        <div
          ref={calloutsRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 20 }}
        >
          {CALLOUTS.map((c, i) => (
            <div
              key={i}
              className="absolute flex items-center gap-3"
              style={{
                top: c.top,
                ...(c.side === 'left'
                  ? { left: '2%' }
                  : { right: '2%', flexDirection: 'row-reverse' }),
              }}
            >
              {/* Tag */}
              <div
                className="flex flex-col"
                style={{ textAlign: c.side === 'right' ? 'right' : 'left' }}
              >
                <span
                  className="font-heading uppercase text-white tracking-wider leading-none"
                  style={{
                    fontSize: '13px',
                    padding: '8px 14px 6px',
                    background: 'rgba(17,17,17,0.85)',
                    border: '1px solid #2a2a2a',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '3px',
                    letterSpacing: '0.12em',
                  }}
                >
                  {c.label}
                </span>
                <span
                  className="font-body mt-1"
                  style={{
                    fontSize: '10px',
                    color: '#555',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    paddingLeft: c.side === 'left' ? '14px' : 0,
                    paddingRight: c.side === 'right' ? '14px' : 0,
                  }}
                >
                  {c.desc}
                </span>
              </div>

              {/* Connector line */}
              <div
                className="relative"
                style={{
                  width: 'clamp(40px, 6vw, 90px)',
                  height: '1px',
                  background: 'rgba(255,255,255,0.18)',
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-white"
                  style={{ [c.side === 'left' ? 'right' : 'left']: 0 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}