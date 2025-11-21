import React, { type ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { cn } from "../../utils/cn";
import { Surface, type SurfaceProps } from "../primitives/Surface";

type SplitDirection = "vertical" | "horizontal";

export interface TerminalPanelProps extends SurfaceProps {
  split?: SplitDirection;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  header?: ReactNode;
  footer?: ReactNode;
  collapsible?: boolean;
  collapseBreakpoint?: string;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  children,
  className,
  split,
  activeIndex = 0,
  onActiveChange,
  header,
  footer,
  collapsible = true,
  collapseBreakpoint = "(max-width: 768px)",
  ...props
}) => {
  const items = React.Children.toArray(children);
  const shouldEnableCollapse = collapsible;
  const isCompact = useMediaQuery(collapseBreakpoint, shouldEnableCollapse);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isCompact) {
      setCollapsed(false);
    }
  }, [isCompact]);

  const content = split
    ? items.map((item, index) => {
        const childKey =
          (React.isValidElement(item) && item.key) ?? `panel-${index}`;
        return (
          <button
            key={childKey}
            type="button"
            onClick={() => onActiveChange?.(index)}
            className={cn(
              "flex-1 border-terminal-gridLine/50 bg-transparent p-3 text-left text-terminal-foreground outline-none transition-colors",
              split === "vertical"
                ? isCompact
                  ? "border-t first:border-t-0"
                  : "border-l first:border-l-0"
                : "border-t first:border-t-0",
              index === activeIndex
                ? "bg-terminal-black/30"
                : "hover:bg-terminal-black/20",
            )}
          >
            {item}
          </button>
        );
      })
    : children;

  return (
    <Surface
      variant="plain"
      className={cn("flex h-full min-h-0 flex-col gap-3", className)}
      {...props}
    >
      {header && (
        <div className="flex items-start justify-between gap-2 border-b border-terminal-gridLine/40 pb-2 text-xs uppercase text-terminal-brightBlack">
          <div className="flex-1">{header}</div>
          {shouldEnableCollapse && isCompact && (
            <button
              type="button"
              className="rounded-terminal border border-terminal-gridLine/60 px-2 py-1 text-[10px] font-semibold tracking-wide text-terminal-foreground"
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed ? "Expand" : "Collapse"}
            </button>
          )}
        </div>
      )}
      {!collapsed && (
        <div
          className={cn(
            "flex flex-1 overflow-hidden rounded-terminal border border-terminal-gridLine/50",
            split === "vertical" && "flex-col gap-3 md:flex-row md:gap-0",
            split === "horizontal" && "flex-col",
          )}
        >
          {content}
        </div>
      )}
      {footer && (
        <div className="mt-2 border-t border-terminal-gridLine/40 pt-2 text-xs text-terminal-brightBlack">
          {footer}
        </div>
      )}
    </Surface>
  );
};
