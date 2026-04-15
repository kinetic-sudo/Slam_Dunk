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

export default function ChampionSection() {
  useModelViewerScript();

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const ballRef      = useRef<HTMLDivElement>(null);
  const podiumRef    = useRef<HTMLDivElement>(null);
  const labelsRef    = useRef<HTMLDivElement>(null);

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

    tl.fromTo(headingRef.current,
      { opacity: 0, y: -60 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    )
    .fromTo(podiumRef.current,
      { opacity: 0, scale: 0.75, y: 60 },
      { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo(ballRef.current,
      { opacity: 0, scale: 0.5, y: -60 },
      { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'back.out(1.2)' },
      '-=0.7'
    )
    .fromTo(
      labelsRef.current?.children ? Array.from(labelsRef.current.children) : [],
      { opacity: 0, x: (i: number) => (i === 0 ? -30 : 30) },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out' },
      '-=0.4'
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-32 relative overflow-hidden">
      {/* Background subtle text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="font-heading uppercase text-white select-none"
          style={{
            fontSize: 'clamp(80px, 20vw, 300px)',
            opacity: 0.025,
            letterSpacing: '-0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          CHAMPION
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10">
        <h2
          ref={headingRef}
          className="font-heading text-white uppercase text-center"
          style={{
            fontSize: 'clamp(52px, 9vw, 130px)',
            letterSpacing: '-0.02em',
            lineHeight: '1',
            marginBottom: '64px',
          }}
        >
          THE CHAMPION
        </h2>

        <div className="relative w-full max-w-4xl flex justify-center items-end"
          style={{ height: '460px' }}>

          {/* Labels */}
          <div
            ref={labelsRef}
            className="absolute inset-0 flex justify-between items-center px-4 md:px-10 z-20 pointer-events-none"
          >
            <div className="flex flex-col items-start max-w-[180px]">
              <span
                className="font-heading uppercase pb-1 mb-2"
                style={{
                  fontSize: '15px',
                  color: '#FF3C00',
                  borderBottom: '2px solid #FF3C00',
                  letterSpacing: '0.1em',
                }}
              >
                Elite Tier
              </span>
              <p className="font-body text-[#666] leading-snug" style={{ fontSize: '12px' }}>
                Crafted for professional indoor play with premium composite leather.
              </p>
            </div>

            <div className="flex flex-col items-end text-right max-w-[180px]">
              <span
                className="font-heading uppercase pb-1 mb-2"
                style={{
                  fontSize: '15px',
                  color: '#FF3C00',
                  borderBottom: '2px solid #FF3C00',
                  letterSpacing: '0.1em',
                }}
              >
                Gold Standard
              </span>
              <p className="font-body text-[#666] leading-snug" style={{ fontSize: '12px' }}>
                Meets all official size and weight specifications for tournament use.
              </p>
            </div>
          </div>

          {/* 3D Ball */}
          <div
            ref={ballRef}
            className="absolute z-10"
            style={{
              bottom: '130px',
              width: 'clamp(200px, 28vw, 340px)',
              height: 'clamp(200px, 28vw, 340px)',
            }}
          >
            {/* @ts-ignore */}
            <model-viewer
              src="https://assets.meshy.ai/58117215-754b-47c0-bc1e-facd7a7f4ac1/tasks/019d25c0-e8d5-772f-b469-c17a3f1ad234/output/model.glb?Expires=4927996800&Signature=XyWRwryToz0pgaYF0tpF0WsgGjF89~5j8Uu~9zp1IKDG9JPjk-rIs7~5ez0UeaoXNOKIX3iVl7r8DOypEr3~H-iL6UJVrKAW-6Sec7BWOi3rQ99vfmOv3JCJzwJszZikm~jOEMOxqBClBPQ8fXjJAVSqlNNTNveuTNVYw8HEznlFyJB9pqiuDWEiad0CDvTLUB~htsGMmhLibb3hQg5h4bPQjw-1E6rZWnD~Q00EE9ne-bMigoaIK1oa5jv04Y99edg4XRXV7ThBBipnA2fJTRlMDiH-l0dwFGwhWJh7whxKKR4YzqEhBm74DEq4LdAeBusdGYHgH02nW6AenjtazA__&Key-Pair-Id=KL5I0C8H7HX83"
              auto-rotate
              camera-controls
              shadow-intensity="0.8"
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

          {/* Podium */}
          <div
            ref={podiumRef}
            className="absolute bottom-0 flex flex-col items-center z-0"
            style={{ width: 'clamp(260px, 36vw, 460px)' }}
          >
            {/* Tier 1 — top */}
            <div
              className="w-[72%] relative"
              style={{
                height: '38px',
                background: 'linear-gradient(180deg, #2a2a2a 0%, #111 100%)',
                borderRadius: '100%',
                border: '1px solid #3a3a3a',
                boxShadow: '0 -8px 24px rgba(255,60,0,0.08)',
                marginBottom: '-8px',
                zIndex: 3,
              }}
            />
            {/* Tier 2 */}
            <div
              className="w-[82%] relative"
              style={{
                height: '44px',
                background: 'linear-gradient(180deg, #1e1e1e 0%, #0d0d0d 100%)',
                borderRadius: '100%',
                border: '1px solid #2a2a2a',
                marginBottom: '-10px',
                zIndex: 2,
              }}
            />
            {/* Tier 3 — base */}
            <div
              className="w-full relative"
              style={{
                height: '52px',
                background: 'linear-gradient(180deg, #161616 0%, #050505 100%)',
                borderRadius: '100%',
                border: '1px solid #222',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
                zIndex: 1,
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}