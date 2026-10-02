export interface ThemeColors {
  background: string;
  unused: string;
  used: string;
  green: string;
  yellow: string;
}

export const DEFAULT_THEME: ThemeColors = {
  background: "#000e2c",
  unused: "#ffffff",
  used: "#919191",
  green: "#5ac85a",
  yellow: "#e2cc68",
};

export const THEME_LABELS: Record<keyof ThemeColors, string> = {
  background: "Background",
  unused: "Unused letters",
  used: "Used letters",
  green: "Correct spot",
  yellow: "Wrong spot",
};

// CSS custom property each setting drives (see index.css :root).
const CSS_VARS: Record<keyof ThemeColors, string> = {
  background: "--var_dark",
  unused: "--var_unused",
  used: "--var_grey",
  green: "--var_green",
  yellow: "--var_yellow",
};

const STORAGE_KEY = "wordle_theme";

export function applyTheme(theme: ThemeColors): void {
  const root = document.documentElement;
  (Object.keys(CSS_VARS) as (keyof ThemeColors)[]).forEach((key) => {
    root.style.setProperty(CSS_VARS[key], theme[key]);
  });
}

export function loadTheme(): ThemeColors {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_THEME, ...JSON.parse(stored) };
  } catch {
    // storage unavailable or corrupt: fall back to defaults
  }
  return DEFAULT_THEME;
}

export function saveTheme(theme: ThemeColors): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // storage unavailable: theme still applies for this visit
  }
}
