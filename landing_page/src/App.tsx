import NavigationBar from './component/NavigationBar';
import HeroSection from './component/HeroSection';
import ProductDetailsSection from './component/ProductDetailSection';
import SpecsSection from './component/SpecsSection';
import ChampionSection from './component/ChampionSection';
import GravityPromoSection from './component/GravityPromoSection';
import Footer from './component/Footer';

export default function App() {
  return (
    /*
      .site-card is the SCROLL CONTAINER (overflow-y: auto, fixed height).
      sticky children work perfectly inside a defined scroll container.
    */
    <div className="site-card">
      <div className="w-full flex flex-col">

        {/* Nav — sticky to .site-card scroll container */}
        <div className="sticky top-0 z-50">
          <NavigationBar />
        </div>

        {/*
          Hero — sticky just below nav inside .site-card.
          Pins in place while .site-card scrolls.
          z-0 so the content layer (z-10) slides over it.
        */}
        <div className="sticky z-0" style={{ top: '80px' }}>
          <HeroSection />
        </div>

        {/*
          Content layer.
          margin-top = hero height so its top edge starts
          at the bottom of .site-card viewport on load.
          As user scrolls, this slides UP over the pinned hero.
        */}
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