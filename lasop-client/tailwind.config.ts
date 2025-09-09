import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: 'var(--primaryColor)',
        secondary: 'var(--secondaryColor)',
        lightSec: 'var(--lightSecondary)',
        accent: 'var(--accentColor)',
        gradient: 'var(--gradientColor)',
        shadow: 'var(--shadow)',
        footer: 'var(--footer)',
      }
    },
    screens: {
      '3sm': '375px',
      '2sm': '428px',
      'xsm': '575px',
      'sm': '640px',
      'md': '768px',
      'lmd': '920px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }

  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
export default config;
