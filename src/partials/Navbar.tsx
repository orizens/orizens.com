import './Navbar.css';

import { NavbarTwoColumns, Section } from 'astro-boilerplate-components';

import { Logo } from '@/components/Logo';

import orizensPlanet from './orizens-planet.png';

const NavLink = ({ href, children, ...props }: any) => (
  <a href={href} {...props}>
    <div className="bg-transparent text-xl shadow-xl shadow-transparent transition-all hover:shadow-primary md:text-lg">
      {children}
    </div>
  </a>
);
const Navbar = () => (
  <Section>
    <NavbarTwoColumns>
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

      <nav className="mx-auto mt-10 flex gap-6 sm:mt-0 md:mx-0">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/blog/">Blog</NavLink>
        <NavLink href="/about/">About</NavLink>
        <NavLink href="/tags/">Tags</NavLink>
        <NavLink href="/contact/">Contact</NavLink>
      </nav>
    </NavbarTwoColumns>
  </Section>
);

export { Navbar };
