import type React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../Button";
import { Dialog, type DialogProps } from "./Dialog";

export interface InputDialogProps extends Omit<DialogProps, "actions"> {
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
}

function ConfirmButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {label}
    </Button>
  );
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
  const [error, submitAction, isPending] = useActionState(
    async (_previousState: string | null, formData: FormData) => {
      const value = formData.get("input") as string;
      if (!value?.trim()) {
        return "Value cannot be empty";
      }
      try {
        onConfirm(value);
        onClose?.();
        return null;
      } catch (err) {
        return err instanceof Error ? err.message : "An error occurred";
      }
    },
    null,
  );

  return (
    <Dialog
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      {...props}
    >
      <form action={submitAction}>
        <input
          name="input"
          placeholder={placeholder}
          disabled={isPending}
          className="w-full rounded-terminal border border-terminal-gridLine/60 bg-terminal-black/70 px-3 py-2 font-mono outline-none focus:border-terminal-green disabled:opacity-50"
        />
        {error && <p className="mt-2 text-sm text-terminal-red">{error}</p>}
        <div className="mt-4 flex justify-end gap-2 border-t border-terminal-gridLine/60 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <ConfirmButton label={confirmLabel} />
        </div>
      </form>
    </Dialog>
  );
};
