import type React from "react";
import { Dialog, type DialogProps } from "./Dialog";

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

export interface SelectDialogProps
  extends Omit<DialogProps, "actions" | "onSelect"> {
  options: SelectOption[];
  onSelect: (option: SelectOption) => void;
}

export const SelectDialog: React.FC<SelectDialogProps> = ({
  options,
  onSelect,
  ...props
}) => {
  return (
    <Dialog {...props}>
      <div className="max-h-60 overflow-auto">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="flex w-full flex-col items-start gap-1 rounded-terminal border border-terminal-gridLine/40 px-3 py-2 text-left text-sm hover:bg-terminal-black/40"
            onClick={() => onSelect(option)}
          >
            <span className="text-terminal-foreground">{option.label}</span>
            {option.description && (
              <span className="text-xs text-terminal-brightBlack">
                {option.description}
              </span>
            )}
          </button>
        ))}
      </div>
    </Dialog>
  );
};
