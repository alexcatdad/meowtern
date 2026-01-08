import type React from "react";
import { cn } from "../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variants = {
    primary:
      "bg-terminal-blue text-terminal-white hover:bg-terminal-brightBlue",
    secondary:
      "bg-terminal-brightBlack text-terminal-white hover:bg-terminal-white hover:text-terminal-black",
    danger: "bg-terminal-red text-terminal-white hover:bg-terminal-brightRed",
    ghost:
      "bg-transparent text-terminal-foreground hover:text-terminal-brightWhite hover:bg-terminal-brightBlack/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <button
      className={cn(
        "font-mono transition-colors duration-100 focus:outline-none focus:ring-1 focus:ring-terminal-brightWhite",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
