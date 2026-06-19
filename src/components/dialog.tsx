import { useEffect, useRef, useState } from "react";
import "./dialog.css";

type Stage = "DISPLAYING_TEXT" | "WAITING_FOR_INPUT";

interface ACDialogProps {
  speaker: string;
  allLines: string[];
  speed?: number;
  onFinish?: () => void;
}

function ACDialog({
  speaker: speaker,
  allLines,
  speed = 1,
  onFinish,
}: ACDialogProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("DISPLAYING_TEXT");
  const [counter, setCounter] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const audioEl = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (stage === "DISPLAYING_TEXT") {
      const timeout = setTimeout(
        () => {
          const currentText = allLines[currentTextIndex];
          if (displayedText.length >= currentText.length) {
            setStage("WAITING_FOR_INPUT");
            clearTimeout(timeout);
            return;
          }
          const newCounter = counter + 1;
          setCounter(newCounter);
          setDisplayedText(currentText.slice(0, newCounter));
        },
        Math.floor(20 / speed),
      );
      return () => clearTimeout(timeout);
    }
  }, [stage, counter, displayedText.length, speed, currentTextIndex, allLines]);
  useEffect(() => {
    if (audioEl.current) {
      audioEl.current.playbackRate = 1.8 * speed;
      if (stage === "DISPLAYING_TEXT") {
        audioEl.current.play();
      } else {
        audioEl.current.pause();
      }
    }
  }, [audioEl, stage, speed]);
  return (
    <div className="dialog" onClick={clickHandler}>
      <audio
        ref={audioEl}
        src="/animalese.wav"
        loop
        autoPlay={true}
        onLoad={() => audioEl.current?.pause()}
      />
      <div className="name-plate">
        <h2>{speaker}</h2>
      </div>
      <p>{displayedText}</p>
      {stage === "WAITING_FOR_INPUT" && <div className="finish-marker" />}
    </div>
  );

  function clickHandler() {
    if (stage === "WAITING_FOR_INPUT") {
      if (currentTextIndex >= allLines.length - 1) {
        onFinish?.();
      } else {
        setCurrentTextIndex((index) => index + 1);
        setCounter(0);
        setDisplayedText("");
        setStage("DISPLAYING_TEXT");
      }
    } else {
      setDisplayedText(allLines[currentTextIndex]);
      setStage("WAITING_FOR_INPUT");
    }
  }
}

export default ACDialog;
