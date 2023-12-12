import type { MarkdownInstance } from 'astro';
import type { IFrontmatter } from 'astro-boilerplate-components';

import { BlogCollection } from '@/components/BlogCollection';
import { GradientText } from '@/components/GradientText';
import { Section } from '@/components/Section';

type IRecentPostsProps = {
  postList: MarkdownInstance<IFrontmatter>[];
};

const RecentPosts = (props: IRecentPostsProps) => (
  <Section
    containerClassName="my-10"
    title={
      <div className="flex items-baseline justify-between">
        <div>
          Recent <GradientText>Posts</GradientText>
        </div>

        <div className="text-sm">
          <a href="/blog/">View all Posts →</a>
        </div>
      </div>
    }
  >
    <BlogCollection postList={props.postList} />
  </Section>
);

export { RecentPosts };
