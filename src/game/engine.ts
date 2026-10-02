import { WORD_SET, getRandomWord } from "./words";

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

// Mirrors the Status enum of the original Flask backend.
export enum Status {
  MATCH = "match",
  MISMATCH = "miss_match",
  USED = "used",
  INVALID_WORD = "invalid_word",
  INVALID_WORD_FORMAT = "invalid_word_format",
  MISS_ALL = "miss_all",
  GAME_OVER = "game_over",
}

export interface GuessResult {
  status: Status;
  // One char per letter: "g" green, "y" yellow, " " grey (same format as the backend).
  letter_colors?: string;
  // The solution, revealed only when the game ends.
  word?: string;
}

// Scores a guess against the answer using the official Wordle rules:
// greens first, then yellows only while unmatched copies of the letter remain.
export function scoreGuess(guess: string, answer: string): string {
  const colors: string[] = new Array(WORD_LENGTH).fill(" ");
  const remaining = new Map<string, number>();

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      colors[i] = "g";
    } else {
      remaining.set(answer[i], (remaining.get(answer[i]) ?? 0) + 1);
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (colors[i] === "g") continue;
    const count = remaining.get(guess[i]) ?? 0;
    if (count > 0) {
      colors[i] = "y";
      remaining.set(guess[i], count - 1);
    }
  }

  return colors.join("");
}

export class WordleGame {
  readonly answer: string;
  private readonly dictionary: Set<string>;
  private readonly guesses: string[] = [];
  private finished = false;

  constructor(answer: string = getRandomWord(), dictionary: Set<string> = WORD_SET) {
    this.answer = answer.toLowerCase();
    this.dictionary = dictionary;
  }

  get isOver(): boolean {
    return this.finished;
  }

  get turn(): number {
    return this.guesses.length;
  }

  submit(input: string): GuessResult {
    if (this.finished) return { status: Status.GAME_OVER };

    const word = input.toLowerCase();
    if (word.length !== WORD_LENGTH || !/^[a-z]+$/.test(word)) {
      return { status: Status.INVALID_WORD_FORMAT };
    }
    if (!this.dictionary.has(word)) {
      return { status: Status.INVALID_WORD };
    }
    if (this.guesses.includes(word)) {
      return { status: Status.USED };
    }

    this.guesses.push(word);
    const letter_colors = scoreGuess(word, this.answer);

    if (word === this.answer) {
      this.finished = true;
      return { status: Status.MATCH, letter_colors, word: this.answer };
    }
    if (this.guesses.length === MAX_GUESSES) {
      this.finished = true;
      return { status: Status.MISS_ALL, letter_colors, word: this.answer };
    }
    return { status: Status.MISMATCH, letter_colors };
  }
}
