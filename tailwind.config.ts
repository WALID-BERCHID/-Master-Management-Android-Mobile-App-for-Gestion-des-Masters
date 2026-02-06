import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        peach500: "var(--peach-500)",
        peach400: "var(--peach-400)",
        peach200: "var(--peach-200)",
        pink500: "var(--pink-500)",
        pink200: "var(--pink-200)",
        gold400: "var(--gold-400)"
      },
      boxShadow: {
        soft: "0 20px 40px rgba(255, 138, 101, 0.15)",
        card: "0 18px 40px rgba(43, 27, 23, 0.08)"
      },
      borderRadius: {
        "3xl": "1.75rem"
      }
    }
  },
  plugins: []
};

export default config;
