import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

/** theme.css 변수 참조 (hex·rgb 모두 지원, /80 투명도 포함) */
const fromTheme = (variable: string) => `var(${variable})`;

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
          50: fromTheme("--brand-50"),
          100: fromTheme("--brand-100"),
          200: fromTheme("--brand-200"),
          300: fromTheme("--brand-300"),
          600: fromTheme("--brand-600"),
          800: fromTheme("--brand-800"),
          900: fromTheme("--brand-900"),
          950: fromTheme("--brand-950"),
        },
        ink: {
          50: fromTheme("--ink-50"),
          100: fromTheme("--ink-100"),
          200: fromTheme("--ink-200"),
          500: fromTheme("--ink-500"),
          600: fromTheme("--ink-600"),
          700: fromTheme("--ink-700"),
          800: fromTheme("--ink-800"),
          900: fromTheme("--ink-900"),
          950: fromTheme("--ink-950"),
        },
        surface: {
          DEFAULT: fromTheme("--surface"),
          muted: fromTheme("--surface-muted"),
          inverse: fromTheme("--surface-inverse"),
        },
      },
    },
  },
  plugins: [],
};
export default config;
