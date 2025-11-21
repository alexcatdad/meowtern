import type React from "react";
import { useRef } from "react";
import { Dialog, type DialogProps } from "./Dialog";

export interface InputDialogProps extends Omit<DialogProps, "actions"> {
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
}

export const InputDialog: React.FC<InputDialogProps> = ({
  open,
  title,
  description,
  placeholder = "Enter value",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      actions={[
        {
          id: "cancel",
          label: cancelLabel,
          variant: "ghost",
          onSelect: onClose,
        },
        {
          id: "confirm",
          label: confirmLabel,
          onSelect: () => {
            onConfirm(inputRef.current?.value ?? "");
            onClose?.();
          },
        },
      ]}
      {...props}
    >
      <input
        ref={inputRef}
        placeholder={placeholder}
        className="w-full rounded-terminal border border-terminal-gridLine/60 bg-terminal-black/70 px-3 py-2 font-mono outline-none focus:border-terminal-green"
      />
    </Dialog>
  );
};
