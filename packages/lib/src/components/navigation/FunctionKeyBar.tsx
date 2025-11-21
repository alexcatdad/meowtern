import type React from "react";
import { cn } from "../../utils/cn";

export interface FunctionKey {
  key: string;
  label: string;
}

export interface FunctionKeyBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  keys: FunctionKey[];
}

export const FunctionKeyBar: React.FC<FunctionKeyBarProps> = ({
  keys,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 rounded-terminal border border-terminal-gridLine/50 bg-gradient-to-r from-[#05070f] via-[#090f1e] to-[#05070f] p-3 text-[11px] text-terminal-foreground sm:grid-cols-4",
        className,
      )}
      {...props}
    >
      {keys.map((item) => (
        <div
          key={item.key}
          className="flex items-center justify-between rounded-terminal border border-terminal-gridLine/40 bg-[#070d1a]/80 px-3 py-1.5 font-mono shadow-[0_0_20px_rgba(3,4,10,0.5)]"
        >
          <span className="text-terminal-accent">{item.key}</span>
          <span className="text-terminal-foreground/80">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
