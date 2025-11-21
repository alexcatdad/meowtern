import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { formatKeyCombo } from "../../utils/keyboard";

export interface Command {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  group?: string;
}

export interface CommandPaletteProps
  extends React.HTMLAttributes<HTMLDivElement> {
  commands: Command[];
  open: boolean;
  onClose: () => void;
  onSelect: (command: Command) => void;
}

export const filterCommands = (commands: Command[], query: string) => {
  if (!query) return commands;
  return commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  open,
  onClose,
  onSelect,
  className,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => filterCommands(commands, query),
    [commands, query],
  );

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4">
      <dialog
        open
        aria-modal="true"
        className={cn(
          "w-full max-w-xl rounded-terminal border border-terminal-gridLine/60 bg-terminal-panel p-4 shadow-2xl",
          className,
        )}
        {...props}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type a command..."
          className="mb-3 w-full rounded-terminal border border-terminal-gridLine/40 bg-terminal-black/60 px-3 py-2 font-mono text-terminal-foreground outline-none focus:border-terminal-green"
        />
        <div className="max-h-64 overflow-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-terminal-brightBlack">
              No commands found
            </p>
          )}
          {filtered.map((command) => (
            <button
              key={command.id}
              type="button"
              className="flex w-full flex-col items-start gap-1 rounded-terminal px-3 py-2 text-left text-sm hover:bg-terminal-black/40"
              onClick={() => onSelect(command)}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-terminal-foreground">
                  {command.label}
                </span>
                {command.shortcut && (
                  <span className="text-xs text-terminal-brightBlack">
                    {formatKeyCombo(command.shortcut)}
                  </span>
                )}
              </div>
              {command.description && (
                <span className="text-xs text-terminal-brightBlack">
                  {command.description}
                </span>
              )}
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
};
