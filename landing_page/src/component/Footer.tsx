import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#333] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        
        <div className="font-heading text-sm text-[#B0B0B0] uppercase tracking-wider">
          © {new Date().getFullYear()} Slam Sore. All rights reserved.
        </div>

        <div className="flex justify-center gap-6 font-heading text-sm text-[#B0B0B0] uppercase tracking-wider">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>

        <div className="flex justify-center md:justify-end gap-6 font-heading text-sm text-[#B0B0B0] uppercase tracking-wider">
          <a href="#" className="hover:text-white transition-colors">Support</a>
          <a href="#" className="hover:text-white transition-colors">Contact Us</a>
        </div>

      </div>
    </footer>
  );
}
