import type { ReactNode } from 'react';

type IGradientTextProps = {
  children: ReactNode;
  className?: string;
};

const GradientText = (props: IGradientTextProps) => (
  <span
    className={`bg-gradient-to-br from-accent to-accentLight bg-clip-text text-transparent ${props?.className}`}
  >
    {props.children}
  </span>
);

export { GradientText };
