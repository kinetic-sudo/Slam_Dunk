import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Nav floats on top of all layers */}
      <div className="absolute top-0 w-full z-50">
        <NavigationBar />
      </div>

      <main className="flex flex-col flex-1 relative">
        {/* STICKY LAYER: This stays fixed while you scroll */}
        <div className="sticky top-0 h-full w-full z-0">
          <HeroSection />
        </div>

        {/* SLIDING LAYER: This moves over the HeroSection */}
        {/* Setting z-10 and a background color ensures the Hero is hidden as you scroll */}
        <div className="relative z-10 bg-[#0a0a0a] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] border-t border-white/5">
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