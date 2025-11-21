import type React from "react";
import { cn } from "../../utils/cn";

type Align = "left" | "center" | "right";

export interface MonoTextProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  align?: Align;
  muted?: boolean;
  truncate?: boolean;
  wrap?: boolean;
}

export const MonoText: React.FC<MonoTextProps> = ({
  as: Component = "div",
  children,
  className,
  align = "left",
  muted = false,
  truncate = false,
  wrap = true,
  ...props
}) => {
  return (
    <Component
      className={cn(
        "font-mono text-sm",
        align === "center" && "text-center",
        align === "right" && "text-right",
        muted && "text-terminal-brightBlack",
        !wrap && "whitespace-nowrap",
        truncate && "truncate",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
