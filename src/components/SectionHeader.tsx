import type { ReactNode } from 'react';

import { GradientText } from './GradientText';
import { Section } from './Section';

type Props = {
  gradient: string;
  children: ReactNode;
  image?: ReactNode;
};
export function SectionHeader({ gradient, children, image = null }: Props) {
  return (
    <Section className="space my-8 border border-primaryAlpha">
      <div className="relative flex flex-col items-center md:flex-row md:justify-between md:gap-x-24">
        <h1 className="my-6 text-3xl">
          {children} <GradientText>{gradient}</GradientText>
        </h1>
        {image}
      </div>
    </Section>
  );
}
