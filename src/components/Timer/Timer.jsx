import moment from "moment-with-locales-es6";
import React, {useEffect, useRef, useState} from "react";
import "./timer.scss";

function Timer(props) {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(props.timerActive);
  const [timerStart, setTimerStart] = useState('');
  const [resetModal, openResetModal] = useState(false);
  // Use Ref does not cause re render after every update, is needed because timer is already re rendering component
  const countRef = useRef(null);
  // Get progressbar as dom element, individually for each card
  const pBarRef = React.createRef();

  useEffect(() => {
    if (props.timerActive !== isTimerActive) {
      setIsTimerActive(props.timerActive);
    }

    startTimerIfActive()
  }, [props.timerActive]);

  useEffect(() => {
    calculateProgress();
    colorizeProgBar();

    if (isActive) {
      pBarRef.current.style.width = calculateProgPxPerSecond() + "px";
    }
    // Dont let progressbar go further than max width
    if (parseFloat(pBarRef.current.style.width) >= 225) {
      pBarRef.current.style.width = "225px";
    }
  })

  useEffect(() => {
    if (isTimerActive == true) {
      setTimeAfterReset();
    }
  }, [props.timerStartTime])

  function colorizeProgBar() {
    if (parseFloat(pBarRef.current.style.width) >= 5) {
      if (parseFloat(pBarRef.current.style.width) >= 95) {
        pBarRef.current.classList.add('yellow');
      }
      if (parseFloat(pBarRef.current.style.width) >= 140) {
        pBarRef.current.classList.remove('yellow');
        pBarRef.current.classList.add('orange');
      }
      if (parseFloat(pBarRef.current.style.width) >= 175) {
        pBarRef.current.classList.remove('orange');
        pBarRef.current.classList.add('red');
      }
    }
  }

  function setTimeAfterReset() {
    if (props.timerStartTime !== "" && props.timerStartTime !== undefined) {
      const dateNow = moment();
      // Gets the difference of now and timer started in seconds (JSON.parse to add to database)
      const timerDiffInSeconds = dateNow.diff(JSON.parse(props.timerStartTime), 'seconds');
      setTimer(timer + timerDiffInSeconds);
    }
  }

  function calculateProgPxPerSecond() {
    let progressBarMaxWidth = 225;

    // Calculates the pixel that progressBar needs per second depending on card limit
    if (props.cardLimit !== undefined) {
      const limitInSeconds = props.cardLimit * 60 * 60;
      const percentageFromLimit = 1 / limitInSeconds;
      const pxPerSecond = percentageFromLimit * progressBarMaxWidth;
      const timerInSeconds = getTimeInHours(timer) * 60 * 60;
      return timerInSeconds * pxPerSecond;
    }
  }

  function calculateProgress() {
    const progressBar = document.querySelectorAll('.timer-progressbar')[0];

    if (props.timerActive === false && isActive === false) {
      if (progressBar) {
        if (props.cardLimit !== undefined && props.cardLimit !== 0) {
          pBarRef.current.style.width = calculateProgPxPerSecond() + "px";
        }
      }
    }
  }

  const startTimerIfActive = async () => {
    if (await isTimerActive === true) {
      setIsActive(true)
      handleStart();
      calculateProgress();

    } else if (await isTimerActive === false) {
      clearInterval(countRef.current);
    }
  }

  const handleStart = () => {
    if (isTimerActive === false) {
      props.handleTimerActive(true);
      setIsActive(true);
    }

    if (!isActive) {
      countRef.current = setInterval(() => {
        setTimer((timer) => timer + 80)
      }, 1000)
    }
  }

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    props.handleTimerActive(false);
    calculateProgress();
  }

  const handleReset = () => {
    clearInterval(countRef.current);
    setIsActive(false);
    setTimer(0);
    props.getTimeFromTimer(0);
    if (resetModal) {
      openResetModal(false);
    }
  }

  function saveTimerStart() {
    setTimerStart(moment());
    props.saveTimerStartTime('' + moment());
  }

  return (
    <div className='timer'>
      <div ref={pBarRef} className="timer-progressbar"></div>
      <p className="time">{formatTime(timer)}</p>
      <div className='timer-buttons'>
        <button className={`${isActive ? "active" : ""}`} disabled={isActive} onClick={() => {
          handleStart();
          saveTimerStart();
        }}>Start
        </button>
        <button className={`${isActive ? "" : "active"}`}
                onClick={() => {
                  props.getTimeFromTimer(getTimeInHours(timer));
                  handlePause();
                }}>
          Pause
        </button>
        <button onClick={() => {
          openResetModal(true);
        }}>Reset
        </button>
        <div className={`modal reset-timer-modal ${resetModal ? 'open' : ''}`}>
          <div className="modal-content">
            <h2>Reset Timer ?</h2>
            <div className="btn-container">
              <button onClick={() => {
                openResetModal(false)
              }} className='btn-cancel'>Cancel
              </button>
              <button onClick={(e) => {
                handleReset()
              }} className='btn-reset'>Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getTimeInHours = (timer) => {
  // toFixed formats decimal with 2 numbers
  return `${(timer / 60 / 60).toFixed(2)}`;
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
