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
        black: "var(--black)",
        white: "var(--white)",
        secondary: "var(--secondary)",
        smoke: "var(--smoke)",
        hovered: "var(--hovered)",
        subtle: "var(--subtle)",
      },
    },
  },
  plugins: [],
};
export default config;
