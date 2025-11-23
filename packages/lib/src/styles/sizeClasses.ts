/**
 * Shared size and color class mappings for components
 */

export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";
export type StatusType = "online" | "offline" | "away" | "busy";

/**
 * Standard size classes for components (width and height)
 */
export const sizeClasses: Record<ComponentSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

/**
 * Size classes for status indicators
 */
export const statusIndicatorSizes: Record<ComponentSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-4 w-4",
};

/**
 * Status color mapping for visual indicators
 */
export const statusColors: Record<StatusType, string> = {
  online: "bg-terminal-green",
  offline: "bg-terminal-brightBlack",
  away: "bg-terminal-yellow",
  busy: "bg-terminal-red",
};

/**
 * Status label mapping for accessibility
 */
export const statusLabels: Record<StatusType, string> = {
  online: "Online",
  offline: "Offline",
  away: "Away",
  busy: "Busy",
};

/**
 * Avatar color palette for hash-based color selection
 */
export const avatarColors = [
  "bg-terminal-red",
  "bg-terminal-green",
  "bg-terminal-yellow",
  "bg-terminal-blue",
  "bg-terminal-magenta",
  "bg-terminal-cyan",
] as const;
