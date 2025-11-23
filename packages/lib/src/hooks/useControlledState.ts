import { useCallback, useState } from "react";

/**
 * A hook that manages both controlled and uncontrolled state.
 * Useful for creating flexible components that can be used in both modes.
 *
 * @param controlledValue - The controlled value (from parent)
 * @param defaultValue - The default value for uncontrolled mode
 * @param onChange - Callback when value changes
 * @returns A tuple of [value, setValue] similar to useState
 */
export function useControlledState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}
