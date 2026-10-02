import { KeyColor, Letter } from "./Shared";

function Example({ word, colors }: { word: string; colors: KeyColor[] }) {
  const letters: Letter[] = [...word].map((key, i) => ({
    key,
    color: colors[i],
  }));
  return (
    <div className="row example">
      {letters.map((letter, i) => (
        <div key={i} className={letter.color}>
          {letter.key}
        </div>
      ))}
    </div>
  );
}

const { green, yellow, grey, empty } = KeyColor;

function Rules(): JSX.Element {
  return (
    <div className="rules">
      <h2>How to play</h2>
      <p>Guess the hidden five-letter word in six tries.</p>
      <ul>
        <li>Each guess must be a valid five-letter word.</li>
        <li>You can't guess the same word twice.</li>
        <li>
          Press <b>Enter</b> to submit. The tiles change color to show how close
          your guess was.
        </li>
      </ul>

      <h3>Examples</h3>
      <Example word="crane" colors={[green, empty, empty, empty, empty]} />
      <p>
        <b>C</b> is in the word and in the correct spot.
      </p>
      <Example word="pilot" colors={[empty, yellow, empty, empty, empty]} />
      <p>
        <b>I</b> is in the word but in the wrong spot.
      </p>
      <Example word="vague" colors={[empty, empty, empty, grey, empty]} />
      <p>
        <b>U</b> is not in the word.
      </p>

      <h3>Repeated letters</h3>
      <p>
        A letter is only colored as many times as it appears in the answer.
        Green tiles are counted first. If the answer is <b>CRANE</b> and you
        guess <b>EERIE</b>, only the last <b>E</b> turns green and the other two
        turn grey.
      </p>
      <Example word="eerie" colors={[grey, grey, yellow, grey, green]} />

      <h3>Keyboard</h3>
      <p>
        The on-screen keyboard keeps the best color each letter has earned, so
        you can see at a glance which letters are left to try.
      </p>

      <p>
        <a className="rules_play" href="#/">
          Play
        </a>
      </p>
    </div>
  );
}

export default Rules;
