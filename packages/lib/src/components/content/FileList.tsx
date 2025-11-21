import type React from "react";
import { useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { formatBytes } from "../../utils/format";
import { Surface } from "../primitives/Surface";

export type FileType = "file" | "folder" | "symlink";

export interface FileItem {
  name: string;
  type: FileType;
  size?: number;
  modified?: string;
}

export interface FileListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: FileItem[];
  onSelect?: (item: FileItem) => void;
  defaultSort?: "name" | "size" | "modified";
}

const icons: Record<FileType, string> = {
  file: "[F]",
  folder: "[DIR]",
  symlink: "[LN]",
};

const tone: Record<FileType, string> = {
  file: "text-terminal-foreground",
  folder: "text-terminal-blue",
  symlink: "text-terminal-magenta",
};

export const FileList: React.FC<FileListProps> = ({
  className,
  items,
  onSelect,
  defaultSort = "name",
  ...props
}) => {
  const [sort, setSort] = useState<{
    key: typeof defaultSort;
    direction: 1 | -1;
  }>({
    key: defaultSort,
    direction: 1,
  });

  const sorted = useMemo(() => {
    const clone = [...items];
    clone.sort((a, b) => {
      let aValue: string | number | undefined = a[sort.key];
      let bValue: string | number | undefined = b[sort.key];
      if (sort.key === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }
      if (aValue === undefined || bValue === undefined) return 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * sort.direction;
      }
      return String(aValue).localeCompare(String(bValue)) * sort.direction;
    });
    return clone;
  }, [items, sort.direction, sort.key]);

  const toggleSort = (key: typeof defaultSort) => {
    setSort((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 1 ? -1 : 1 };
      }
      return { key, direction: 1 };
    });
  };

  return (
    <Surface variant="plain" className={cn("p-0", className)} {...props}>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-terminal-black/60 text-xs uppercase tracking-wide text-terminal-brightBlack">
            <tr>
              {[
                { key: "name", label: "Name" },
                { key: "size", label: "Size" },
                { key: "modified", label: "Modified" },
              ].map((column) => (
                <th key={column.key} className="px-3 py-2 text-left">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 uppercase tracking-wider text-terminal-foreground/80 transition-colors hover:text-terminal-accent"
                    onClick={() => toggleSort(column.key as typeof defaultSort)}
                  >
                    {column.label}
                    {sort.key === column.key &&
                      (sort.direction === 1 ? "▲" : "▼")}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr
                key={`${item.name}-${item.modified ?? ""}`}
                className={cn(
                  "border-b border-terminal-gridLine/40",
                  onSelect &&
                    "cursor-pointer hover:bg-terminal-black/30 focus-visible:bg-terminal-black/40",
                )}
                tabIndex={onSelect ? 0 : -1}
                onClick={() => onSelect?.(item)}
                onKeyDown={(event) => {
                  if (!onSelect) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(item);
                  }
                }}
              >
                <td className={cn("px-3 py-2 font-mono", tone[item.type])}>
                  <span className="mr-2">{icons[item.type]}</span>
                  {item.name}
                </td>
                <td className="px-3 py-2 text-terminal-foreground">
                  {item.size ? formatBytes(item.size) : "--"}
                </td>
                <td className="px-3 py-2 text-terminal-brightBlack">
                  {item.modified ?? "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
};
