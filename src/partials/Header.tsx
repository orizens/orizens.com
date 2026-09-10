import { useEffect, useState } from 'react';

import { PlanetMark } from '@/components/PlanetMark';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Writing' },
  { href: '/#work', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

const isActive = (href: string, path: string) => {
  if (href === '/') return path === '/';
  if (href.startsWith('/#')) return false;
  return path === href || path.startsWith(href);
};

const MailIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const Header = ({ pathname = '/' }: { pathname?: string }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState(pathname);

  useEffect(() => {
    setPath(window.location.pathname);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-cool bg-cosmic-950/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 sm:px-6 lg:px-10 xl:px-12">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="Orizens — home"
        >
          <PlanetMark className="h-14 drop-shadow-[0_0_14px_rgba(41,198,255,0.45)]" />
          <span className="sr-only font-display text-2xl font-semibold tracking-tight text-ink-primary">
            Orizens
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 font-display md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href, path) ? 'page' : undefined}
              className={`rounded-lg px-3 py-2 text-[0.95rem] font-medium transition-colors ${
                isActive(link.href, path)
                  ? 'text-shadow-lg text-primary'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {link.label}
              {isActive(link.href, path) && (
                <span className="mx-3 mt-1 block h-0.5 rounded-full bg-brand" />
              )}
            </a>
          ))}
        </nav>

        <a
          href="/contact/"
          className="c-btn c-btn-primary hidden text-sm md:inline-flex"
        >
          <MailIcon />
          Let&apos;s Connect
        </a>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-cool bg-cosmic-800/70 text-ink-primary md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`md:hidden ${
          open ? 'block' : 'hidden'
        } border-t border-cool bg-cosmic-950/95 backdrop-blur-md`}
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex max-w-content flex-col gap-1 px-5 py-4 font-display"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href, path) ? 'page' : undefined}
              className={`rounded-xl px-4 py-3 text-lg font-medium ${
                isActive(link.href, path)
                  ? 'bg-primaryAlpha text-ink-primary'
                  : 'text-ink-secondary hover:bg-primaryAlpha hover:text-ink-primary'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/contact/"
            onClick={() => setOpen(false)}
            className="c-btn c-btn-primary mt-3 w-full"
          >
            <MailIcon />
            Let&apos;s Connect
          </a>
        </nav>
      </div>
    </header>
  );
};

export { Header };
