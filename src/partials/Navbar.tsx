import './Navbar.css';

import { Logo } from '@/components/Logo';
import { Section } from '@/components/Section';

import orizensPlanet from './orizens-planet.png';

const NavLink = ({ href, children, ...props }: any) => (
  <a href={href} {...props}>
    <div className="rounded-xl bg-transparent px-2 py-1 text-xl shadow-xl shadow-transparent transition-all hover:shadow-primary md:text-lg">
      {children}
    </div>
  </a>
);
const Navbar = () => (
  <Section containerClassName="px-3">
    <header className="mx-auto flex max-w-screen-md flex-col items-center sm:flex-row sm:justify-between">
      <a href="/">
        <Logo
          icon={
            <img
              {...orizensPlanet}
              className="drop-shadow-primary mr-1 h-14 w-14 rounded-full bg-primary"
            />
          }
          name="rizens"
        />
      </a>

      <nav className="mx-auto mt-10 flex gap-2 sm:mt-0 md:mx-0">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/blog/">Blog</NavLink>
        <NavLink href="/about/">About</NavLink>
        <NavLink href="/tags/">Tags</NavLink>
        <NavLink href="/contact/">Contact</NavLink>
      </nav>
    </header>
  </Section>
);

export { Navbar };
