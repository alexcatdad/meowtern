import type React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";

export interface Action {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  onSelect?: () => void;
}

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: Action[];
  align?: "left" | "right" | "center";
}

export const ActionBar: React.FC<ActionBarProps> = ({
  actions,
  align = "right",
  className,
  ...props
}) => {
  const alignment =
    align === "left"
      ? "justify-start"
      : align === "center"
        ? "justify-center"
        : "justify-end";
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-terminal-gridLine/60 pt-2",
        alignment,
        className,
      )}
      {...props}
    >
      {actions.map((action) => (
        <Button
          key={action.id}
          size="sm"
          variant={action.variant ?? "primary"}
          onClick={action.onSelect}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
