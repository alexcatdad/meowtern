import type React from "react";
import { cn } from "../../utils/cn";
import { Surface, type SurfaceProps } from "../primitives/Surface";

type BorderStyle = "single" | "double" | "dashed" | "none";

const borderStyles: Record<BorderStyle, string> = {
  single: "ring-1 ring-terminal-gridLine/50",
  double:
    "ring-2 ring-terminal-accent/40 shadow-[0_0_25px_rgba(21,241,255,0.2)]",
  dashed: "border border-dashed border-terminal-gridLine/60",
  none: "",
};

export interface TerminalBoxProps extends SurfaceProps {
  title?: string;
  subtitle?: string;
  toolbar?: React.ReactNode;
  borderStyle?: BorderStyle;
  badge?: React.ReactNode;
}

export const TerminalBox: React.FC<TerminalBoxProps> = ({
  children,
  className,
  title,
  subtitle,
  toolbar,
  borderStyle = "single",
  badge,
  variant = "sunken",
  ...props
}) => {
  return (
    <Surface
      variant={variant}
      className={cn(
        "relative overflow-hidden",
        borderStyles[borderStyle],
        className,
      )}
      {...props}
    >
      {(title || toolbar) && (
        <div className="mb-3 flex items-center justify-between border-b border-terminal-gridLine/40 pb-2 text-xs uppercase tracking-widest text-terminal-accent">
          <div className="flex flex-col">
            <span className="text-terminal-foreground">{title}</span>
            {subtitle && (
              <span className="text-[10px] font-medium text-terminal-accent/60">
                {subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-terminal-foreground">
            {badge}
            {toolbar}
          </div>
        </div>
      )}
      {children}
    </Surface>
  );
};
