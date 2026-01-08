import type React from "react";
import { cn } from "../../utils/cn";

type Gap = "none" | "xs" | "sm" | "md" | "lg";

const gapClasses: Record<Gap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export interface TerminalGridProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
  minColumnWidth?: number;
  gap?: Gap;
  autoRows?: string;
}

export const TerminalGrid: React.FC<TerminalGridProps> = ({
  children,
  className,
  columns,
  minColumnWidth = 24,
  gap = "md",
  style,
  autoRows,
  ...props
}) => {
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: columns
      ? `repeat(${columns}, minmax(0, 1fr))`
      : `repeat(auto-fit, minmax(${minColumnWidth}ch, 1fr))`,
    gridAutoRows: autoRows,
    ...style,
  };

  return (
    <div
      className={cn(
        "grid text-sm text-terminal-foreground",
        gapClasses[gap],
        className,
      )}
      style={gridStyle}
      {...props}
    >
      {children}
    </div>
  );
};
