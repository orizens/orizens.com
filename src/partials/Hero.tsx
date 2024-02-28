import { HeroAvatar } from 'astro-boilerplate-components';

import { GradientText } from '@/components/GradientText';
import { ProfileAvatar } from '@/components/profile';
import { Section } from '@/components/Section';

import { Socials } from './Socials';

const Hero = () => (
  <Section
    size="lg"
    containerClassName="my-14 px-6"
    className="space border border-primaryAlpha"
  >
    <HeroAvatar
      title={
        <>
          Hi there, I'm <GradientText>Oren Farchi</GradientText>
        </>
      }
      description={
        <p>
          I'm an Experienced Software Engineer, Front End Tech Lead, focusing on{' '}
          <strong className="italic">
            Front End &amp; Software Architecture
          </strong>{' '}
          and creating well formed applications.
        </p>
      }
      avatar={
        <a href="/about/">
          <ProfileAvatar className="transition-all hover:scale-110" />
        </a>
      }
      socialButtons={<Socials />}
    />
  </Section>
);

export { Hero };
