import { useEffect, useMemo, useState } from "react";
import "./App.css";
import ACDialog from "./components/dialog";

type Stage = "START" | "MESSAGE" | "PRESENT";

const LEAF_PNG = "/animal-crossing-leaf.png";

function App() {
  const [stage, setStage] = useState<Stage>("START");
  const startAudio = useMemo(
    () => new Audio("/amazed-emote-animal-crossing.mp3"),
    [],
  );
  const bgm = useMemo(() => new Audio("/022 - 9 AM.mp3"), []);

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = LEAF_PNG;
  }, []);

  if (stage === "START") {
    return (
      <>
        <div className="container">
          <button className="start-button" onClick={() => kickOff()}>
            &gt;Click me to start&lt;
          </button>
          <span>(psst. make sure your sound is on)</span>
        </div>
      </>
    );
  } else if (stage === "MESSAGE") {
    return (
      <>
        <div className="background" />
        <ACDialog
          speaker="Nick Nook"
          allLines={[
            "What's good Maja?!",
            "Something just arrived in the mail for you. I wonder what it is...",
            "!!!",
            "It says 'Open me' on the package. Open it!",
          ]}
          speed={1}
          onFinish={() => finale()}
        />
        <button className="pause-music" onClick={() => pausePlayMusic()}>
          Pause/resume music
        </button>
      </>
    );
  }
  return (
    <>
      <div className="background dark" />
      <div className="present">
        <h1>Happy birthday, Maja!</h1>
        <p>
          Happy happy birthday baby! I love you sooooooooooo much and I hope you
          know how special you are to me. Here's a little thing for you, click
          da leaf to open your present!
        </p>
        <a
          href="https://youtu.be/zqAQqZSsxRk?si=q0SSfFTbPwnVAZGi"
          target="_blank"
          referrerPolicy="no-referrer"
        >
          <img
            src={LEAF_PNG}
            alt="present"
            width="60"
            height="60"
            className="present-image"
          />
        </a>
      </div>
    </>
  );

  function kickOff() {
    startAudio.play();
    bgm.loop = true;
    bgm.volume = 0.6;
    bgm.play();
    setStage("MESSAGE");
  }

  function pausePlayMusic() {
    if (bgm.paused) {
      bgm.play();
    } else {
      bgm.pause();
    }
  }

  function finale() {
    setStage("PRESENT");
    startAudio.play();
    bgm.pause();
  }
}

export default App;
