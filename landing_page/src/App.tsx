import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import NavigationBar        from './component/NavigationBar';
import HeroProductSection   from './component/ProductDetailSection';
import SpecsSection         from './component/SpecsSection';
import ChampionSection      from './component/ChampionSection';
import GravityPromoSection  from './component/GravityPromoSection';
import Footer               from './component/Footer';

// NOTE: HeroSection is no longer used — HeroProductSection handles both
// the hero display AND the scroll-transition to product details in one
// pinned block with a single WebGL Canvas.

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const card = document.querySelector('.site-card') as HTMLElement;
    if (!card) return;
    ScrollTrigger.defaults({ scroller: card });
    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="site-card">
      <div className="w-full flex flex-col">

        {/* Nav — sticky, always on top */}
        <div className="sticky top-0 z-50">
          <NavigationBar />
        </div>

        {/*
          HeroProductSection:
          - Renders the hero (ball centred, price, CTA)
          - Pins for 100vh of scroll travel
          - During pin: ball grows + moves right, hero UI exits, product content enters
          - After pin releases: rest of page scrolls normally
        */}
        <HeroProductSection />

        {/* Remaining sections scroll in after the pin releases */}
        <div className="relative flex flex-col" style={{ background:'#0a0a0a', zIndex:10 }}>
          <SpecsSection />
          <ChampionSection />
          <GravityPromoSection />
          <Footer />
        </div>

      </div>
    </div>
  );
}