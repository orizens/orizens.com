import type { MarkdownInstance } from 'astro';
import type { IFrontmatter } from 'astro-boilerplate-components';

import { OrizensBlogCard } from './BlogCard';

type IRecentPostsProps = {
  postList: MarkdownInstance<IFrontmatter>[];
};

const BlogCollection = (props: IRecentPostsProps) => (
  <div className="grid grid-cols-1 gap-10">
    {props.postList.map((elt) => (
      <OrizensBlogCard key={elt.url} {...elt} />
    ))}
  </div>
);

export { BlogCollection };
