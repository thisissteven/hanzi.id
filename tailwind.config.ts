import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
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
        black: "#101010",
        white: "#fefefe",
        secondary: "#d0d0d0",
        smoke: "#3a3d3f",
        hovered: "#242424",
        // hovered: "#0e1a26",
        subtle: "#282828",
      },
    },
  },
  plugins: [],
};
export default config;
