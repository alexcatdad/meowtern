import React from "react";
import { cn } from "../../utils/cn";

export interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: BreadcrumbSegment[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  segments,
  className,
  ...props
}) => {
  return (
    <nav
      className={cn(
        "flex items-center gap-2 font-mono text-xs uppercase text-terminal-brightBlack",
        className,
      )}
      {...props}
    >
      {segments.map((segment, index) => (
        <React.Fragment key={`${segment.label}-${index}`}>
          <button
            className={cn(
              "transition-colors",
              index === segments.length - 1
                ? "text-terminal-foreground"
                : "text-terminal-brightBlack hover:text-terminal-foreground",
            )}
            onClick={segment.onClick}
            type="button"
          >
            {segment.label}
          </button>
          {index < segments.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
};
