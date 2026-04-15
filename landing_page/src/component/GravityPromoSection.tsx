import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLLER = () => document.querySelector('.site-card') as HTMLElement;

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.736-8.86L2.25 2.25h6.953l4.255 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function GravityPromoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLHeadingElement>(null);
  const iconRef      = useRef<HTMLDivElement>(null);
  const btnRef       = useRef<HTMLButtonElement>(null);
  const socialRef    = useRef<HTMLDivElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        scroller: SCROLLER(),
        start: 'top 75%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(dividerRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left center' }
    )
    .fromTo([iconRef.current, textRef.current],
      { opacity: 0, scale: 0.5, filter: 'blur(8px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'back.out(1.2)', stagger: 0.1 },
      '-=0.2'
    )
    .fromTo(btnRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      socialRef.current?.children ? Array.from(socialRef.current.children) : [],
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
      '-=0.2'
    );

    // Pulse the play icon
    gsap.to(iconRef.current, {
      scale: 1.18,
      duration: 1.1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ paddingTop: '80px', paddingBottom: '96px' }}
    >
      {/* Top divider */}
      <div
        ref={dividerRef}
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #2a2a2a 30%, #2a2a2a 70%, transparent)',
          marginBottom: '72px',
        }}
      />

      {/* GRAVITY text + play icon row */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Play icon — absolutely left of text */}
        <div
          ref={iconRef}
          className="absolute"
          style={{
            left: 'clamp(-48px, -5vw, -80px)',
            color: '#FF3C00',
          }}
        >
          <svg
            viewBox="0 0 48 48"
            fill="currentColor"
            style={{ width: 'clamp(36px, 4vw, 56px)', height: 'clamp(36px, 4vw, 56px)' }}
          >
            <polygon points="12,6 42,24 12,42" />
          </svg>
        </div>

        <h2
          ref={textRef}
          className="font-heading text-white uppercase leading-none"
          style={{
            fontSize: 'clamp(72px, 14vw, 200px)',
            letterSpacing: '-0.04em',
          }}
        >
          GRAVITY
        </h2>
      </div>

      {/* CTA Button */}
      <button
        ref={btnRef}
        className="font-heading uppercase tracking-widest text-white rounded-sm transition-all duration-300 mb-14"
        style={{
          background: 'transparent',
          border: '2px solid #FF3C00',
          fontSize: 'clamp(13px, 1.2vw, 18px)',
          letterSpacing: '0.22em',
          padding: '18px clamp(32px, 4vw, 64px)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = '#FF3C00';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(255,60,0,0.45)';
          gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 });
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
        }}
      >
        Shop Collection
      </button>

      {/* Social icons */}
      <div ref={socialRef} className="flex items-center gap-10">
        {[
          { icon: <InstagramIcon />, label: 'Instagram' },
          { icon: <TwitterIcon />,   label: 'Twitter' },
          { icon: <YoutubeIcon />,   label: 'YouTube' },
        ].map(({ icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="text-[#444] transition-all duration-300 hover:text-white"
            onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.15, duration: 0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          >
            {icon}
          </a>
        ))}
      </div>
    </section>
  );
}