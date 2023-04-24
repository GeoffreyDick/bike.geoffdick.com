// uno.config.ts
import { defineConfig, presetTypography, presetUno } from "unocss";
import presetTheme from "unocss-preset-theme";
import type { Theme } from "unocss/preset-uno";

export default defineConfig<Theme>({
  theme: {},
  presets: [
    // https://unocss.dev/presets/uno
    presetUno(),

    // https://unocss.dev/presets/typography
    presetTypography(),

    // https://github.com/Dunqing/unocss-preset-theme
    presetTheme<Theme>({
      theme: {
        modern: {},
        twentyoughts: {
          colors: {
            base: "#33b1e5",
            content: "#2d52a4",
            primary: "#33b1e5",
            secondary: "#33b1e5",
            accent: "#33b1e5",
          },
        },
        nineteennineties: {
          colors: {
            base: "#ffffff",
            content: "#000000",
            primary: "#8f7ee6",
            secondary: "#f0d133",
            accent: "#edb4da",
          },
        },
        nineteeneighties: {
          fontFamily: {
            sans: "1980s",
          },
          colors: {
            base: "#140627",
            content: "#ffffff",
            primary: "#f0d133",
            secondary: "#8f7ee6",
            accent: "#edb4da",
          },
        },
        nineteenseventies: {},
        nineteessixties: {},
      },
    }),
  ],
});
