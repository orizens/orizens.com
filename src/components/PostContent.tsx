import type { IFrontmatter } from 'astro-boilerplate-components';
import type { ReactNode } from 'react';

type IPostContentProps = {
  content: IFrontmatter;
  children: ReactNode;
};

const PostContent = (props: IPostContentProps) => (
  <div className="mx-auto mt-5 max-w-prose">
    <div className="aspect-h-2 aspect-w-3">
      <img
        className="h-full w-full rounded-lg object-cover object-center"
        src={props.content.imgSrc}
        alt={props.content.imgAlt}
        loading="lazy"
      />
    </div>

    <div className="prose prose-invert mt-8 text-xl leading-9 prose-img:rounded-lg">
      {props.children}
    </div>
  </div>
);

export { PostContent };
