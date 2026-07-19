import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#2E2A22",   // dark ink, used as text atop bright accent buttons
        surface: "#FFFFFF", // card background
        surface2: "#F6F1E4", // secondary panel / input background
        amber: "#F2A65A",   // highlight accent (tags, primary buttons)
        mint: "#2F9C82",    // secondary accent (links, success)
        ink: "#2E2A22",     // primary text
        muted: "#8C8573",   // secondary text
        line: "#E4DBC8",    // borders
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        body: ["var(--font-body)", "sans-serif"],
        jp: ["var(--font-jp)", "sans-serif"],
        mono: ["var(--font-mono)", "sans-serif"],
      },
      borderRadius: {
        frame: "22px",
      },
    },
  },
  plugins: [],
};
export default config;
