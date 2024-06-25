/* eslint-disable import/no-extraneous-dependencies */
import { DiNpm } from 'react-icons/di';
import { FiBook, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

const socials = [
  { href: '//twitter.com/orizens', Icon: FiTwitter },
  { href: '//www.linkedin.com/in/orenFarhi/', Icon: FiLinkedin },
  { href: '//github.com/orizens', Icon: FiGithub },
  { href: '//link.springer.com/book/10.1007/978-1-4842-2620-9', Icon: FiBook },
  { href: '//www.npmjs.com/~orizens', Icon: DiNpm },
];
export const Socials = () => (
  <div className="mt-3 flex gap-1">
    {socials.map((social) => (
      <a key={`social${social.href}`} href={social.href} target="_blank">
        <social.Icon className="mr-4 h-10 w-8 transition-all hover:scale-125" />
      </a>
    ))}
  </div>
);
