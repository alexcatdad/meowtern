import type React from "react";
import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";

export interface SelectableItem {
  id: string;
  label: string;
  description?: string;
}

export interface SelectableListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: SelectableItem[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  multiSelect?: boolean;
}

export const SelectableList: React.FC<SelectableListProps> = ({
  items,
  selectedIds,
  onSelectionChange,
  multiSelect = false,
  className,
  ...props
}) => {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const selections = selectedIds ?? internalSelected;

  const toggleItem = (id: string) => {
    const next = multiSelect
      ? selections.includes(id)
        ? selections.filter((value) => value !== id)
        : [...selections, id]
      : [id];
    if (!selectedIds) {
      setInternalSelected(next);
    }
    onSelectionChange?.(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const item = items[focusedIndex];
      if (item) {
        toggleItem(item.id);
      }
    }
  };

  const selectionSet = useMemo(() => new Set(selections), [selections]);

  return (
    <div
      onKeyDown={handleKeyDown}
      className={cn(
        "flex max-h-64 flex-col gap-2 overflow-auto rounded-terminal border border-terminal-gridLine/60 p-2",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const selected = selectionSet.has(item.id);
        const focused = index === focusedIndex;
        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              "flex flex-col items-start rounded-terminal border border-transparent px-3 py-2 text-left text-sm",
              focused && "border-terminal-gridLine/60",
              selected
                ? "bg-terminal-green/20 text-terminal-foreground"
                : "bg-transparent text-terminal-foreground hover:bg-terminal-black/40",
            )}
            onMouseEnter={() => setFocusedIndex(index)}
            onFocus={() => setFocusedIndex(index)}
            onClick={() => toggleItem(item.id)}
          >
            <span>{item.label}</span>
            {item.description && (
              <span className="text-xs text-terminal-brightBlack">
                {item.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
