import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#d6e4ff",
          200: "#adc8ff",
          300: "#84a9ff",
          400: "#6690ff",
          500: "#3366ff",
          600: "#254eda",
          700: "#1939b7",
          800: "#102693",
          900: "#0a1a75"
        }
      }
    }
  },
  plugins: []
};

export default config;
