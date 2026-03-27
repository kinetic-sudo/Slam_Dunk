import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    // Added h-full and relative to the main container
    <div className="w-full h-full flex flex-col relative">
      
      {/* 1. Changed to absolute so it floats OVER the hero without pushing it down */}
      <div className="absolute top-0 w-full z-50">
        <NavigationBar />
      </div>

      <main className="flex flex-col relative h-full">
        
        {/* 2. Forced Hero wrapper to exactly match your root container's height. 
               This guarantees the sliding layer is pushed completely out of view on load. */}
        <div className="sticky top-0 h-[calc(100vh-48px)] w-full z-0 flex-shrink-0">
          <HeroSection />
        </div>

        {/* 3. Sliding layer naturally sits below the 100vh hero wrapper */}
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