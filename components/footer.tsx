import Link from 'next/link';

const footerLinks = [
  { href: '/katalog', label: 'Katalog' },
  { href: '#portofolio', label: 'Portofolio' },
  { href: '#layanan', label: 'Layanan' },
  { href: '#kontak', label: 'Kontak' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#ffffff] border-t border-[#e5e5e5]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span
              className="text-[21px] font-normal text-[#000000]"
              style={{ fontFamily: "'Old Standard TT', 'EB Garamond', Georgia, serif" }}
            >
              blackant studio
            </span>
            <p
              className="text-[15px] font-normal text-[#878787] leading-[1.65] max-w-xs"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Studio kreatif yang menghadirkan karya terbaik untuk Anda.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] font-normal text-[#000000] no-underline hover:text-[#878787] transition-colors duration-150"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Hairline + copyright */}
        <div className="mt-10 pt-6 border-t border-[#e5e5e5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p
            className="text-[13px] font-normal text-[#878787]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            © {year} Blackant Studio. Semua hak dilindungi.
          </p>
          <p
            className="text-[13px] font-normal text-[#878787]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Jakarta, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
