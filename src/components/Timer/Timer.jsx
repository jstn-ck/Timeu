import React, { useEffect, useRef, useState } from "react";
import "./timer.scss";

function Timer(props) {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(props.timerActive);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  // Use Ref does not cause re render after every update, is needed because timer is already re rendering component
  const progressBarWidthRef = useRef(null);
  const countRef = useRef(null);
  // Get progressbar as dom element, individually for each card
  const pBarRef = React.createRef();

  useEffect(() => {
    if (props.timerActive !== isTimerActive) {
      setIsTimerActive(props.timerActive);
    }
  }, [props.timerActive]);

  useEffect(() => {
    startTimerIfActive()
  }, [props.timerActive])

  useEffect(() => {
    calculateProgress();
  })

  function calculateProgPxPerSecond() {
    let progressBarMaxWidth = 225;

    // Calculates the pixel that progressBar needs per second depending on card limit
    if (props.cardLimit != undefined) {
      const limitInSeconds = props.cardLimit * 60 * 60;
      const percentageFromLimit = 1 / limitInSeconds;
      const pxPerSecond = percentageFromLimit * progressBarMaxWidth;
      const timerInSeconds = getTimeInHours(timer) * 60 * 60;
      const currentPxPerSecond = timerInSeconds * pxPerSecond;

      return currentPxPerSecond;
    }
  }

  function calculateProgress() {
    const progressBar = document.querySelectorAll('.timer-progressbar')[0];

    if (props.timerActive == false && isActive == false) {
      if (progressBar) {
        if (props.cardLimit != undefined && props.cardLimit != 0) {
          pBarRef.current.style.width = calculateProgPxPerSecond() + "px";
        }
      }
    } else if (isTimerActive == true || isActive == true) {
      if (progressBar) {
        if (props.cardLimit != undefined && props.cardLimit != 0) {
          // setProgressBarWidth(calculateProgPxPerSecond() + 'px');
          // progressBarWidthRef.current = setInterval(() => {
          //   progressBar.style.width = progressBarWidth;
          //  }, 1000)
        }
      }
    }
  }

  const startTimerIfActive = async () => {
    if (await isTimerActive == true) {
      setIsActive(true)
      handleStart();
      calculateProgress();

    } else if (await isTimerActive == false) {
      clearInterval(progressBarWidthRef.current);
    }
  }

  const handleStart = () => {
    calculateProgress();

    if (isTimerActive == false) {
      props.handleTimerActive(true);
      setIsActive(true);
    }

    if (!isActive) {
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 30)
      }, 1000)
    }
  }

  const handlePause = () => {
    clearInterval(progressBarWidthRef.current);
    clearInterval(countRef.current);
    setIsActive(false);
    props.handleTimerActive(false);
    calculateProgress();
  }

  const handleReset = () => {
    clearInterval(countRef.current);
    clearInterval(progressBarWidthRef.current);
    setIsActive(false);
    setTimer(0);
    props.getTimeFromTimer(0);
  }

  return (
    <div className='timer'>
      <div ref={pBarRef} className="timer-progressbar"></div>
      <p className="time">{formatTime(timer)}</p>
      <div className='timer-buttons'>
        <button className={`${isActive ? "active" : ""}`} disabled={isActive} onClick={handleStart}>Start</button>
        <button className={`${isActive ? "" : "active"}`}
          onClick={() => { props.getTimeFromTimer(getTimeInHours(timer)); handlePause(); }}>
          Pause
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  )
}

const getTimeInHours = (timer) => {
  // toFixed formats decimal with 2 numbers
  const timeInHours = `${(timer / 60 / 60).toFixed(2)}`;
  return timeInHours;
}

const formatTime = (timer) => {
  // Slice(-2) returns last 2 items of string/array item
  const getSeconds = `0${(timer % 60)}`.slice(-2);
  const minutes = `${Math.floor(timer / 60)}`;
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

  // Returns time formated for display on card
  return `${getHours}:${getMinutes}:${getSeconds}`;
}

export default Timer;
