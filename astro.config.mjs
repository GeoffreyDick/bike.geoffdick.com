import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/lib/plugins/remarkReadingTime.mjs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	site: 'https://bike.geoffdick.com',
	experimental: {
		assets: true,
	},
	markdown: {
		remarkPlugins: [remarkReadingTime],
	},
	integrations: [
		mdx(),
		sitemap(),
		UnoCSS({
			injectReset: '@unocss/reset/tailwind-compat.css',
		}),
		svelte(),
	],
});
