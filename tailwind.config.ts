import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#14172B",
        surface: "#1E2240",
        surface2: "#262B52",
        amber: "#F2A65A",
        mint: "#7FD9C4",
        ink: "#F5F3EE",
        muted: "#9497B8",
        line: "#343A66",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        jp: ["var(--font-jp)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        frame: "22px",
      },
    },
  },
  plugins: [],
};
export default config;
