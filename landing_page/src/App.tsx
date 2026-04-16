import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import NavigationBar      from './component/NavigationBar';
import HeroSection        from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection       from './component/SpecsSection';
import ChampionSection    from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer             from './component/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const card = document.querySelector('.site-card') as HTMLElement;
    if (!card) return;
    ScrollTrigger.defaults({ scroller: card });
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="site-card">
      <div className="w-full flex flex-col">

        {/* ── Navigation — always on top ─────────────────────────── */}
        <div className="sticky top-0 z-50">
          <NavigationBar />
        </div>

        {/*
          ── Hero — STICKY so it stays pinned while the scrollable
             content below slides up over it.
             The ball inside HeroSection is absolutely centred, so it
             appears to "stay" as the dark overlay card scrolls up.
        */}
        <div
          className="sticky z-0"
          style={{ top: '80px' }}   /* same as nav height */
        >
          <HeroSection />
        </div>

        {/*
          ── Scrollable content card — slides up OVER the pinned hero.
             z-10 ensures it covers the hero as it scrolls.
             The negative-top borderRadius creates the "card peeling up"
             look from the video.
             marginTop = full hero height so content starts below the fold.
        */}
        <div
          className="relative z-10 flex flex-col"
          style={{
            marginTop: 'calc(100vh - 40px - 80px)',
            background: '#0a0a0a',
            borderRadius: '2rem 2rem 0 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            // The thick shadow here is what makes the hero "disappear"
            // behind this card as you scroll — it masks the sticky hero
            boxShadow: '0 -100px 140px 60px #0a0a0a',
          }}
        >
          {/*
            ProductDetailsSection is the FIRST thing after the hero.
            Its internal GSAP animation (xPercent: -52 → 0, scale: 0.58 → 1)
            simulates the ball flying from the hero into this section
            as you scroll.
          */}
          <ProductDetailsSection />
          <SpecsSection />
          <ChampionSection />
          <GravityPromoSection />
          <Footer />
        </div>

      </div>
    </div>
  );
}