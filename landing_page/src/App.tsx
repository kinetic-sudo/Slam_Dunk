

import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    <div className="w-full h-full">
      <NavigationBar />
      <main>
        <HeroSection />
        <ProductDetailsSection />
        <SpecsSection />
        <ChampionSection />
        <GravityPromoSection />
      </main>
      <Footer />
    </div>
  );
}
