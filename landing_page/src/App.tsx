import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Basketball3D from './component/Basketball3D'; // Make sure this path matches your file structure

const sections = ["hero", "stats", "flight", "details"];

// Helper component for the metrics
const Metric = ({ label, sub }: any) => (
  <div>
    <div className="text-white text-3xl font-bold font-heading">{label}</div>
    <div className="text-white/60 text-sm uppercase tracking-widest mt-1">{sub}</div>
  </div>
);

export default function SlamDunkDashboard() {
  const [index, setIndex] = useState(0);
  const isDetailsPage = index > 0;

  const nextSection = () => setIndex((prev) => (prev + 1) % sections.length);
  const prevSection = () => setIndex((prev) => (prev - 1 + sections.length) % sections.length);

  // Format index for display (e.g., "01 / 04")
  const currentStep = String(index + 1).padStart(2, '0');
  const totalSteps = String(sections.length).padStart(2, '0');

  return (
    // Outer Container: Full viewport, thick 32px orange border (using standard Tailwind colors/arbitrary values here for your "bg-brand")
    <div className="h-screen w-screen bg-[#ff4c00] p-[32px] flex items-center justify-center font-sans overflow-hidden">
      
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
            <a href="#" className="text-[#ff4c00] font-medium uppercase text-[18px] tracking-wide">Products</a>
            <a href="#" className="text-white font-medium uppercase text-[18px] tracking-wide hover:text-[#ff4c00] transition-colors">About us</a>
            <a href="#" className="text-white font-medium uppercase text-[18px] tracking-wide hover:text-[#ff4c00] transition-colors">Contacts</a>
          </div>

          {/* User & Cart Icons */}
          <div className="flex items-center gap-[24px]">
            <button className="text-white hover:text-[#ff4c00] transition-colors">
              <User size={24} strokeWidth={1.5} />
            </button>
            <button className="relative text-white hover:text-[#ff4c00] transition-colors">
              <ShoppingBag size={24} strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff4c00] rounded-full border-2 border-black" />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative flex-1 flex items-center justify-center w-full h-full">
          
          {/* Promotion Video Button (Left) */}
          <div className="absolute left-[48px] top-1/2 -translate-y-1/2 z-20">
            <motion.button 
              whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(255,255,255,0.5)" }}
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
          <AnimatePresence>
            {index === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.h1 className="text-gray-800 font-heading text-[18vw] uppercase opacity-30 select-none m-0 leading-none">
                  SPALDING
                </motion.h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Basketball Container */}
          <div className="z-10 absolute inset-0 w-full h-full">
            <Basketball3D isExploded={isDetailsPage} />
          </div>

          {/* Section Indicator (Right) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="absolute right-[48px] top-1/2 -translate-y-1/2 rotate-90 z-20 origin-center"
          >
            <span className="text-[#ff4c00] font-bold text-[14px] tracking-[0.1em]">
              {currentStep} / {totalSteps}
            </span>
          </motion.div>
        </div>

        {/* Price & Specs Overlay */}
        <AnimatePresence>
          {isDetailsPage && (
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-[48px] top-[30%] z-20 pointer-events-none"
            >
              <span className="text-[#ff4c00] text-xs font-bold uppercase tracking-tighter">Performance Metrics</span>
              <h2 className="text-white text-7xl font-heading uppercase leading-none mt-2">Elite<br/>Control</h2>
              <div className="mt-8 space-y-6">
                <Metric label="100%" sub="Microfiber Composite" />
                <Metric label="0.5mm" sub="Pebble Depth" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Add to Cart Button */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[32px] z-20">
          <motion.button 
            whileHover={{ 
              scale: 1.02, 
              y: -2,
              boxShadow: "0px 10px 30px rgba(255, 76, 0, 0.6)" 
            }}
            transition={{ duration: 0.2 }}
            className="bg-[#ff4c00] text-white px-[48px] py-[16px] rounded-sm font-medium text-[18px] tracking-wide uppercase shadow-[0px_4px_20px_rgba(255,76,0,0.4)] cursor-pointer"
          >
            ADD TO CART
          </motion.button>
        </div>

        {/* Right: Carousel Controls */}
        <div className="absolute right-[48px] bottom-[32px] z-20 flex gap-4">
          <motion.button 
            onClick={prevSection}
            whileHover={{ borderWidth: "2px", backgroundColor: "#fff", color: "#000" }}
            transition={{ duration: 0.2 }}
            className="w-[48px] h-[48px] rounded-full border border-white/50 flex items-center justify-center text-white cursor-pointer box-border"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </motion.button>
          <motion.button 
            onClick={nextSection}
            whileHover={{ borderWidth: "2px", backgroundColor: "#fff", color: "#000" }}
            transition={{ duration: 0.2 }}
            className="w-[48px] h-[48px] rounded-full border border-white/50 flex items-center justify-center text-white cursor-pointer box-border"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </motion.button>
        </div>
        
        {/* Very bottom left "Ru" text matching screenshot edge */}
        <div className="absolute bottom-4 left-[48px] z-20">
          <span className="text-[10px] text-white/30 uppercase">Ru</span>
        </div>
      </main>
    </div>
  );
}