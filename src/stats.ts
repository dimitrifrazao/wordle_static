export interface GameRecord {
  date: string;
  answer: string;
  won: boolean;
  turns: number;
}

export interface StatsSummary {
  played: number;
  won: number;
  lost: number;
  averageTurns: number;
}

const STORAGE_KEY = "wordle_games";

function isGameRecord(value: unknown): value is GameRecord {
  const record = value as GameRecord;
  return (
    typeof record === "object" &&
    record !== null &&
    typeof record.won === "boolean" &&
    typeof record.turns === "number"
  );
}

export function loadGames(): GameRecord[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isGameRecord) : [];
  } catch {
    return [];
  }
}

export function recordGame(record: GameRecord): void {
  try {
    const games = loadGames();
    games.push(record);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    // storage unavailable: this game just isn't counted
  }
}

export function clearGames(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable: nothing to clear
  }
}

// Turns count every guess used, so a lost game counts as 6.
export function summarize(games: GameRecord[]): StatsSummary {
  const played = games.length;
  const won = games.filter((game) => game.won).length;
  const totalTurns = games.reduce((sum, game) => sum + game.turns, 0);
  return {
    played,
    won,
    lost: played - won,
    averageTurns: played > 0 ? totalTurns / played : 0,
  };
}
