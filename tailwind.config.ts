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
        "arcade-bg": "#0f0e17",
        "arcade-card": "#1a1a2e",
        "arcade-green": "#2de370",
        "arcade-red": "#ff5555",
        "arcade-yellow": "#ffe66d",
        "arcade-purple": "#a855f7",
        "arcade-text": "#ffffff",
        "arcade-muted": "#a0a0b0",
        "arcade-border": "#2a2a4a",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        "coin-spin": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        "press-down": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(2px)" },
        },
        "coin-rain": {
          "0%": { transform: "translateY(-100%)", opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px currentColor, 0 0 10px currentColor",
          },
          "50%": {
            boxShadow: "0 0 20px currentColor, 0 0 40px currentColor",
          },
        },
      },
      animation: {
        "coin-spin": "coin-spin 1s linear infinite",
        shake: "shake 0.5s ease-in-out",
        "press-down": "press-down 0.1s ease-in-out",
        "coin-rain": "coin-rain 1.5s linear infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
