import './Space.css';

import type { ReactNode } from 'react';

type ISectionProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  size?: 'lg' | 'md' | 'sm';
};

const Section = ({
  title = undefined,
  children,
  className = undefined,
  size = 'lg',
  ...props
}: ISectionProps) => (
  <div
    className={`mx-auto ${['max-w-screen-', size].join(
      ''
    )} rounded-xl p-6 text-xl ${className}`}
    {...props}
  >
    {title && <div className="mb-6 text-3xl font-bold">{title}</div>}

    {children}
  </div>
);

export { Section };
