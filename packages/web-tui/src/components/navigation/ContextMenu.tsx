import type React from "react";
import { cn } from "../../utils/cn";

export interface ContextMenuItem {
  label: string;
  shortcut?: string;
  danger?: boolean;
  onSelect?: () => void;
}

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ContextMenuItem[];
  visible: boolean;
  position?: { x: number; y: number };
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  visible,
  position = { x: 0, y: 0 },
  className,
  ...props
}) => {
  if (!visible) return null;
  return (
    <div
      className={cn(
        "fixed z-50 min-w-[180px] rounded-terminal border border-terminal-gridLine/60 bg-terminal-panel shadow-lg",
        className,
      )}
      style={{ top: position.y, left: position.x }}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={cn(
            "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-terminal-black/40",
            item.danger && "text-terminal-red",
          )}
          onClick={item.onSelect}
        >
          <span>{item.label}</span>
          {item.shortcut && (
            <span className="text-xs text-terminal-brightBlack">
              {item.shortcut}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
