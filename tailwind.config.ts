import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: "rgb(var(--black) / <alpha-value>)",
        white: "rgb(var(--white) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        smoke: "rgb(var(--smoke) / <alpha-value>)",
        hovered: "rgb(var(--hovered) / <alpha-value>)",
        subtle: "rgb(var(--subtle) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
export default config;
