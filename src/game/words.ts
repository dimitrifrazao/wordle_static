import rawWords from "./words.txt?raw";

// Same list the Flask backend loaded from word_list.txt, bundled at build time.
export const WORDS: string[] = rawWords
  .split("\n")
  .map((word) => word.trim().toLowerCase())
  .filter((word) => /^[a-z]{5}$/.test(word));

export const WORD_SET: Set<string> = new Set(WORDS);

export function getRandomWord(words: string[] = WORDS): string {
  return words[Math.floor(Math.random() * words.length)];
}
