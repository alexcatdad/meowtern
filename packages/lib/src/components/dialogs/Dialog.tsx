import type React from "react";
import { cn } from "../../utils/cn";
import { type Action, ActionBar } from "../navigation/ActionBar";

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  title: string;
  description?: string;
  actions?: Action[];
  onClose?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  description,
  actions,
  children,
  className,
  onClose,
  ...props
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <dialog
        open
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-terminal border border-terminal-gridLine/60 bg-terminal-panel p-4 text-terminal-foreground shadow-2xl",
          className,
        )}
        {...props}
      >
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && (
              <p className="text-sm text-terminal-brightBlack">{description}</p>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close dialog"
              className="text-terminal-brightBlack hover:text-terminal-foreground"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>
        <div className="space-y-3">{children}</div>
        {actions && actions.length > 0 && (
          <ActionBar className="mt-4" actions={actions} align="right" />
        )}
      </dialog>
    </div>
  );
};
