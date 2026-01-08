import type React from "react";
import { Box, type BoxProps } from "./Box";

export interface HeaderProps extends BoxProps {
  fixed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  children,
  className,
  fixed = false,
  ...props
}) => {
  return (
    <Box
      as="header"
      className={`w-full border-b border-terminal-brightBlack bg-terminal-background p-2 flex items-center justify-between ${fixed ? "sticky top-0 z-10" : ""} ${className}`}
      {...props}
    >
      {children}
    </Box>
  );
};
