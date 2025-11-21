const MODIFIER_ORDER = ["ctrl", "alt", "shift", "meta"] as const;

export type KeyCombo = string;

export const formatKeyCombo = (combo: KeyCombo) => {
  const parts = combo
    .toLowerCase()
    .split("+")
    .map((part) =>
      part.length === 1
        ? part.toUpperCase()
        : part.charAt(0).toUpperCase() + part.slice(1),
    );
  return parts.join(" + ");
};

export const normalizeCombo = (combo: KeyCombo) => {
  const [key, ...rest] = combo.toLowerCase().split("+").reverse();
  const modifiers = rest
    .map((modifier) => modifier.toLowerCase())
    .sort(
      (a, b) =>
        MODIFIER_ORDER.indexOf(a as (typeof MODIFIER_ORDER)[number]) -
        MODIFIER_ORDER.indexOf(b as (typeof MODIFIER_ORDER)[number]),
    );
  return [...modifiers, key].join("+");
};

export const isComboPressed = (
  combo: KeyCombo,
  event: KeyboardEvent | React.KeyboardEvent,
) => {
  const normalized = normalizeCombo(combo);
  const parts = normalized.split("+");
  const key = parts[parts.length - 1];
  const modifiers = parts.slice(0, -1);
  const modifierChecks = {
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  } as const;

  for (const modifier of MODIFIER_ORDER) {
    const required = modifiers.includes(modifier);
    if (required !== modifierChecks[modifier]) {
      return false;
    }
  }

  return event.key.toLowerCase() === key;
};
