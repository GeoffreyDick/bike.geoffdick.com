// uno.config.ts
import { defineConfig, presetTypography, presetUno } from "unocss";
// import presetTheme from "unocss-preset-theme";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import type { Theme } from "unocss/preset-uno";

export default defineConfig<Theme>({
  shortcuts: [
    [
      "w-wider",
      "@xl/article:(-mx-8 w-[calc(100% + 4rem)]) @4xl/article:(-mx-16 w-[calc(100% + 8rem)])",
    ],
  ],
  theme: {
    colors: {
      primary: {
        "50": "#faf8ec",
        "100": "#f3ecce",
        "200": "#e8d7a0",
        "300": "#dbbd69",
        "400": "#cfa340",
        "500": "#bf8e33",
        "600": "#ab742b",
        "700": "#845324",
        "800": "#6f4424",
        "900": "#5f3a24",
        "950": "#371e11",
      },
      secondary: {
        "50": "#f6f9f4",
        "100": "#e9f3e5",
        "200": "#d4e6cc",
        "300": "#b2d1a4",
        "400": "#95bd84",
        "500": "#659750",
        "600": "#507b3e",
        "700": "#406233",
        "800": "#364f2c",
        "900": "#2d4126",
        "950": "#152211",
      },
      base: {
        "50": "#f8f6f2",
        "100": "#f4f1ec",
        "200": "#ebe7db",
        "300": "#ddd9c5",
        "400": "#c9c4a1",
        "500": "#b0ad82",
        "600": "#97966d",
        "700": "#7d7d59",
        "800": "#65674c",
        "900": "#555747",
        "950": "#2a2c21",
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
        "h1,h2,h3,h4,h5,h6": {
          "font-weight": "700",
        },
        "figure": {
          "margin": "4rem 0",
        },
        "figure figcaption": {
          "margin-top": "0.5rem",
        },
        "figure figcaption a": {
          color: "inherit",
        },
        "blockquote": {
          "border-left": ".25em solid #ab742b",
        },
        "a": {
          color: "#ab742b",
          "text-decoration": "none",
        },
        "a:hover": {
          "text-decoration": "underline",
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
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
