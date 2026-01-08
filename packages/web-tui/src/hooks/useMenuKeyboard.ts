import { useCallback, useState } from "react";

/**
 * Hook for managing keyboard navigation in menu components
 * Handles ArrowUp, ArrowDown, Home, End, Tab, and opening with ArrowDown/Enter/Space
 *
 * @param isOpen - Whether the menu is currently open
 * @param onOpenChange - Callback when menu should open/close
 * @param getMenuItems - Function to get list of menu items (should query DOM)
 * @returns Object with focusedIndex, handleKeyDown, and resetFocus
 */
export function useMenuKeyboard(
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  getMenuItems: () => HTMLElement[],
) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (
          event.key === "ArrowDown" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onOpenChange(true);
        }
        return;
      }

      const items = getMenuItems();
      if (items.length === 0) return;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          const nextIndex =
            focusedIndex < items.length - 1 ? focusedIndex + 1 : 0;
          setFocusedIndex(nextIndex);
          items[nextIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const prevIndex =
            focusedIndex > 0 ? focusedIndex - 1 : items.length - 1;
          setFocusedIndex(prevIndex);
          items[prevIndex]?.focus();
          break;
        }
        case "Home": {
          event.preventDefault();
          setFocusedIndex(0);
          items[0]?.focus();
          break;
        }
        case "End": {
          event.preventDefault();
          setFocusedIndex(items.length - 1);
          items[items.length - 1]?.focus();
          break;
        }
        case "Tab": {
          onOpenChange(false);
          break;
        }
      }
    },
    [isOpen, focusedIndex, onOpenChange, getMenuItems],
  );

  return { focusedIndex, handleKeyDown, resetFocus };
}
