import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

export const useKeyboard = (handlers: Record<string, KeyHandler>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle specific keys like 'ctrl+c'
      const key = e.key.toLowerCase();
      const combo = [];
      if (e.ctrlKey) combo.push("ctrl");
      if (e.metaKey) combo.push("meta");
      if (e.shiftKey) combo.push("shift");
      if (e.altKey) combo.push("alt");
      if (!["control", "meta", "shift", "alt"].includes(key)) {
        combo.push(key);
      }

      const comboString = combo.join("+");

      if (handlers[comboString]) {
        handlers[comboString](e);
      } else if (handlers[key]) {
        handlers[key](e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
};
