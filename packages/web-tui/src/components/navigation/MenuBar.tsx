import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { formatKeyCombo } from "../../utils/keyboard";

export interface MenuItem {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
}

export interface MenuGroup extends MenuItem {
  items?: MenuItem[];
}

export interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuGroup[];
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export const MenuBar: React.FC<MenuBarProps> = ({
  items,
  className,
  ...props
}) => {
  const [openId, setOpenId] = useState<string>();
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>();
  const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  useIsomorphicLayoutEffect(() => {
    if (!openId) {
      setMenuPosition(undefined);
      return;
    }

    const trigger = triggerRefs.current.get(openId);
    if (!trigger) {
      return;
    }

    const updatePosition = () => {
      const rect = trigger.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [openId]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 border-b border-terminal-gridLine/50 bg-gradient-to-r from-[#04060c] via-[#070b15] to-[#04060c] px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-terminal-foreground sm:gap-4 sm:px-4 sm:text-[11px] sm:tracking-[0.3em]",
        "overflow-x-auto",
        className,
      )}
      {...props}
    >
      {items.map((group) => (
        <div
          key={group.label}
          className="relative"
          onMouseEnter={() => setOpenId(group.label)}
          onMouseLeave={() => setOpenId(undefined)}
        >
          <button
            type="button"
            ref={(node) => {
              triggerRefs.current.set(group.label, node);
            }}
            className={cn(
              "rounded-terminal px-3 py-1 text-terminal-foreground transition-colors",
              openId === group.label
                ? "bg-terminal-accent/20 text-terminal-foreground"
                : "hover:bg-terminal-accent/10 text-terminal-foreground/70",
            )}
            onClick={() => {
              if (group.items && group.items.length > 0) {
                setOpenId((prev) =>
                  prev === group.label ? undefined : group.label,
                );
              } else {
                group.onSelect?.();
              }
            }}
          >
            {group.label}
          </button>
          {group.items &&
            group.items.length > 0 &&
            openId === group.label &&
            menuPosition &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed z-50 rounded-terminal border border-terminal-gridLine/60 bg-[#05070f]/90 shadow-[0_20px_45px_rgba(3,4,10,0.8)] backdrop-blur"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                  minWidth: Math.max(180, menuPosition.width),
                }}
              >
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs tracking-wide text-terminal-foreground/80 hover:bg-terminal-black/40"
                    onClick={() => {
                      item.onSelect?.();
                      setOpenId(undefined);
                    }}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className="text-xs text-terminal-brightBlack">
                        {formatKeyCombo(item.shortcut)}
                      </span>
                    )}
                  </button>
                ))}
              </div>,
              document.body,
            )}
        </div>
      ))}
    </div>
  );
};
