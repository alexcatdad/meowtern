import type React from "react";
import { forwardRef, useRef } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { cn } from "../../utils/cn";

export interface ScrollableAreaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  autoStick?: boolean;
  maxHeight?: number;
}

export const ScrollableArea = forwardRef<HTMLDivElement, ScrollableAreaProps>(
  (
    { className, children, autoStick = false, maxHeight = 320, ...props },
    ref,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    /* c8 ignore next */
    useAutoScroll(internalRef, { stickToBottom: autoStick });

    const handleRef = (node: HTMLDivElement) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };
    return (
      <div
        ref={handleRef}
        className={cn(
          "relative overflow-auto rounded-terminal border border-terminal-gridLine/60 p-3",
          className,
        )}
        style={{ maxHeight }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ScrollableArea.displayName = "ScrollableArea";
