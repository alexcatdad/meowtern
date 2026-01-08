import type React from "react";
import { cn } from "../utils/cn";

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "dim"
    | "bold"
    | "error"
    | "success"
    | "warning"
    | "info";
  as?: React.ElementType;
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  variant = "default",
  as: Component = "span",
  ...props
}) => {
  const variants = {
    default: "text-terminal-foreground",
    dim: "text-terminal-brightBlack",
    bold: "font-bold text-terminal-brightWhite",
    error: "text-terminal-red",
    success: "text-terminal-green",
    warning: "text-terminal-yellow",
    info: "text-terminal-blue",
  };

  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
};
