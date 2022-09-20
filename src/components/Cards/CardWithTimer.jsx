import React, {useEffect, useState} from "react";
import {disablePointer} from "@/helpers/disablePointer";
import EIcon from "@/components/Icons/EditIcon";
import TIcon from "@/components/Icons/TrashIcon";
import Timer from "@/components/Timer/Timer";

export const CardWithTimer = (props) => {
  const [cardCurrent, setCardCurrent] = useState(props.getCurrent);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [getTimerActiveCard, setTimerActiveCard] = useState(props.timerActive);
  const [editedCardDesc, setEditedCardDesc] = useState(props.description);
  const [editedCardName, setEditedCardName] = useState(props.name);
  const [editedCardCateg, setEditedCardCateg] = useState(props.category);
  const [editedCardLimit, setEditedCardLimit] = useState(props.limit);
  const [timerStartTime, setTimerStartTime] = useState(props.timerStartTime);
  const currentRef = React.createRef();

  useEffect(() => {
    if (props.timerActive !== getTimerActiveCard) {
      setTimerActiveCard(props.timerActive);
    }
  }, [props.timerActive]);

  useEffect(() => {
    // After switching project the timer gets reset
    // So the card has to get its old value from the parent card value
    // Set it only if the parent value changes
    if (props.getCurrent !== cardCurrent) {
      setCardCurrent(props.getCurrent);
    }
  }, [props.getCurrent])

  useEffect(() => {
    if (props.timerActive === true) {
      if (props.timerStartTime !== "") {
        setTimerStartTime(props.timerStartTime);
      }
    }

    // Red current if over limit, green if under Limit
    if (cardCurrent > 0 && cardCurrent > props.limit && props.limit !== 0) {
      currentRef.current.classList.remove('green');
      currentRef.current.classList.add('red');
    } else if (cardCurrent >= 0 && props.limit !== 0) {
      currentRef.current.classList.remove('red');
      currentRef.current.classList.add('green');
    }
  })

  const handleTimerActive = (setTimerActive) => {
    props.handleTimerActive(setTimerActive, props.id);
  }

  // getTime gets the current time in hours from child Timer component
  const getTime = (timeInHours) => {
    setCardCurrent(timeInHours);

    // Cards component gives current time with id to parent Cards component
    props.getCurrentFromCard(timeInHours, props.id);

    // Reset current time of a card to 0 if timer is 0
    if (timeInHours === 0) {
      props.getCurrentFromCard(0, props.id);
      setCardCurrent(0);
    }
  }

  const saveStartTime = (timerStart) => {
    if (timerStart) {
      props.addTimerStartToCard(timerStart, props.id);
    }
  }

  function handleDelete(id) {
    if (openDeleteModal) {
      props.handleDelete(id);
      setOpenDeleteModal(false);
      disablePointer(false);
    }
  }

  function handleDeleteModal() {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      disablePointer(true);
    } else if (openDeleteModal) {
      disablePointer(false);
      setOpenDeleteModal(false);
    }
  }

  function handleEdit(id) {
    if (openEditModal) {
      const updatedItemValues = {
        newName: editedCardName,
        newDesc: editedCardDesc,
        newCateg: editedCardCateg,
        newLimit: editedCardLimit,
      }

      props.handleEdit(updatedItemValues, id);
      setOpenEditModal(false);
      disablePointer(false);
    }
  }

  function handleEditModal() {
    if (!openEditModal) {
      setOpenEditModal(true);
      disablePointer(true);
    } else if (openEditModal) {
      disablePointer(false);
      setOpenEditModal(false);
    }
  }

  // Cards get filtered based on class to prevent timer reset
  return (
    <div key={props.id} className={`card-container
          ${props.selectedCategory === props.category ? props.category : ''}
          ${props.selectedCategory === 'All' ? props.category : ''}`}>
      <div className="card-control">
        <div onClick={handleEditModal} className="edit-container">
          <EIcon/>
        </div>
        <div className={`modal edit-card-modal ${openEditModal ? 'open' : ''}`}>
          <div className="modal-content">
            <div className="input-container">
              <h2>Edit Card</h2>
              <input
                type="text"
                className="input"
                maxLength={50}
                value={editedCardName}
                onChange={(e) => setEditedCardName(e.target.value)}
                placeholder="Enter new Card name"
              />
              <h3>Enter new Card description</h3>
              <input
                type="text"
                className="input"
                maxLength={50}
                value={editedCardDesc}
                onChange={(e) => setEditedCardDesc(e.target.value)}
                placeholder="Enter New Card description"
              />
              <h3>Select a new category</h3>
              <select value={editedCardCateg} onChange={(e) => setEditedCardCateg(e.target.value)}
                      name="category" className="category-select">
                <option value="All">All</option>
                <option value="Feature">Feature</option>
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Done">Done</option>
              </select>
              <h4>Enter a new Card time limit in hours</h4>
              <input
                type="number"
                className="input"
                value={editedCardLimit}
                onChange={(e) => setEditedCardLimit(parseInt(e.target.value))}
                placeholder="Card limit in h"
              />
            </div>
            <div className="btn-container">
              <button onClick={handleEditModal} className='btn-cancel'>Cancel</button>
              <button onClick={(e) => {
                handleEdit(props.id)
              }} className='btn-create'>Save
              </button>
            </div>
          </div>
        </div>
        <div onClick={handleDeleteModal} className="delete-container">
          <TIcon/>
        </div>
        <div className={`modal delete-card-modal ${openDeleteModal ? 'open' : ''}`}>
          <div className="modal-content">
            <h2>Delete Card ?</h2>
            <div className="btn-container">
              <button onClick={handleDeleteModal} className='btn-cancel'>Cancel</button>
              <button onClick={(e) => {
                handleDelete(props.id)
              }} className='btn-delete'>Delete
              </button>
            </div>
          </div>
        </div>
        <span className="card-created-at">{props.createdAt}</span>
      </div>
      <h3 className="card-category">{props.category}</h3>
      <h2 className="card-name">{props.name}</h2>
      <p className="card-desc">{props.description}</p>
      <div className="card-times">
        <span ref={currentRef} className="card-current"><strong>Current:</strong> <span
          className="current-num">{cardCurrent}h</span></span>
        <span className="seperator"> | </span>
        <span className="card-limit"><strong>Limit:</strong> {props.limit}h</span>
      </div>

      <Timer getCardId={props.getCardId} getTimeFromTimer={getTime} timerActive={getTimerActiveCard}
             handleTimerActive={handleTimerActive} cardLimit={props.limit} saveTimerStartTime={saveStartTime}
             timerStartTime={timerStartTime}
      />
    </div>
  )
}
