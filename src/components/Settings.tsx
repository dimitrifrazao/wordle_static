import { useEffect } from "react";
import { DEFAULT_THEME, THEME_LABELS, ThemeColors } from "../theme";

interface SettingsProps {
  open: boolean;
  theme: ThemeColors;
  onChange: (theme: ThemeColors) => void;
  onClose: () => void;
}

function Settings({ open, theme, onChange, onClose }: SettingsProps): JSX.Element {
  useEffect(() => {
    if (!open) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, onClose]);

  return (
    <>
      <div
        className={"settings_overlay" + (open ? " open" : "")}
        onClick={onClose}
      />
      <aside className={"settings" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="settings_header">
          <h2>Settings</h2>
          <span
            className="material-symbols-outlined"
            style={{ cursor: "pointer" }}
            title="Close"
            onClick={onClose}
          >
            close
          </span>
        </div>
        {(Object.keys(THEME_LABELS) as (keyof ThemeColors)[]).map((key) => (
          <label key={key} className="settings_row">
            <span>{THEME_LABELS[key]}</span>
            <input
              type="color"
              value={theme[key]}
              tabIndex={open ? 0 : -1}
              onChange={(event) =>
                onChange({ ...theme, [key]: event.target.value })
              }
            />
          </label>
        ))}
        <button
          id="reset_button"
          tabIndex={open ? 0 : -1}
          onClick={() => onChange(DEFAULT_THEME)}
        >
          RESTORE DEFAULTS
        </button>
      </aside>
    </>
  );
}

export default Settings;
