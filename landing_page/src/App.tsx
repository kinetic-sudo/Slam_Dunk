import { motion } from 'framer-motion';
import { User, ShoppingBag, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Basketball3D from './component/Basketball3D'; // Adjust path if needed

export default function SlamDunkDashboard() {
  return (
    // Outer Container: Full viewport, thick 32px orange border
    <div className="h-screen w-screen bg-brand p-[32px] flex items-center justify-center font-sans overflow-hidden">
      
      {/* Main Content Area: Inset with 32px radius */}
      <main className="relative w-full h-full bg-black rounded-[32px] overflow-hidden flex flex-col">
        
        {/* Navigation Bar */}
        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-[48px] pt-[48px]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative">
              <div className="w-5 h-[2px] bg-white rotate-45 absolute" />
              <div className="w-5 h-[2px] bg-white -rotate-45 absolute" />
            </div>
            <div className="leading-[1.1]">
              <h1 className="text-white font-heading text-[18px] tracking-tight uppercase">
                SLAM<br />DUNK
              </h1>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-[32px]">
            <a href="#" className="text-brand font-medium uppercase text-[18px] tracking-wide">Products</a>
            <a href="#" className="text-white font-medium uppercase text-[18px] tracking-wide hover:text-brand transition-colors">About us</a>
            <a href="#" className="text-white font-medium uppercase text-[18px] tracking-wide hover:text-brand transition-colors">Contacts</a>
          </div>

          {/* User & Cart Icons */}
          <div className="flex items-center gap-[24px]">
            <button className="text-white hover:text-brand transition-colors">
              <User size={24} strokeWidth={1.5} />
            </button>
            <button className="relative text-white hover:text-brand transition-colors">
              <ShoppingBag size={24} strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full border-2 border-black" />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative flex-1 flex items-center justify-center w-full h-full">
          
          {/* Promotion Video Button (Left) */}
          <div className="absolute left-[48px] top-1/2 -translate-y-1/2 z-20">
            <motion.button 
              whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(255,255,255,0.5)" }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-[48px] h-[48px] rounded-full border border-white flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                <Play size={16} fill="currentColor" className="text-white ml-1" />
              </div>
              <span className="text-white text-[16px] uppercase tracking-wide font-normal text-left leading-tight">
                Promotion<br />video
              </span>
            </motion.button>
          </div>

          {/* Huge Background Text */}
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute select-none text-grayText font-heading text-[180px] lg:text-[220px] leading-[1.1] tracking-[-0.02em] uppercase z-0 m-0"
          >
            SPALDING
          </motion.h1>

          {/* 3D Basketball Container */}
          <div className="z-10 relative w-full h-full flex items-center justify-center">
            <Basketball3D />
          </div>

          {/* Section Indicator (Right) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute right-[48px] top-1/2 -translate-y-1/2 rotate-90 z-20 origin-center"
          >
            <span className="text-brand font-bold text-[14px] tracking-[0.1em]">01 / 06</span>
          </motion.div>
        </div>

        {/* Bottom Bar Elements (Absolutely Positioned for exact spacing) */}
        
        {/* Left: Price & Specs */}
        <div className="absolute left-[48px] bottom-[32px] z-20 flex flex-col gap-0">
          <span className="text-brand text-[36px] font-bold tracking-tight leading-none mb-1">
            $34.99
          </span>
          <span className="text-white text-[14px] tracking-wider font-normal opacity-80 uppercase">
            SIZE: 29.5" <span className="mx-1.5 opacity-50">•</span> OFFICIAL
          </span>
        </div>

        {/* Center: Add to Cart Button */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[32px] z-20">
          <motion.button 
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: "0px 10px 30px rgba(255, 76, 0, 0.6)" 
            }}
            transition={{ duration: 0.2 }}
            className="bg-brand text-white px-[48px] py-[16px] rounded-sm font-medium text-[18px] tracking-wide uppercase shadow-[0px_4px_20px_rgba(255,76,0,0.4)] cursor-pointer"
          >
            ADD TO CART
          </motion.button>
        </div>

        {/* Right: Carousel Controls */}
        <div className="absolute right-[48px] bottom-[32px] z-20 flex gap-4">
          <motion.button 
            whileHover={{ borderWidth: "2px", backgroundColor: "#fff", color: "#000" }}
            transition={{ duration: 0.2 }}
            className="w-[48px] h-[48px] rounded-full border border-white/50 flex items-center justify-center text-white cursor-pointer box-border"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </motion.button>
          <motion.button 
            whileHover={{ borderWidth: "2px", backgroundColor: "#fff", color: "#000" }}
            transition={{ duration: 0.2 }}
            className="w-[48px] h-[48px] rounded-full border border-white/50 flex items-center justify-center text-white cursor-pointer box-border"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </motion.button>
        </div>
        
        {/* Very bottom left "Ru" text matching screenshot edge */}
        <div className="absolute bottom-2 left-4 z-20">
          <span className="text-[10px] text-white/30 uppercase">Ru</span>
        </div>
      </main>
    </div>
  );
}