import type React from "react";
import { Box, type BoxProps } from "./Box";

export interface FooterProps extends BoxProps {
  fixed?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  children,
  className,
  fixed = false,
  ...props
}) => {
  return (
    <Box
      as="footer"
      className={`w-full border-t border-terminal-brightBlack bg-terminal-background p-1 flex items-center gap-2 text-xs ${fixed ? "sticky bottom-0 z-10" : ""} ${className}`}
      {...props}
    >
      {children}
    </Box>
  );
};
