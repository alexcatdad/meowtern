import type React from "react";
import { useState } from "react";
import { cn } from "../../utils/cn";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeId,
  defaultActiveId,
  onTabChange,
  className,
  ...props
}) => {
  const fallbackId = defaultActiveId ?? tabs[0]?.id;
  const [internalActive, setInternalActive] = useState(fallbackId);
  const currentId = activeId ?? internalActive;
  const currentTab = tabs.find((tab) => tab.id === currentId);

  const handleSelect = (id: string) => {
    if (!activeId) {
      setInternalActive(id);
    }
    onTabChange?.(id);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="overflow-x-auto">
        <div className="flex w-full min-w-max gap-2 border-b border-terminal-gridLine/50 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelect(tab.id)}
              className={cn(
                "whitespace-nowrap rounded-t-terminal border border-b-0 border-terminal-gridLine/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] transition-all sm:px-4 sm:text-[11px] sm:tracking-[0.3em]",
                tab.id === currentId
                  ? "bg-gradient-to-b from-terminal-accent/30 via-terminal-black to-terminal-accent/10 text-terminal-foreground shadow-[0_10px_30px_rgba(21,241,255,0.22)]"
                  : "bg-[#05070f]/60 text-terminal-foreground/60 hover:text-terminal-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-terminal border border-terminal-gridLine/40 bg-[#05070f]/70 p-3 text-sm text-terminal-foreground shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] sm:p-4">
        {currentTab?.content}
      </div>
    </div>
  );
};
