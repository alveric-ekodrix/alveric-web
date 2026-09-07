import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#627D98",
          500: "#486581",
          600: "#334E68",
          700: "#243B53",
          800: "#102A43",
          900: "#0B2239",
          950: "#071524",
        },
        gold: {
          50: "#FAF7EE",
          100: "#F4ECD2",
          200: "#E9D8A5",
          300: "#DEC477",
          400: "#D4B04A",
          500: "#C9972B",
          600: "#B58420",
          700: "#966A16",
          800: "#7A5311",
          900: "#5D3E0C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(201, 151, 43, 0.25)",
        navy: "0 10px 30px -5px rgba(11, 34, 57, 0.15)",
        premium: "0 20px 40px -15px rgba(11, 34, 57, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
