import React, { useEffect, useRef, useState } from "react";
import "./timer.scss";

function Timer(props) {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const progressBarWidthRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  // Use Ref does not cause re render after every update, is needed because timer is already re rendering component
  const countRef = useRef(null);

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
    const progressBar = document.querySelectorAll('.card-progressbar')[0];

    if (props.timerActive == false && isActive == false) {
      if (progressBar) {
        if (props.cardLimit != undefined && props.cardLimit != 0) {
            progressBar.style.width = calculateProgPxPerSecond() + "px";
            
            if (progressBarWidth > 2) {
              progressBar.classList.add("red");
            }
          }
        }
      } else if (props.timerActive == true || isActive == true) {
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

  const startTimerIfActive = () => {
      if(props.timerActive == true) {
        // get time that timer was active and add to new timer
          setIsActive(true)
          calculateProgress();
          // countRef.current = setInterval(() => {
          //   setTimer((timer) => timer + 10)
          // }, 1000)
        } else if (props.timerActive == false) {
          clearInterval(progressBarWidthRef.current);
        }
    }

  const handleStart = () => {
    if(props.timerActive == false) {
        props.handleTimerActive(true);
        setIsActive(true);
      }

    if (!isActive) {
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 10)
      }, 1000)

      calculateProgress();
    }
  }

  const handlePause = () => {
    props.handleTimerActive(false);
    clearInterval(progressBarWidthRef.current);
    clearInterval(countRef.current);
    setIsActive(false);
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
      <div className="timer-progressbar"></div>
      <p className="time">{formatTime(timer)}</p>
      <div className='timer-buttons'>
        <button className={`${isActive ? "active" : ""}`} disabled={isActive} onClick={handleStart}>Start</button>
        <button className={`${isActive ? "" : "active"}`} onClick={() => { props.getTimeFromTimer(getTimeInHours(timer)); handlePause();}}>Pause</button>
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
