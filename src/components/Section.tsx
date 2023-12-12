import './Space.css';

import type { ReactNode } from 'react';

type ISectionProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  size?: 'lg' | 'md' | 'sm';
};

const Section = ({
  title = undefined,
  children,
  className = undefined,
  containerClassName = undefined,
  size = 'lg',
  ...props
}: ISectionProps) => (
  <div
    className={`mx-auto ${['max-w-screen-', size].join(
      ''
    )} rounded-xl text-xl ${containerClassName}`}
    {...props}
  >
    <section className={`mx-auto rounded-xl p-6 ${className}`}>
      {title && <div className="mb-6 text-3xl font-bold">{title}</div>}

      {children}
    </section>
  </div>
);

export { Section };
