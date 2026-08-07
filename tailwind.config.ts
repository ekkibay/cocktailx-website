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
        /* Klima-gesteuert: zeigen auf die CSS-Variablen aus globals.css.
           :root ist ON ICE, .legacy-warm haelt das alte Klima fuer Catering.
           Deshalb hier nichts hartcodieren. */
        licorice: "rgb(var(--c-ground) / <alpha-value>)",
        jambalaya: "rgb(var(--c-deep) / <alpha-value>)",
        tangerine: "rgb(var(--c-accent) / <alpha-value>)",
        bone: "rgb(var(--c-text) / <alpha-value>)",
        /* Neue Rollen, die es im Sommer-CI nicht gab */
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        hairline: "rgb(var(--c-line) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        "accent-soft": "rgb(var(--c-accent-soft) / <alpha-value>)",
        /* Klimafest: Akzente, die in beiden Welten gleich bleiben */
        hibiscus: "#bd256e",
        "bay-of-many": "#223a7b",
        everglade: "#1a4620",
        /* Cocktail X Catering CI */
        "ct-cream": "#F6E6C9",
        "ct-green": "#00674F",
        "ct-navy": "#004369",
        "ct-wine": "#7F1734",
        "ct-red": "#E63946",
      },
      fontFamily: {
        display: ["RousseauDeco", "system-ui", "sans-serif"],
        body: ["Geist", "system-ui", "sans-serif"],
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
