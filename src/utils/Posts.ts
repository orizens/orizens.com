import type {
  IFrontmatter,
  MarkdownInstance,
} from 'astro-boilerplate-components';

export const sortByDate = (
  posts: MarkdownInstance<OrizensPostFrontMatter>[]
) => {
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.pubDate).valueOf() -
      new Date(a.frontmatter.pubDate).valueOf()
  );
};

export function countTags(posts: any[]) {
  return posts
    .flatMap((post) => post.frontmatter.tags || []) // Extract tags from each post
    .filter((tag) => tag !== undefined) // Filter out undefined tags
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1; // Update tag count
      return acc;
    }, {});
}

export type OrizensPostFrontMatter = IFrontmatter & { tags: string[] };
