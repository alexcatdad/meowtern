import type React from "react";
import { type TerminalThemeName, getTerminalTheme } from "../../theme/presets";
import { cn } from "../../utils/cn";

export interface ThemeProviderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  preset?: TerminalThemeName;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  preset = "btop-classic",
  className,
  style,
  children,
  ...props
}) => {
  const theme = getTerminalTheme(preset);
  const cssVars = {
    "--terminal-bg": theme.background,
    "--terminal-fg": theme.foreground,
    "--terminal-accent": theme.accent,
    "--terminal-accent-muted": theme.accentMuted,
    "--terminal-success": theme.success,
    "--terminal-warning": theme.warning,
    "--terminal-danger": theme.danger,
    "--terminal-info": theme.info,
    "--terminal-border": theme.border,
    "--terminal-grid": theme.grid,
    backgroundColor: theme.background,
    color: theme.foreground,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      className={cn("min-h-screen font-mono", className)}
      style={cssVars}
      {...props}
    >
      {children}
    </div>
  );
};
