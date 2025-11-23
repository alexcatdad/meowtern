/**
 * Reusable Tailwind CSS utility class constants
 * Reduces duplication of commonly repeated className patterns
 */

// Text utilities
export const textSmallDim = "text-xs text-terminal-brightBlack";
export const textSmallForeground = "text-xs text-terminal-foreground";
export const textSmallSecondary = "text-xs text-terminal-brightBlack/70";
export const textMutedForeground = "text-terminal-brightBlack";
export const textPrimary = "text-terminal-foreground";

// Layout utilities
export const flexCenter = "flex items-center";
export const flexCenterGap = "flex items-center gap-2";
export const flexCenterGap3 = "flex items-center gap-3";
export const flexBetween = "flex items-center justify-between";
export const flexBetweenGap = "flex items-center justify-between gap-2";
export const flexStart = "flex items-start";
export const flexCol = "flex flex-col";
export const flexColGap = "flex flex-col gap-2";

// Border utilities
export const borderLight = "border border-terminal-gridLine";
export const borderBottom = "border-b border-terminal-gridLine";
export const borderRight = "border-r border-terminal-gridLine";
export const borderTop = "border-t border-terminal-gridLine";

// Padding/margin utilities
export const padSmall = "px-2 py-1";
export const padMedium = "px-3 py-2";
export const padLarge = "px-4 py-3";
export const padHorizontalSmall = "px-2";
export const padHorizontalMedium = "px-3";
export const padVerticalSmall = "py-1";
export const padVerticalMedium = "py-2";

// Button/Interactive utilities
export const buttonBase =
  "font-mono text-sm transition-colors focus:outline-none";
export const buttonSmall =
  "px-2 py-1 text-xs font-mono transition-colors focus:outline-none";
export const buttonHoverDefault =
  "hover:bg-terminal-brightBlack/20 focus:bg-terminal-brightBlack/20";
export const buttonHoverDestructive =
  "hover:bg-terminal-red/10 focus:bg-terminal-red/10";
export const buttonDisabled = "cursor-not-allowed opacity-50";

// Table/Grid utilities
export const rowBase = "flex w-full items-center";
export const rowHover = "transition-colors hover:bg-terminal-brightBlack/10";
export const rowPadding = "px-3 py-2";

// Menu/Dropdown utilities
export const menuItem =
  "flex w-full items-center gap-2 px-3 py-1.5 text-sm font-mono text-left transition-colors focus:outline-none";
export const menuItemDestructive =
  "text-terminal-red hover:bg-terminal-red/10 focus:bg-terminal-red/10";
export const menuItemDefault =
  "text-terminal-foreground hover:bg-terminal-brightBlack/20 focus:bg-terminal-brightBlack/20";

// Background utilities
export const bgDefault = "bg-terminal-background";
export const bgMuted = "bg-terminal-brightBlack/5";
export const bgMutedStrong = "bg-terminal-brightBlack/10";

// Status/Color utilities
export const textSuccess = "text-terminal-green";
export const textError = "text-terminal-red";
export const textWarning = "text-terminal-yellow";
export const textInfo = "text-terminal-cyan";

// Overflow/Scroll utilities
export const scrollbarHide = "scrollbar-hide";
export const overflowAuto = "overflow-auto";
export const overflowHidden = "overflow-hidden";

// Rounded utilities
export const roundSmall = "rounded-sm";
export const roundMedium = "rounded-md";
export const roundFull = "rounded-full";

// Shadow utilities
export const shadowSmall = "shadow-sm";
export const shadowDefault = "shadow";
export const shadowLarge = "shadow-lg";
