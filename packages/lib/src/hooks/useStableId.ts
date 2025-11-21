import { useId, useMemo } from "react";

export const useStableId = (prefix = "web-tui") => {
  const reactId = useId();
  return useMemo(
    () => `${prefix}-${reactId.replace(/:/g, "-")}`,
    [prefix, reactId],
  );
};
