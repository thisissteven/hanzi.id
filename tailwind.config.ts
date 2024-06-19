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
        chinese: ["var(--font-chinese)", ...defaultTheme.fontFamily.sans],
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

        // black: "#242424",
        softblack: "#181818",
        zinc: "#202020",
        softzinc: "#323232",
        wheat: "#bcb98a",
        mossgreen: "#899a5c",
        empty: "#505050",
        border: "#363636",
        smokewhite: "#e5e5e5",
        "light-smokewhite": "#e0e0e0",
        gray: "#888888",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
