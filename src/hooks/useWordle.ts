import { useState } from "react";
import { KeyColor } from "../components/Shared";
import { Letter } from "../components/Shared";
import { Status, WordleGame } from "../game/engine";
import { recordGame } from "../stats";

export interface HandleKeyup {
  ({ key }: { key: string }): void;
}

interface UseWordleState {
  turn: number;
  currentGuess: string;
  guesses: Letter[][];
  history: string[];
  isCorrect: boolean;
  newKeys: Set<string>;
  usedKeys: Map<string, KeyColor>;
  solution: string | null;
  handleKeyup: HandleKeyup;
}

// Higher rank wins, so a key never goes from green back to yellow or grey.
const KEY_RANK: Partial<Record<KeyColor, number>> = {
  [KeyColor.grey]: 1,
  [KeyColor.yellow]: 2,
  [KeyColor.green]: 3,
};

const useWordle = (): UseWordleState => {
  const [game] = useState<WordleGame>(() => new WordleGame());
  const [turn, setTurn] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Letter[][]>(Array.from(new Array(6)));
  const [history, setHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [newKeys, setNewKeys] = useState<Set<string>>(new Set<string>());
  const [usedKeys, setUsedKeys] = useState<Map<string, KeyColor>>(
    new Map<string, KeyColor>()
  );
  const [solution, setSolution] = useState<string | null>(null);

  const formatGuess = (letter_colors: string): Letter[] => {
    const formattedGuess = [...currentGuess].map((letter) => {
      return { key: letter, color: KeyColor.grey };
    });

    [...letter_colors].forEach((color, i) => {
      if (color === "g") {
        formattedGuess[i].color = KeyColor.green;
      } else if (color === "y") {
        formattedGuess[i].color = KeyColor.yellow;
      }
    });

    return formattedGuess;
  };

  const addNewGuess = (formattedGuess: Letter[], match: boolean): void => {
    if (match) {
      setIsCorrect(true);
    }

    setGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory((prevHistory) => [...prevHistory, currentGuess]);

    setTurn((prevTurn) => prevTurn + 1);

    setNewKeys(() => {
      const newData = new Set<string>();
      formattedGuess.forEach((letter) => {
        newData.add(letter.key);
      });
      return newData;
    });

    setUsedKeys((prevUsedKeys) => {
      const nextUsedKeys = new Map(prevUsedKeys);
      formattedGuess.forEach((letter) => {
        const prevColor = nextUsedKeys.get(letter.key);
        const prevRank = prevColor ? KEY_RANK[prevColor] ?? 0 : 0;
        if ((KEY_RANK[letter.color] ?? 0) > prevRank) {
          nextUsedKeys.set(letter.key, letter.color);
        }
      });
      return nextUsedKeys;
    });

    setCurrentGuess("");
  };

  const handleKeyup = ({ key }: { key: string }): void => {
    if (game.isOver) return;

    if (key === "Enter") {
      if (currentGuess.length !== 5) {
        window.alert("You need to enter 5 characters before submitting a word");
        return;
      }

      const res = game.submit(currentGuess);
      if (
        res.status === Status.MATCH ||
        res.status === Status.MISMATCH ||
        res.status === Status.MISS_ALL
      ) {
        const isMatch = res.status === Status.MATCH;
        if (game.isOver) {
          recordGame({
            date: new Date().toISOString(),
            answer: game.answer,
            won: isMatch,
            turns: game.turn,
          });
        }
        if (res.word) setSolution(res.word);
        const formatted = formatGuess(res.letter_colors ?? "");
        addNewGuess(formatted, isMatch);
      } else if (res.status === Status.USED) {
        window.alert("Word already entered");
      } else if (res.status === Status.INVALID_WORD) {
        window.alert("You entered an invalid word");
      }
      return;
    }

    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key.toLowerCase());
    }
  };

  return {
    turn,
    currentGuess,
    guesses,
    history,
    isCorrect,
    newKeys,
    usedKeys,
    solution,
    handleKeyup,
  };
};

export default useWordle;
