import { describe, expect, it } from "vitest";
import { MAX_GUESSES, Status, WordleGame, scoreGuess } from "./engine";
import { WORDS, WORD_SET } from "./words";

describe("scoreGuess", () => {
  it("marks exact, misplaced and absent letters", () => {
    expect(scoreGuess("crane", "crane")).toBe("ggggg");
    expect(scoreGuess("nacre", "crane")).toBe("yyyyg");
    expect(scoreGuess("dumpy", "crane")).toBe("     ");
  });

  it("does not over-count duplicate letters", () => {
    expect(scoreGuess("paper", "apple")).toBe("yygy ");
    expect(scoreGuess("eerie", "crane")).toBe("  y g");
    expect(scoreGuess("speed", "abide")).toBe("  y y");
    expect(scoreGuess("lolly", "hello")).toBe(" ygg ");
  });
});

describe("words", () => {
  it("loads the backend word list", () => {
    expect(WORDS.length).toBeGreaterThan(5000);
    expect(WORD_SET.has("about")).toBe(true);
  });
});

describe("WordleGame", () => {
  it("validates guesses without using a turn", () => {
    const game = new WordleGame("crane");
    expect(game.submit("abc").status).toBe(Status.INVALID_WORD_FORMAT);
    expect(game.submit("zzzzz").status).toBe(Status.INVALID_WORD);
    expect(game.submit("about").status).toBe(Status.MISMATCH);
    expect(game.submit("ABOUT").status).toBe(Status.USED);
    expect(game.turn).toBe(1);
  });

  it("wins on a correct guess and reveals the word", () => {
    const game = new WordleGame("crane");
    expect(game.submit("CRANE")).toEqual({
      status: Status.MATCH,
      letter_colors: "ggggg",
      word: "crane",
    });
    expect(game.isOver).toBe(true);
    expect(game.submit("about").status).toBe(Status.GAME_OVER);
  });

  it("loses after six wrong guesses", () => {
    const game = new WordleGame("crane");
    const wrong = ["about", "there", "which", "their", "would", "other"];
    wrong.slice(0, MAX_GUESSES - 1).forEach((w) => {
      expect(game.submit(w).status).toBe(Status.MISMATCH);
    });
    const last = game.submit(wrong[MAX_GUESSES - 1]);
    expect(last.status).toBe(Status.MISS_ALL);
    expect(last.word).toBe("crane");
  });
});
