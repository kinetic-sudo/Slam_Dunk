import { ShoppingCart, User } from 'lucide-react';

export default function NavigationBar() {
  return (
    <nav
      className="w-full flex items-center justify-between"
      style={{
        padding: '0 56px',
        height: '80px',
        background: 'rgba(10,10,10,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer group">
        {/* Basketball icon */}
        <div
          className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:border-[#FF3C00]"
          style={{
            width: '36px',
            height: '36px',
            border: '1.5px solid rgba(255,255,255,0.4)',
          }}
        >
          <svg
            viewBox="0 0 32 32"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-white group-hover:text-[#FF3C00] transition-colors"
          >
            <circle cx="16" cy="16" r="12" />
            {/* Vertical seam */}
            <path d="M16 4 C10 10 10 22 16 28" />
            <path d="M16 4 C22 10 22 22 16 28" />
            {/* Horizontal seam */}
            <line x1="4" y1="16" x2="28" y2="16" />
          </svg>
        </div>

        <span
          className="font-heading uppercase tracking-tight text-white group-hover:text-[#FF3C00] transition-colors duration-300"
          style={{ fontSize: '20px', letterSpacing: '-0.01em' }}
        >
          Slam Sore
        </span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-10">
        <a
          href="#"
          className="font-heading uppercase text-white transition-colors text-sm tracking-[0.12em] relative"
          style={{ fontSize: '12px' }}
        >
          Home
          {/* Active underline */}
          <span
            className="absolute -bottom-1 left-0 w-full"
            style={{ height: '2px', background: '#FF3C00' }}
          />
        </a>
        <a
          href="#"
          className="font-heading uppercase text-[#666] hover:text-white transition-colors"
          style={{ fontSize: '12px', letterSpacing: '0.12em' }}
        >
          About us
        </a>
        <a
          href="#"
          className="font-heading uppercase text-[#666] hover:text-white transition-colors"
          style={{ fontSize: '12px', letterSpacing: '0.12em' }}
        >
          Contact
        </a>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button
          className="text-[#888] hover:text-white transition-all duration-200 hover:scale-110 transform relative"
          aria-label="Cart"
        >
          <ShoppingCart size={20} strokeWidth={1.5} />
          {/* Cart badge */}
          <span
            className="absolute flex items-center justify-center font-heading text-white"
            style={{
              top: '-6px',
              right: '-6px',
              width: '14px',
              height: '14px',
              background: '#FF3C00',
              borderRadius: '50%',
              fontSize: '8px',
            }}
          >
            2
          </span>
        </button>
        <button
          className="text-[#888] hover:text-white transition-all duration-200 hover:scale-110 transform"
          aria-label="Account"
        >
          <User size={20} strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  );
}