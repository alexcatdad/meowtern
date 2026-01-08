import type React from "react";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Surface } from "../primitives/Surface";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  meta?: string;
  icon?: React.ReactNode;
}

export interface TreeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
}

export const Tree: React.FC<TreeProps> = ({
  className,
  nodes,
  defaultExpanded = [],
  selectedId,
  onSelect,
  ...props
}) => {
  const [expanded, setExpanded] = useState(() => new Set(defaultExpanded));

  const toggleNode = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderNodes = (items: TreeNode[], depth = 0): React.ReactNode =>
    items.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isExpanded = expanded.has(node.id);
      const isSelected = selectedId === node.id;
      return (
        <div key={node.id} className={cn("pl-2", depth === 0 && "pl-0")}>
          <button
            type="button"
            onClick={() => {
              if (hasChildren) toggleNode(node.id);
              onSelect?.(node);
            }}
            className={cn(
              "flex w-full items-center gap-2 rounded-terminal px-2 py-1 text-left text-sm transition-colors",
              isSelected
                ? "bg-terminal-success/30 text-terminal-foreground"
                : "hover:bg-terminal-black/50",
            )}
          >
            {hasChildren ? (
              <span className="text-terminal-brightBlack">
                {isExpanded ? "▾" : "▸"}
              </span>
            ) : (
              <span className="text-terminal-brightBlack">•</span>
            )}
            {node.icon}
            <span className="flex-1">{node.label}</span>
            {node.meta && (
              <span className="text-xs text-terminal-brightBlack">
                {node.meta}
              </span>
            )}
          </button>
          {hasChildren && isExpanded && (
            <div className="border-l border-terminal-gridLine/40 pl-3">
              {renderNodes(node.children ?? [], depth + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <Surface
      variant="sunken"
      className={cn("space-y-1 font-mono text-xs", className)}
      {...props}
    >
      {renderNodes(nodes)}
    </Surface>
  );
};
