import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        licorice: "#191513",
        jambalaya: "#523113",
        tangerine: "#f39200",
        hibiscus: "#bd256e",
        "bay-of-many": "#223a7b",
        everglade: "#1a4620",
        bone: "#e4d6c5",
      },
      fontFamily: {
        display: ['"RousseauDeco"', "serif"],
        body: ['"Geist"', "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
