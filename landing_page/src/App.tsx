import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    // This div fills #root exactly
    <div className="w-full min-h-full flex flex-col relative">

      {/* Nav — fixed at top of the #root scroll container */}
      <div className="sticky top-0 w-full z-50">
        <NavigationBar />
      </div>

      <main className="flex flex-col flex-1">
        {/* Hero — sticky so it stays while the sliding layer scrolls over it */}
        {/* sticky works here because #root is the scroll container */}
        <div className="sticky top-[80px] z-0">
          <HeroSection />
        </div>

        {/* Sliding layer — slides up over the hero as you scroll */}
        <div className="relative z-10 bg-[#0a0a0a] shadow-[0_-30px_60px_rgba(0,0,0,0.9)] border-t border-white/5">
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