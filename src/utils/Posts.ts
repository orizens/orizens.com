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

/**
 * Derive a short plain-text excerpt from a post's markdown body. Posts don't
 * carry a `description` in frontmatter, so we clean the raw content instead of
 * inventing copy.
 */
export function getExcerpt(
  post: { frontmatter?: { description?: string }; rawContent?: () => string },
  length = 160
): string {
  const explicit = post.frontmatter?.description;
  if (explicit) return explicit;

  const raw = typeof post.rawContent === 'function' ? post.rawContent() : '';
  const text = raw
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[#>*_`~-]+/g, ' ') // md punctuation
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= length) return text;
  return `${text.slice(0, text.lastIndexOf(' ', length) || length).trim()}…`;
}

export type OrizensPostFrontMatter = IFrontmatter & { tags: string[] };
