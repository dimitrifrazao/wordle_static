import { describe, expect, it } from "vitest";
import { GameRecord, summarize } from "./stats";

const game = (won: boolean, turns: number): GameRecord => ({
  date: "2026-10-02T00:00:00.000Z",
  answer: "crane",
  won,
  turns,
});

describe("summarize", () => {
  it("returns zeros when there are no games", () => {
    expect(summarize([])).toEqual({ played: 0, won: 0, lost: 0, averageTurns: 0 });
  });

  it("counts wins, losses and average turns", () => {
    expect(summarize([game(true, 3), game(true, 4), game(false, 6)])).toEqual({
      played: 3,
      won: 2,
      lost: 1,
      averageTurns: 13 / 3,
    });
  });
});
