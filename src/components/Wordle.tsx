import { useEffect, useState } from "react";
import useWordle from "../hooks/useWordle";

// components
import Grid from "./Grid";
import Keypad from "./Keypad";
import Modal from "./Modal";

interface WordleProps {
  active: boolean;
}

export default function Wordle({ active }: WordleProps): JSX.Element {
  const {
    currentGuess,
    guesses,
    turn,
    isCorrect,
    newKeys,
    usedKeys,
    solution,
    handleKeyup,
  } = useWordle();
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (!active || isCorrect || turn > 5) return;
    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  }, [active, handleKeyup, isCorrect, turn]);

  useEffect(() => {
    if (!isCorrect && turn <= 5) return;
    const timer = setTimeout(() => setShowModal(true), 2000);
    return () => clearTimeout(timer);
  }, [isCorrect, turn]);

  return (
    <div>
      {showModal && (
        <Modal isCorrect={isCorrect} solution={solution} turn={turn} />
      )}
      {!showModal && (
        <div>
          <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
          <Keypad
            newKeys={newKeys}
            usedKeys={usedKeys}
            handleKeyup={handleKeyup}
          />
        </div>
      )}
    </div>
  );
}
