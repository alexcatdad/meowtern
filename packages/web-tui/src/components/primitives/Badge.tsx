import type React from "react";
import { cn } from "../../utils/cn";

type Variant = "success" | "warning" | "danger" | "info" | "neutral";

type Shape = "pill" | "square";

const variantClasses: Record<Variant, string> = {
  success: "bg-terminal-green/20 text-terminal-green",
  warning: "bg-terminal-yellow/20 text-terminal-yellow",
  danger: "bg-terminal-red/20 text-terminal-red",
  info: "bg-terminal-blue/20 text-terminal-blue",
  neutral: "bg-terminal-brightBlack/30 text-terminal-foreground",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  shape?: Shape;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  shape = "pill",
  dot = false,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide",
        "border border-terminal-gridLine/50",
        "px-2 py-0.5",
        shape === "pill" ? "rounded-full" : "rounded-terminal",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      )}
      {children}
    </span>
  );
};
