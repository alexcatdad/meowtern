import type React from "react";
import { cn } from "../../utils/cn";
import { formatKeyCombo } from "../../utils/keyboard";

export interface Shortcut {
  combo: string;
  description: string;
}

export interface KeyboardShortcutsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  shortcuts: Shortcut[];
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  shortcuts,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 rounded-terminal border border-terminal-gridLine/60 bg-terminal-panel p-3 text-sm",
        className,
      )}
      {...props}
    >
      {shortcuts.map((shortcut) => (
        <div key={shortcut.combo} className="flex items-center justify-between">
          <span className="text-terminal-foreground">
            {shortcut.description}
          </span>
          <span className="rounded-terminal border border-terminal-gridLine/40 px-2 py-1 font-mono text-xs text-terminal-brightBlack">
            {formatKeyCombo(shortcut.combo)}
          </span>
        </div>
      ))}
    </div>
  );
};
