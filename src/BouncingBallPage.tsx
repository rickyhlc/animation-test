import { useState, useRef } from "react";
import { motion, useAnimate } from "motion/react";

const diameter = 100;
const initialX = 0;
const initialY = 0;
const duration = 2;
const gameDuration = 30;

interface Location {
  toX: number;
  toY: number;
  fromX: number;
  fromY: number;
}

function getNextLoc(loc: Location): Location {
  let x = 0;
  let y = 0;
  let toOppositeSide = Math.floor(genNum(3)) == 0;
  if (loc.toX == 0) {
    if (loc.toY > loc.fromY) {
      if (toOppositeSide) {
        x = 100;
        y = genNum(loc.toY, 100);
      } else {
        x = genNum(100);
        y = 100;
      }
    } else {
      if (toOppositeSide) {
        x = 100;
        y = genNum(0, loc.toY);
      } else {
        x = genNum(100);
        y = 0;
      }
    }
  } else if (loc.toX == 100) {
    if (loc.toY > loc.fromY) {
      if (toOppositeSide) {
        x = 0;
        y = genNum(loc.toY, 100);
      } else {
        x = genNum(100);
        y = 100;
      }
    } else {
      if (toOppositeSide) {
        x = 0;
        y = genNum(0, loc.toY);
      } else {
        x = genNum(100);
        y = 0;
      }
    }
  } else if (loc.toY == 0) {
    if (loc.toX > loc.fromX) {
      if (toOppositeSide) {
        x = genNum(loc.toX, 100);
        y = 100;
      } else {
        x = 100;
        y = genNum(100);
      }
    } else {
      if (toOppositeSide) {
        x = genNum(0, loc.toX);
        y = 100;
      } else {
        x = 0;
        y = genNum(100);
      }
    }
  } else if (loc.toY == 100) {
    if (loc.toX > loc.fromX) {
      if (toOppositeSide) {
        x = genNum(loc.toX, 100);
        y = 0;
      } else {
        x = 100;
        y = genNum(100);
      }
    } else {
      if (toOppositeSide) {
        x = genNum(0, loc.toX);
        y = 0;
      } else {
        x = 0;
        y = genNum(100);
      }
    }
  }

  return {
    fromX: loc.toX,
    fromY : loc.toY,
    toX: x,
    toY: y
  }
}

/**
 * 
 *   0/400    100
 *        ----
 *        |  |
 *        ----
 *     300    200
 */
function genNum(max: number, min: number = 0) {
  return Math.random() * (max - min) + min;
}

function BouncingBallPage() {

  const [scope, animate] = useAnimate();

  // left, top are in %
  const locRef = useRef({ toX: initialX, toY: initialY, fromX: initialX-1, fromY: initialY-1});
  const gameTimerRef = useRef<number | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [timeRemain, setTimeRemain] = useState(gameDuration);
  const [score, setScore] = useState(0);

  function startGame(){
    setPlaying(true);
    gameTimerRef.current = setInterval(() => {
      setTimeRemain(prev => prev - 1);
    }, 1000);
    moveBall();
  }

  function endGame(){
    setScore(0);
    setTimeRemain(gameDuration);
  }

  if (playing && timeRemain == 0) {
    clearInterval(gameTimerRef.current);
    gameTimerRef.current = 0;
    setPlaying(false);
    alert("You score is " + score);
    endGame();
  }

  async function moveBall() {
    while (gameTimerRef.current) {
      locRef.current = getNextLoc(locRef.current);
      await animate(scope.current, {
        top: `${locRef.current.toY}%`,
        left: `${locRef.current.toX}%`,
      }, { duration: duration, ease: "linear" });
    };
  }

  async function handleTouch(){
    setScore(score + 1);
    await animate(scope.current, {
      filter: "drop-shadow(0 0 1em #61dafbaa)"
    }, { duration: 0.05 });
    await animate(scope.current, {
      filter: "drop-shadow(0 0 0 #000000)"
    }, { duration: 0.05 });
  }

  return (
    <div style={page}>
      <div style={outerBallContainer}>
        <div style={ballContainer}>
          <div ref={scope} onMouseDown={handleTouch} style={ball}></div>
        </div>
      </div>
      <div style={panel}>
        {playing ? (
          <div>
            <span>Time Remaining: </span>
            <motion.div
              style={{transform: "translate(-50%, -50%)", display: "inline-block"}}
              animate={timeRemain <= 6 ? { rotate: 360, scale: 1.8, color: "red" } : { rotate: 360 }}
              transition={{ repeat: Infinity, type: 'spring', velocity: 10, duration: 1 }}
            >
              {timeRemain - 1}
            </motion.div>
          </div>
        ) : (
          <>
            <button onClick={startGame}>Start</button>
            <div>Time Remaining: {timeRemain}</div>
          </>
        )}
        <div>Current Score: {score}</div>
      </div>
    </div>
  )
}

const page = {
  width: "100%",
  height: "100%",
  padding: 40,
  display: "flex",
  gap: 40,
  alignItems: "center",
  justifyContent: "center",
}

const outerBallContainer = {
  flexBasis: 500,
  minWidth: 500,
  aspectRatio: "1 / 1",
  backgroundColor: "#4a4a4a",
  flexGrow: 1,
}
const ballContainer = {
  position: "relative" as const,
  width: `calc(100% - ${diameter}px)`,
  height: `calc(100% - ${diameter}px)`,
}

const ball = {
  position: "absolute" as const,
  left: initialX,
  top: initialY,
  width: diameter,
  height: diameter,
  backgroundColor: "#61dafb",
  borderRadius: diameter,
  willChange: "filter,left,top",
}

const panel = {
  height: "100%",
  flexGrow: 1,
  flexBasis: 200,
}

export default BouncingBallPage;
