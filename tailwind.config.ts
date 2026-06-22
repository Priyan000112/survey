import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f1",
          100: "#d6eadb",
          200: "#b3d8bf",
          300: "#86bd99",
          400: "#58946f",
          500: "#2f704c",
          600: "#1f5d3f",
          700: "#184832",
          800: "#133927",
          900: "#102d20"
        },
        accent: {
          50: "#fff9eb",
          100: "#fff0c4",
          200: "#ffe08a",
          300: "#f6cb51",
          400: "#e5b62f",
          500: "#c99a16"
        }
      },
      boxShadow: {
        soft: "0 16px 32px rgba(16, 45, 32, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
