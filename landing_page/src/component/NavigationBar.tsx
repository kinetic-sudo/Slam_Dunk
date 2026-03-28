import { ShoppingCart, User } from 'lucide-react';

export default function NavigationBar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 md:px-12 py-6 md:py-8 absolute top-0 left-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center group-hover:border-[#FF3C00] transition-colors duration-300">
          <div className="w-6 h-6 border-2 border-white rounded-full relative overflow-hidden group-hover:border-[#FF3C00] transition-colors duration-300">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white group-hover:bg-[#FF3C00] transition-colors duration-300 -translate-y-1/2"></div>
            <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white group-hover:bg-[#FF3C00] transition-colors duration-300 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] border-[2px] border-white group-hover:border-[#FF3C00] transition-colors duration-300 rounded-full -translate-x-1/2 -translate-y-1/2 scale-x-50"></div>
          </div>
        </div>
        <span className="font-heading text-2xl tracking-tight uppercase">Slam Sore</span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm  tracking-wide relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#FF3C00] hover:text-[#FF3C00] transition-colors">Home</a>
        <a href="#" className="text-sm  tracking-wide text-[#B0B0B0] hover:text-white transition-colors">About us</a>
        <a href="#" className="text-sm  tracking-wide text-[#B0B0B0] hover:text-white transition-colors">Contact</a>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button className="text-white hover:text-[#FF3C00] transition-colors hover:scale-110 transform duration-300">
          <ShoppingCart size={24} />
        </button>
        <button className="text-white hover:text-[#FF3C00] transition-colors hover:scale-110 transform duration-300">
          <User size={24} />
        </button>
      </div>
    </nav>
  );
}
