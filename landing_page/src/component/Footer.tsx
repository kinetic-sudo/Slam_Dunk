export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        borderTop: '1px solid #1e1e1e',
        paddingTop: '36px',
        paddingBottom: '36px',
        paddingLeft: '56px',
        paddingRight: '56px',
      }}
    >
      <div
        className="w-full grid items-center"
        style={{
          gridTemplateColumns: '1fr auto 1fr',
          gap: '24px',
        }}
      >
        {/* Left — Copyright */}
        <div>
          <span
            className="font-heading uppercase text-[#333] tracking-[0.18em]"
            style={{ fontSize: '10px' }}
          >
            © {new Date().getFullYear()} Slam Sore. All rights reserved.
          </span>
        </div>

        {/* Center — Legal links */}
        <div className="flex items-center gap-8">
          {['Privacy Policy', 'Terms of Service'].map(label => (
            <a
              key={label}
              href="#"
              className="font-heading uppercase text-[#333] tracking-[0.18em] transition-colors hover:text-[#666]"
              style={{ fontSize: '10px' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right — Support links */}
        <div className="flex items-center justify-end gap-8">
          {['Support', 'Contact Us'].map(label => (
            <a
              key={label}
              href="#"
              className="font-heading uppercase text-[#333] tracking-[0.18em] transition-colors hover:text-[#666]"
              style={{ fontSize: '10px' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}