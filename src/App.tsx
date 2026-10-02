import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import Rules from "./components/Rules";
import Settings from "./components/Settings";
import Stats from "./components/Stats";
import { Page } from "./components/Shared";
import Wordle from "./components/Wordle";
import { ThemeColors, applyTheme, loadTheme, saveTheme } from "./theme";

// Hash routing so the site works on GitHub Pages without server rewrites.
function pageFromHash(): Page {
  if (window.location.hash === "#/rules") return Page.rules;
  if (window.location.hash === "#/stats") return Page.stats;
  return Page.game;
}

function App(): JSX.Element {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeColors>(loadTheme);

  useEffect(() => {
    const handleHashChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    saveTheme(theme);
  }, [theme]);

  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  return (
    <div className="App">
      <Header
        page={page}
        onSettingsClick={() => setSettingsOpen((open) => !open)}
      />
      {/* Keep the game mounted so an in-progress game survives a visit to the rules. */}
      <div style={{ display: page === Page.game ? "block" : "none" }}>
        <Wordle active={page === Page.game && !settingsOpen} />
      </div>
      {page === Page.rules && <Rules />}
      {page === Page.stats && <Stats />}
      <Settings
        open={settingsOpen}
        theme={theme}
        onChange={setTheme}
        onClose={closeSettings}
      />
    </div>
  );
}

export default App;
