/* eslint-disable import/no-extraneous-dependencies */
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

import { PlanetMark } from '@/components/PlanetMark';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Writing' },
  { href: '/#work', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

const SOCIALS = [
  { href: '//github.com/orizens', label: 'GitHub', Icon: FiGithub },
  {
    href: '//www.linkedin.com/in/orenFarhi/',
    label: 'LinkedIn',
    Icon: FiLinkedin,
  },
  { href: '/contact/', label: 'Email', Icon: FiMail },
];

const SiteFooter = () => (
  <footer className="relative z-[1] mt-24 border-t border-cool bg-cosmic-950/90">
    <div className="mx-auto max-w-content px-5 py-12 sm:px-6 lg:px-10 xl:px-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="Orizens — home"
        >
          <PlanetMark className="h-9 w-9" />
          <span className="font-display text-xl font-semibold text-ink-primary">
            Orizens
          </span>
        </a>

        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 font-sans"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-2">
          {SOCIALS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('/') ? undefined : '_blank'}
              rel={href.startsWith('/') ? undefined : 'noopener noreferrer'}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-cool bg-cosmic-800/70 text-ink-secondary transition-colors hover:border-cool-hover hover:text-ink-primary"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-cool pt-6 text-sm text-ink-muted sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} Orizens. Building a brighter tomorrow.
        </p>
        <p className="hand text-lg text-ink-secondary">
          Thanks for being here. — Oren
        </p>
      </div>
    </div>
  </footer>
);

export { SiteFooter };
