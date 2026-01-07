import type React from "react";
import { useRef } from "react";
import { useSyncedScroll } from "../../hooks/useSyncedScroll";
import { cn } from "../../utils/cn";
import { Surface, type SurfaceProps } from "../primitives/Surface";

type Pane = "left" | "right";

export interface DualPaneProps extends SurfaceProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  activePane?: Pane;
  onActivePaneChange?: (pane: Pane) => void;
  syncScroll?: boolean;
}

export const DualPane: React.FC<DualPaneProps> = ({
  className,
  left,
  right,
  leftTitle = "Primary",
  rightTitle = "Secondary",
  activePane = "left",
  onActivePaneChange,
  syncScroll = true,
  ...props
}) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  if (syncScroll) {
    useSyncedScroll([leftRef, rightRef]);
  }

  const makePaneButton = (pane: Pane, title: string) => (
    <button
      type="button"
      onClick={() => onActivePaneChange?.(pane)}
      className={cn(
        "rounded-md border border-terminal-gridLine/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
        pane === activePane
          ? "bg-terminal-green/20 text-terminal-foreground"
          : "text-terminal-brightBlack hover:text-terminal-foreground",
      )}
    >
      {title}
    </button>
  );

  return (
    <Surface
      variant="plain"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {makePaneButton("left", leftTitle)}
          {makePaneButton("right", rightTitle)}
        </div>
        <span className="text-xs uppercase tracking-wide text-terminal-brightBlack">
          {syncScroll ? "Linked" : "Independent"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div
          ref={leftRef}
          className={cn(
            "max-h-80 overflow-auto rounded-terminal border border-terminal-gridLine/50 p-3 text-sm",
            activePane === "left" && "shadow-glow",
          )}
        >
          {left}
        </div>
        <div
          ref={rightRef}
          className={cn(
            "max-h-80 overflow-auto rounded-terminal border border-terminal-gridLine/50 p-3 text-sm",
            activePane === "right" && "shadow-glow",
          )}
        >
          {right}
        </div>
      </div>
    </Surface>
  );
};
