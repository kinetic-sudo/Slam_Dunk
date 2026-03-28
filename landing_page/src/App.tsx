import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const card = document.querySelector('.site-card') as HTMLElement;
    if (!card) return;

    // Tell ALL ScrollTriggers to use .site-card as the scroll container
    ScrollTrigger.defaults({ scroller: card });

    // Refresh after layout settles
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="site-card">
      <div className="w-full flex flex-col">

        {/* Nav */}
        <div className="sticky top-0 z-50">
          <NavigationBar />
        </div>

        {/* Hero — sticky, pinned behind sliding content */}
        <div className="sticky z-0" style={{ top: '80px' }}>
          <HeroSection />
        </div>

        {/* Content — slides up over hero on scroll */}
        <div
          className="relative z-10 flex flex-col"
          style={{
            marginTop: 'calc(100vh - 40px - 80px)',
            background: '#0a0a0a',
            borderRadius: '2rem 2rem 0 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 -80px 120px 40px #0a0a0a',
          }}
        >
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