import { motion } from 'framer-motion';
import { User, ShoppingBag, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Basketball3D from './component/Basketball3D';

const SlamDunkDashboard = () => {
  return (
    <div className="min-h-screen bg-brand p-8 flex items-center justify-center font-sans">
      {/* Main Container */}
      <main className="relative w-full h-[90vh] bg-black rounded-[48px] overflow-hidden flex flex-col">
        
        {/* Navigation Bar */}
        <nav className="z-50 flex items-center justify-between px-12 py-10 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-5 h-[2px] bg-white rotate-45 absolute" />
              <div className="w-5 h-[2px] bg-white -rotate-45 absolute" />
            </div>
            <div className="leading-none">
              <h1 className="text-white font-bold text-lg tracking-tighter uppercase leading-tight">SLAM<br/>DUNK</h1>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-12">
            <a href="#" className="text-brand font-medium uppercase text-sm tracking-widest">Products</a>
            <a href="#" className="text-white font-medium uppercase text-sm tracking-widest opacity-80 hover:opacity-100 transition-opacity">About us</a>
            <a href="#" className="text-white font-medium uppercase text-sm tracking-widest opacity-80 hover:opacity-100 transition-opacity">Contacts</a>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-6">
            <button className="text-white opacity-80 hover:opacity-100 transition-opacity"><User size={22} /></button>
            <div className="relative cursor-pointer">
              <ShoppingBag size={22} className="text-white opacity-80" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full border border-black" />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative flex-1 flex items-center justify-center">
          
          {/* Background Text */}
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute select-none text-grayText font-heading text-[22vw] leading-none uppercase tracking-tighter z-0"
          >
            SPALDING
          </motion.h1>

          {/* Promotion Video Button (Left) */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                <Play size={18} fill="currentColor" />
              </div>
              <span className="text-white text-xs uppercase tracking-widest font-medium">Promotion<br/>video</span>
            </motion.button>
          </div>

          {/* 3D Basketball */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -15, 0] 
            }}
            transition={{ 
              scale: { duration: 0.8 },
              opacity: { duration: 0.8 },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="z-10 relative"
          >
            {/* Replace with your high-res basketball asset */}
            <Basketball3D />
          </motion.div>

          {/* Section Indicator (Right) */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 z-20">
            <span className="text-brand font-bold text-xs tracking-widest">01 / 06</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="z-50 flex items-end justify-between px-12 pb-12 w-full">
          
          {/* Price & Specs */}
          <div className="flex flex-col gap-1">
            <span className="text-brand text-5xl font-bold tracking-tight">$34.99</span>
            <span className="text-white text-[10px] tracking-[0.2em] font-medium opacity-60">
              SIZE: 29.5" <span className="mx-1">•</span> OFFICIAL
            </span>
          </div>

          {/* Add to Cart */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-12">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px 0px rgba(255,76,0,0.6)" }}
              className="bg-brand text-white px-16 py-5 rounded-sm font-bold text-sm tracking-widest uppercase transition-shadow"
            >
              ADD TO CART
            </motion.button>
          </div>

          {/* Carousel Controls */}
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:border-white transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Subtle Bottom Ru text */}
        <div className="absolute bottom-4 left-6">
          <span className="text-[10px] text-white/20 uppercase">Ru</span>
        </div>
      </main>
    </div>
  );
};

export default SlamDunkDashboard;