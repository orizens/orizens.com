import type { ReactNode } from 'react';

type ILogoProps = {
  icon: ReactNode;
  name: string;
};

const Logo = (props: ILogoProps) => (
  <div className="flex items-center text-3xl font-bold text-primary">
    {props.icon}

    {props.name}
  </div>
);

export { Logo };
