// uno.config.ts
import { defineConfig, presetTypography, presetUno } from 'unocss';
// import presetTheme from "unocss-preset-theme";
import transformerDirectives from '@unocss/transformer-directives';
import type { Theme } from 'unocss/preset-uno';

export default defineConfig<Theme>({
	theme: {
		colors: {
			base: {
				100: '#f3f3f2',
			},
		},
		fontFamily: {
			sans: '"Roboto FlexVariable", sans-serif',
			display: '"Radio CanadaVariable", sans-serif',
		},
	},
	presets: [
		// https://unocss.dev/presets/uno
		presetUno(),

		// https://unocss.dev/presets/typography
		presetTypography({
			cssExtend: {
				'h1,h2,h3,h4,h5,h6': {
					'font-weight': '700',
				},
			},
		}),

		// https://github.com/Dunqing/unocss-preset-theme
		// presetTheme<Theme>({
		//   theme: {
		//     dark: {
		//       fontFamily: {
		//         sans: '"Roboto FlexVariable", sans-serif',
		//         display: '"Radio CanadaVariable", sans-serif',
		//       },
		//     },
		//   },
		// }),
	],
	transformers: [transformerDirectives()],
});
