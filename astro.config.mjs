import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import { astroImageTools } from 'astro-imagetools';
// import AstroPWA from '@vite-pwa/astro';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import mdx from '@astrojs/mdx';
// import packageJson from './package.json';

// https://astro.build/config
export default defineConfig({
  // base: '.', // Set a path prefix.
  site: 'https://orizens.com/', // Use to generate your sitemap and canonical URLs in your final build.
  trailingSlash: 'always', // Use to always append '/' at end of url
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
    },
  },
  vite: {
    ssr: { noExternal: ['react-icons'] },
    plugins: [
      ViteImageOptimizer({
        test: /\.(jpeg|jpg|png|webp)$/i,
      }),
    ],
  },
  integrations: [
    react(),
    tailwind({}),
    mdx(),
    sitemap(),
    robotsTxt(),
    // AstroPWA({
    //   manifest: {
    //     name: 'orizens',
    //     description: `front end engineering and arechitecture articles by Oren Farchi, genereated at ${new Date().getTime()}, version ${
    //       packageJson.version
    //     }`,
    //     short_name: 'orizens',
    //     start_url: '/',
    //     display: 'standalone',
    //     background_color: '#0f182a',
    //     lang: 'en',
    //     scope: `/?${new Date().getTime()}`,
    //   },
    //   workbox: {
    //     navigateFallback: '/',
    //     globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
    //   },
    // }),
    astroImageTools,
  ],
});
