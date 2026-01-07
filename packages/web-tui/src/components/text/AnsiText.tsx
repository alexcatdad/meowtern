import type React from "react";
import { parseAnsi } from "../../utils/ansi";
import { cn } from "../../utils/cn";

export interface AnsiTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string;
  as?: React.ElementType;
}

export const AnsiText: React.FC<AnsiTextProps> = ({
  value,
  className,
  as: Component = "span",
  ...props
}) => {
  const segments = parseAnsi(value);
  return (
    <Component className={cn("font-mono", className)} {...props}>
      {segments.map((segment, index) => (
        <span key={`${segment.text}-${index}`} className={segment.className}>
          {segment.text}
        </span>
      ))}
    </Component>
  );
};
