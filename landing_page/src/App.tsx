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

      {/* Nav — sticky to the body scroll container */}
      <div className="sticky top-0 z-50 rounded-t-[2rem]">
        <NavigationBar />
      </div>

      <main className="flex flex-col">

        {/* Hero — sticky, sits just below the nav */}
        <div className="sticky z-0" style={{ top: '80px' }}>
          <HeroSection />
        </div>

        {/* Sliding layer — scrolls up over the sticky hero */}
        <div
          className="relative z-10 flex flex-col"
          style={{
            background: '#0a0a0a',
            boxShadow: '0 -40px 80px rgba(0,0,0,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <ProductDetailsSection />
          <SpecsSection />
          <ChampionSection />
          <GravityPromoSection />
          <Footer />
        </div>

      </main>
    </div>
  );
}