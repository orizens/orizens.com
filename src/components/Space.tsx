import './Space.css';

import type { ReactNode } from 'react';

type ISectionProps = {
  children: ReactNode;
  className?: string;
  variant?: 'space' | string;
};

const Space = ({
  children,
  className = undefined,
  variant = undefined,
  ...props
}: ISectionProps) => (
  <div
    className={`${className} ${variant} border border-primaryAlpha`}
    {...props}
  >
    {children}
  </div>
);

export { Space };
