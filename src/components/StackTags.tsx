import { ColorTags, Tags } from 'astro-boilerplate-components';

const tagColors: Record<string, any> = {
  'react.js': ColorTags.TEAL,
  react: ColorTags.TEAL,
  hooks: ColorTags.INDIGO,
  chakraui: ColorTags.EMERALD,
  architecture: ColorTags.STONE,
  functional: ColorTags.SKY,
  gatsby: ColorTags.PURPLE,
  netlify: ColorTags.BLUE,
  typescript: ColorTags.BLUE,
  'clean-code': ColorTags.BLUE,
  firebase: ColorTags.YELLOW,
  firestore: ColorTags.YELLOW,
  cypress: ColorTags.GREEN,
  angular: ColorTags.RED,
  angular1: ColorTags.RED,
  aot: ColorTags.PINK,
  performance: ColorTags.CYAN,
  scss: ColorTags.VIOLET,
  redux: ColorTags.VIOLET,
  'redux-toolkit': ColorTags.VIOLET,
  ngrx: ColorTags.VIOLET,
  'react-hook-form': ColorTags.PINK,
  opensource: ColorTags.FUCHSIA,
  devtools: ColorTags.FUCHSIA,
  npm: ColorTags.ORANGE,
};
export const getTagColor = (tag: string) =>
  tagColors?.[tag.toLowerCase()] ?? ColorTags.LIME;

export const StackTags = ({ tags, className = '' }: any) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {tags.map((tag: string) => (
      <a
        href={`/tags/${tag}/`}
        key={`tag-${tag}`}
        className="transition-transform hover:scale-110"
      >
        <Tags color={getTagColor(tag)}>{tag}</Tags>
      </a>
    ))}
  </div>
);
