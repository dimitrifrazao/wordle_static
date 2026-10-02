import { useState } from "react";
import { GameRecord, clearGames, loadGames, summarize } from "../stats";

function Stats(): JSX.Element {
  const [games, setGames] = useState<GameRecord[]>(loadGames);
  const { played, won, lost, averageTurns } = summarize(games);

  const handleReset = () => {
    if (!window.confirm("Clear all your statistics? This can't be undone.")) {
      return;
    }
    clearGames();
    setGames([]);
  };

  return (
    <div className="stats">
      <h2>Statistics</h2>
      {played === 0 ? (
        <p className="stats_empty">No data available yet</p>
      ) : (
        <>
          <div className="stats_grid">
            <div className="stats_tile">
              <div className="stats_value">{played}</div>
              <div className="stats_label">Played</div>
            </div>
            <div className="stats_tile">
              <div className="stats_value">{won}</div>
              <div className="stats_label">Won</div>
            </div>
            <div className="stats_tile">
              <div className="stats_value">{lost}</div>
              <div className="stats_label">Lost</div>
            </div>
            <div className="stats_tile">
              <div className="stats_value">{averageTurns.toFixed(1)}</div>
              <div className="stats_label">Avg. turns</div>
            </div>
          </div>
          <button id="stats_reset_button" onClick={handleReset}>
            RESET STATISTICS
          </button>
        </>
      )}
    </div>
  );
}

export default Stats;
