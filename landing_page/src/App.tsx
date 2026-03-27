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
      
      {/* 1. Make Navigation absolute so it floats over the parallax effect seamlessly */}
      <div className="absolute top-0 w-full z-50">
        <NavigationBar />
      </div>

      <main className="flex flex-col flex-1 relative">
        
        {/* 2. Sticky Hero Container - Pins the hero section while you scroll down */}
        <div className="sticky top-0 h-[calc(100vh-48px)] w-full overflow-hidden z-0">
          <HeroSection />
        </div>

        {/* 3. The Sliding Content Wrapper - This slides OVER the Hero section */}
        <div className="relative z-10 bg-[#0a0a0a] rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
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