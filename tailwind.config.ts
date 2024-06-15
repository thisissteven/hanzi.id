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
        primary: "#5f9bf1",
        secondary: "#415065",
        tertiary: "#aeb8c7",
        softblack: "#1e1e1e",
        black: "#171719",
        deepblack: "#050a0e",
        white: "#fefefe",
        highlight: "#3a72df",
        "highlight-soft": "#374b64",
      },
    },
  },
  plugins: [],
};
export default config;
