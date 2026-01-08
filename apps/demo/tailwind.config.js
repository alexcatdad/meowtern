/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../lib/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: "#03040a",
          red: "#ff5c7c",
          green: "#5bff8e",
          yellow: "#ffcb6b",
          blue: "#68d1ff",
          magenta: "#ff8cc1",
          cyan: "#15f1ff",
          white: "#f7f6fb",
          accent: "#15f1ff",
          accentMuted: "#00a5bb",
          success: "#7bff69",
          warning: "#ffcb6b",
          danger: "#ff5c7c",
          info: "#68d1ff",
          brightBlack: "#2f3247",
          brightRed: "#ff7894",
          brightGreen: "#80ffa9",
          brightYellow: "#ffe08f",
          brightBlue: "#8bdcff",
          brightMagenta: "#ff9fd2",
          brightCyan: "#5cfff5",
          brightWhite: "#ffffff",
          background: "#03040a",
          foreground: "#f7f6fb",
          panel: "#080b18",
          overlay: "rgba(3,4,10,0.92)",
          gridLine: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        mono: [
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      boxShadow: {
        "terminal-window": "0 0 0 1px rgba(255,255,255,0.05)",
        glow: "0 0 8px rgba(97,214,214,0.45)",
      },
      borderRadius: {
        terminal: "4px",
      },
      gridTemplateColumns: {
        "terminal-2": "repeat(2, minmax(0, 1fr))",
        "terminal-3": "repeat(3, minmax(0, 1fr))",
        "terminal-4": "repeat(4, minmax(0, 1fr))",
        "terminal-fluid": "repeat(auto-fit, minmax(16rem, 1fr))",
      },
      gridAutoRows: {
        terminal: "minmax(120px, auto)",
      },
      keyframes: {
        glow: {
          "0%": { opacity: 0.4 },
          "100%": { opacity: 1 },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        glow: "glow 1.5s ease-in-out infinite alternate",
        scanline: "scanline 2s linear infinite",
        "progress-fast": "progress 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
