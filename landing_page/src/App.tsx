import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    <>
      {/*
        ── LAYER 1: Nav — always on top, fixed to viewport ──────────────
        Fixed inside #root context using sticky. Since #root has overflow:hidden,
        we use a portal-like approach: nav is sticky at z:50, sits above everything.
      */}
      <div className="sticky top-0 left-0 right-0 z-50 w-full">
        <NavigationBar />
      </div>

      {/*
        ── LAYER 2: Hero — sticky, acts as the "fixed" background layer ──
        sticky + top equal to nav height means it pins in place.
        The content layer below has enough height to scroll over it.
      */}
      <div
        className="sticky w-full z-0"
        style={{ top: '80px' }}
      >
        <HeroSection />
      </div>

      {/*
        ── LAYER 3: Content — slides UP over the hero ───────────────────
        z-10 > z-0 so it covers the hero.
        No margin-top needed — sticky hero doesn't push document flow.
        The shadow + border creates a clean "sheet lifting off" effect.
      */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          background: '#0a0a0a',
          boxShadow: '0 -60px 100px 20px rgba(0,0,0,1)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '2rem 2rem 0 0',
        }}
      >
        <ProductDetailsSection />
        <SpecsSection />
        <ChampionSection />
        <GravityPromoSection />
        <Footer />
      </div>
    </>
  );
}