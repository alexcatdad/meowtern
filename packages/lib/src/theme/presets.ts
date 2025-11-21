export type TerminalThemeName =
  | "btop-classic"
  | "polar-night"
  | "retro-amber"
  | "matrix-green"
  | "red-alert";

export interface TerminalTheme {
  background: string;
  foreground: string;
  accent: string;
  accentMuted: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  border: string;
  grid: string;
}

export const TERMINAL_THEMES: Record<TerminalThemeName, TerminalTheme> = {
  "btop-classic": {
    background: "#03040a",
    foreground: "#f7f6fb",
    accent: "#15f1ff",
    accentMuted: "#00a5bb",
    success: "#7bff69",
    warning: "#ffcb6b",
    danger: "#ff5c7c",
    info: "#68d1ff",
    border: "#1a1e33",
    grid: "rgba(255,255,255,0.08)",
  },
  "polar-night": {
    background: "#090b18",
    foreground: "#d8e8ff",
    accent: "#52cde4",
    accentMuted: "#2f7fa8",
    success: "#89f1c1",
    warning: "#ffd479",
    danger: "#ff6b81",
    info: "#93a7ff",
    border: "#142035",
    grid: "rgba(146,176,255,0.12)",
  },
  "retro-amber": {
    background: "#120b06",
    foreground: "#ffe7c0",
    accent: "#ff9234",
    accentMuted: "#cc5a10",
    success: "#ffd262",
    warning: "#ffae42",
    danger: "#ff4d4d",
    info: "#ffcf99",
    border: "#3c1607",
    grid: "rgba(255,162,92,0.16)",
  },
  "matrix-green": {
    background: "#020805",
    foreground: "#caffc7",
    accent: "#40ff73",
    accentMuted: "#1baa46",
    success: "#5bff8e",
    warning: "#d5ff7c",
    danger: "#ff4e6a",
    info: "#63ffc8",
    border: "#0a2614",
    grid: "rgba(64,255,115,0.18)",
  },
  "red-alert": {
    background: "#1b0505",
    foreground: "#ffecec",
    accent: "#ff6f6f",
    accentMuted: "#a11f30",
    success: "#ffc778",
    warning: "#ff8d36",
    danger: "#ff3b3b",
    info: "#ff8cc1",
    border: "#3a1111",
    grid: "rgba(255,111,111,0.15)",
  },
};

export const getTerminalTheme = (name: TerminalThemeName): TerminalTheme => {
  return TERMINAL_THEMES[name];
};
