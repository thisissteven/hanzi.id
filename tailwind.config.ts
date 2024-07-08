import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        b: "0 4px 0",
        "b-small": "0 2px 0",
        "t-small": "0 -2px 0",
      },
      colors: {
        black: "rgb(var(--black) / <alpha-value>)",
        white: "rgb(var(--white) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        smoke: "rgb(var(--smoke) / <alpha-value>)",
        hovered: "rgb(var(--hovered) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",

        softblack: "rgb(var(--softblack) / <alpha-value>)",
        zinc: "rgb(var(--zinc) / <alpha-value>)",
        softzinc: "rgb(var(--softzinc) / <alpha-value>)",
        wheat: "rgb(var(--wheat) / <alpha-value>)",
        mossgreen: "rgb(var(--mossgreen) / <alpha-value>)",
        empty: "rgb(var(--empty) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        smokewhite: "rgb(var(--smokewhite) / <alpha-value>)",
        "light-smokewhite": "rgb(var(--light-smokewhite) / <alpha-value>)",
        lightgray: "rgb(var(--lightgray) / <alpha-value>)",
      },
      keyframes: {
        blink: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0",
          },
        },
      },
      animation: {
        blink: "blink 1s infinite 1s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
