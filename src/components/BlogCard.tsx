import type {
  FrontmatterPage,
  MarkdownInstance,
} from 'astro-boilerplate-components';
import { format } from 'date-fns';

import { StackTags } from './StackTags';

interface BlogCardProps extends MarkdownInstance<FrontmatterPage> {
  [key: string]: any;
  frontmatter: any;
}
export const OrizensBlogCard = ({ url, frontmatter }: BlogCardProps) => (
  <a
    className="transition-[transform] hover:scale-105"
    href={frontmatter?.slug ?? url}
  >
    <div className="grid grid-cols-1 overflow-hidden rounded-md bg-slate-800 md:grid-cols-3">
      <div className="aspect-w-3 col-auto h-60 md:aspect-h-1">
        <img
          className="h-full w-full object-cover object-center"
          src={frontmatter.imgSrc}
          alt={frontmatter.imgAlt}
          loading="lazy"
        />
      </div>

      <div className="col-span-2 p-6">
        <h2 className="text-2xl font-semibold">{frontmatter.title}</h2>

        <div className="mt-1 text-xs text-gray-400">
          {format(new Date(frontmatter.pubDate), 'LLL d, yyyy')}
        </div>

        <div className="mt-2 text-sm">{frontmatter?.description}</div>
        <div>{frontmatter?.tags && <StackTags tags={frontmatter.tags} />}</div>
      </div>
    </div>
  </a>
);
