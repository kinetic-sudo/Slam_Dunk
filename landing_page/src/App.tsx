import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import NavigationBar        from './component/NavigationBar';
import HeroProductSection   from './component/ProductDetailSection';   // ← unified component
import SpecsSection         from './component/SpecsSection';
import ChampionSection      from './component/ChampionSection';
import GravityPromoSection  from './component/GravityPromoSection';
import Footer               from './component/Footer';

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

        {/* Nav — always on top */}
        <div className="sticky top-0 z-50">
          <NavigationBar />
        </div>

        {/*
          HeroProductSection handles BOTH the hero AND the product-details
          transition in a single scroll-pinned block.
          ScrollTrigger.pin keeps it in place for 200vh of scroll travel,
          during which the ball grows+moves and content swaps.
          After 200vh of scrolling, the pin releases and the rest of the
          page scrolls normally.
        */}
        <HeroProductSection />

        {/* Rest of page — scrolls in normally after pin releases */}
        <div className="relative z-10 flex flex-col" style={{ background: '#0a0a0a' }}>
          <SpecsSection />
          <ChampionSection />
          <GravityPromoSection />
          <Footer />
        </div>

      </div>
    </div>
  );
}