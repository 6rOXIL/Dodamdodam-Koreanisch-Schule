import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const withAlpha = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: withAlpha("--brand-50"),
          100: withAlpha("--brand-100"),
          200: withAlpha("--brand-200"),
          300: withAlpha("--brand-300"),
          600: withAlpha("--brand-600"),
          800: withAlpha("--brand-800"),
          900: withAlpha("--brand-900"),
          950: withAlpha("--brand-950"),
        },
        ink: {
          50: withAlpha("--ink-50"),
          100: withAlpha("--ink-100"),
          200: withAlpha("--ink-200"),
          500: withAlpha("--ink-500"),
          600: withAlpha("--ink-600"),
          700: withAlpha("--ink-700"),
          800: withAlpha("--ink-800"),
          900: withAlpha("--ink-900"),
          950: withAlpha("--ink-950"),
        },
        surface: {
          DEFAULT: withAlpha("--surface"),
          muted: withAlpha("--surface-muted"),
          inverse: withAlpha("--surface-inverse"),
        },
        "on-inverse": withAlpha("--on-inverse"),
      },
    },
  },
  plugins: [],
};
export default config;
