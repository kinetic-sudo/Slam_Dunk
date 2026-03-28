import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    <div className="w-full flex flex-col">

      {/* Nav — sticky, always on top */}
      <div className="sticky top-0 z-50">
        <NavigationBar />
      </div>

      {/* Hero — sticky just below nav, pinned while content slides over */}
      <div className="sticky z-0" style={{ top: '80px' }}>
        <HeroSection />
      </div>

      {/* Content — slides up over the hero */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          background: '#0a0a0a',
          borderRadius: '2rem 2rem 0 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -50px 80px 10px rgba(0,0,0,0.99)',
        }}
      >
        <ProductDetailsSection />
        <SpecsSection />
        <ChampionSection />
        <GravityPromoSection />
        <Footer />
      </div>

    </div>
  );
}