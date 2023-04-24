import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
	site: 'https://bike.geoffdick.com',
	experimental: {
		assets: true,
	},
	integrations: [
		mdx(),
		sitemap(),
		UnoCSS({
			injectReset: true,
		}),
	],
});
