import type React from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

type Variant = "plain" | "sunken" | "raised" | "crt";

export type SurfaceProps<T extends React.ElementType = "div"> = {
  as?: T;
  variant?: Variant;
  padded?: boolean;
  border?: boolean;
  interactive?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

const variants: Record<Variant, string> = {
  plain: "bg-gradient-to-br from-[#0f1933] via-[#070c18] to-[#05060f]",
  sunken:
    "bg-gradient-to-b from-[#080e1c] via-[#050810] to-[#05060c] shadow-[inset_0_0_25px_rgba(0,0,0,0.6)]",
  raised:
    "bg-gradient-to-b from-[#12213e] via-[#081021] to-[#05070f] shadow-[0_18px_45px_rgba(21,241,255,0.15)]",
  crt: "bg-gradient-to-b from-[#0a0f1a] via-[#050810] to-[#030408] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]",
};

const SurfaceComponent = (
  {
    as,
    className,
    variant = "plain",
    padded = true,
    border = false,
    interactive = false,
    style,
    ...props
  }: SurfaceProps<React.ElementType>,
  ref: React.ForwardedRef<unknown>,
) => {
  const Component = (as ?? "div") as React.ElementType;
  const isCrt = variant === "crt";
  return (
    <Component
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-terminal border border-terminal-gridLine/40 text-terminal-foreground transition-all duration-200",
        variants[variant],
        padded && "p-3 sm:p-4",
        border &&
          "ring-1 ring-terminal-cyan/30 shadow-[0_0_25px_rgba(21,241,255,0.18)]",
        interactive &&
          "cursor-pointer hover:ring-terminal-cyan/60 hover:shadow-[0_0_35px_rgba(21,241,255,0.32)]",
        isCrt &&
          "before:absolute before:inset-0 before:pointer-events-none before:z-10 before:bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] before:opacity-60 after:absolute after:inset-0 after:pointer-events-none after:z-0 after:bg-[radial-gradient(ellipse_at_center,rgba(22,198,12,0.08),transparent_70%)] after:mix-blend-screen",
        className,
      )}
      style={
        isCrt
          ? {
              boxShadow: `inset 0 0 30px rgba(0,0,0,0.8), 0 0 8px rgba(22,198,12,0.2), inset 0 0 20px rgba(22,198,12,0.05)`,
              ...style,
            }
          : style
      }
      {...props}
    />
  );
};

export const Surface = forwardRef(SurfaceComponent) as <
  T extends React.ElementType = "div",
>(
  props: SurfaceProps<T> & { ref?: React.ComponentPropsWithRef<T>["ref"] },
) => React.ReactElement | null;

(Surface as { displayName?: string }).displayName = "Surface";
