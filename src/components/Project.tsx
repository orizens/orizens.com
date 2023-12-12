import type { ReactNode } from 'react';

import { StackTags } from './StackTags';

type IProjectProps = {
  img?: {
    src: string;
    alt: string;
  };
  name: string;
  description: string;
  link: string;
  tags?: string[];
  category?: ReactNode;
};

const Project = (props: IProjectProps) => (
  <div className="flex flex-col gap-3 gap-x-8 rounded-xl bg-primaryAlpha p-6 md:flex-row">
    <div>
      <div className="mb-3 flex flex-col items-center gap-2 md:flex-row">
        <a className="" href={props.link} target="_blank">
          <div className="text-3xl font-light">{props.name}</div>
        </a>

        {props?.category && (
          <div className="ml-3 flex flex-wrap gap-2">{props.category}</div>
        )}
      </div>
      {props?.tags && <StackTags tags={props.tags} />}

      <p className="mt-3">{props.description}</p>
    </div>
    {props?.img && (
      <div className="w-72 shrink-0">
        <a href={props.link} target="_blank">
          <img
            className="mx-auto h-64 rounded-xl transition-transform hover:scale-110"
            src={props.img.src}
            alt={props.img.alt}
            loading="lazy"
          />
        </a>
      </div>
    )}
  </div>
);

export { Project };
