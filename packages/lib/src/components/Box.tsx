import type React from "react";
import { cn } from "../utils/cn";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  title?: string;
  flex?: boolean;
  col?: boolean;
  center?: boolean;
  full?: boolean;
  as?: React.ElementType;
}

export const Box: React.FC<BoxProps> = ({
  children,
  className,
  border = false,
  title,
  flex = false,
  col = false,
  center = false,
  full = false,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "relative",
        flex && "flex",
        col && "flex-col",
        center && "items-center justify-center",
        full && "w-full h-full",
        border && "border border-terminal-brightBlack p-2",
        className,
      )}
      {...props}
    >
      {title && border && (
        <span className="absolute -top-3 left-2 bg-terminal-background px-1 text-sm text-terminal-brightWhite">
          {title}
        </span>
      )}
      {children}
    </Component>
  );
};
