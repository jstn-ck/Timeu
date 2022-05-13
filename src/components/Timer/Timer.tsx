import React, { useRef, useState } from "react";
import "./timer.scss";

function Timer(props: any) {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  // Use Ref does not re render after every update, is needed because timer is already re rendering component
  const countRef: any = useRef(null);

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(false)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 10)
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(true);
  }

  const handleResume = () => {
    setIsPaused(false);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 10);
    }, 1000)
  }

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(true);
    setTimer(0);
  }

  return (
        <div className='stopwatch-card'>
          <p>{formatTime(timer)}</p>
          <div className='buttons'>
            {
              !isActive && isPaused ?
                <button onClick={handleStart}>Start</button>
                : (
                  //Child(Timer) to parent(Card) communication
                  !isPaused ? <button onClick={() => { props.getTimeFromTimer(getTimeInHours(timer)); handlePause();}}>Pause</button> :
                    <button onClick={handleResume}>Resume</button>
                )
            }
            <button onClick={handleReset} disabled={!isActive}>Reset</button>
          </div>
        </div>
  )
}

const getTimeInHours = (timer: any) => {
    // toFixed formats decimal with 2 numbers
    const timeInHours = `${(timer / 60 / 60).toFixed(2)}`;
    return timeInHours;
  }

const formatTime = (timer: any) => {
  // Slice(-2) returns last to items of string/array item
  const getSeconds = `0${(timer % 60)}`.slice(-2);
  const minutes: any = `${Math.floor(timer / 60)}`;
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

  // Returns time formated for display on card
  return `${getHours}:${getMinutes}:${getSeconds}`;
}

export default Timer;
