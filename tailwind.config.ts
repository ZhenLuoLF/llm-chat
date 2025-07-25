import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Tokyo Night Theme Colors
        "tokyo-night": {
          bg: "#1a1b26",
          "bg-alt": "#16161e",
          "bg-dark": "#24283b",
          "bg-float": "#414868",
          fg: "#c0caf5",
          "fg-alt": "#a9b1d6",
          "fg-dark": "#565f89",
          comment: "#565f89",
          cyan: "#7dcfff",
          blue: "#7aa2f7",
          magenta: "#bb9af7",
          orange: "#ff9e64",
          yellow: "#e0af68",
          green: "#9ece6a",
          red: "#f7768e",
          git: {
            add: "#449dab",
            change: "#6183bb", 
            delete: "#914c54",
          },
        },
        // Tokyo Night Light Theme Colors
        "tokyo-light": {
          bg: "#d5d6db",
          "bg-alt": "#e9e9ec",
          "bg-dark": "#dfe0e5",
          "bg-float": "#cbccd1",
          fg: "#565a6e",
          "fg-alt": "#6f7286",
          "fg-dark": "#9699a3",
          comment: "#9699a3",
          cyan: "#166775",
          blue: "#34548a",
          magenta: "#5a4a78",
          orange: "#965027",
          yellow: "#8f5e15",
          green: "#485e30",
          red: "#8c4351",
          git: {
            add: "#1e5768",
            change: "#2e4c7e",
            delete: "#8b4d5b",
          },
        },
      },
      backgroundColor: {
        'primary': 'var(--background)',
        'secondary': 'var(--muted)',
        'muted': 'var(--muted)',
        'accent': 'var(--accent)',
        'secondary-badge': 'var(--secondary-badge)',
      },
      textColor: {
        'primary': 'var(--foreground)',
        'secondary': 'var(--secondary)',
        'muted': 'var(--secondary)',
        'accent': 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        'badge': 'var(--badge-text)',
      },
      borderColor: {
        'primary': 'var(--border)',
        'secondary': 'var(--border)',
        'accent': 'var(--accent)',
      },
    },
  },
  plugins: [],
};
export default config;
