import './BlogPost.css';

import type { IFrontmatter } from 'astro-boilerplate-components';
import { PostHeader } from 'astro-boilerplate-components';
import type { ReactNode } from 'react';

import { PostContent } from '@/components/PostContent';
import { Section } from '@/components/Section';
import { StackTags } from '@/components/StackTags';
import { AppConfig } from '@/utils/AppConfig';

type IBlogPostProps = {
  frontmatter: IFrontmatter & { tags?: string[] };
  children: ReactNode;
};

const BlogPost = (props: IBlogPostProps) => (
  <Section>
    <PostHeader content={props.frontmatter} author={AppConfig.author} />
    <Section>
      <StackTags
        tags={props.frontmatter?.tags as any}
        className="justify-center"
      />
    </Section>
    <PostContent content={props.frontmatter}>{props.children}</PostContent>
  </Section>
);

export { BlogPost };
