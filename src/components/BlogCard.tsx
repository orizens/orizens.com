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
  <div className="relative grid gap-3 transition-transform">
    <a href={frontmatter?.slug ?? url} className="group">
      <div className="grid grid-cols-1 overflow-hidden rounded-md bg-slate-800 transition-colors duration-200 group-hover:bg-slate-900 md:grid-cols-3">
        <div className="p-4">
          <div className="aspect-w-2 col-auto h-60 p-2 md:aspect-h-1">
            <img
              className="h-full w-full rounded-md object-cover object-center"
              src={frontmatter.imgSrc}
              alt={frontmatter.imgAlt}
              loading="lazy"
            />
          </div>
        </div>

        <div className="col-span-2 p-6">
          <h2 className="text-2xl font-semibold">{frontmatter.title}</h2>

          <div className="mt-1 text-base text-gray-400">
            {format(new Date(frontmatter.pubDate), 'LLL d, yyyy')}
          </div>

          <div className="mt-2 text-sm">{frontmatter?.description}</div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2">
        {frontmatter?.tags ? <StackTags tags={frontmatter.tags} /> : null}
      </div>
    </a>
  </div>
);
