import React, { useContext, useEffect, useState } from "react";
import "./card.scss";
import "@/components/Projects/projects.scss";
import { SelectedProjectContext } from "@/views/Dashboard/Dashboard";
import { SumCardsCurrentTimesContext } from "@/views/Dashboard/Dashboard";
import { generateUid } from '@/helpers/uid';
import moment from "moment-with-locales-es6";
import FIcon from '@/components/Icons/FilterIcon';
import EIcon from '@/components/Icons/EditIcon';
import TIcon from '@/components/Icons/TrashIcon';
import Timer from '@/components/Timer/Timer';
import { db, auth } from '@/firebase/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { disablePointer } from "@/helpers/disablePointer";

// Set moment locale to de to get the german date/time format
moment.locale('de');

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
    if (props.timerActive == true) {
      if (props.timerStartTime != "") {
        setTimerStartTime(props.timerStartTime);
      }
    }

    // Red current if over limit, green if under Limit
    if (cardCurrent > 0 && cardCurrent > props.limit && props.limit != 0) {
      currentRef.current.classList.add('red');
    } else if (cardCurrent > 0 && props.limit != 0) {
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

    // Card component gives current time with id to parent Cards component
    props.getCurrentFromCard(timeInHours, props.id);

    // Reset current time of a card to 0 if timer is 0
    if (timeInHours == 0) {
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
          ${props.selectedCategory == props.category ? props.category : ''}
          ${props.selectedCategory == 'All' ? props.category : ''}`}>
      <div className="card-control">
        <div onClick={handleEditModal} className="edit-container">
          <EIcon />
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
              <button onClick={(e) => { handleEdit(props.id) }} className='btn-create'>Save</button>
            </div>
          </div>
        </div>
        <div onClick={handleDeleteModal} className="delete-container">
          <TIcon />
        </div>
        <div className={`modal delete-card-modal ${openDeleteModal ? 'open' : ''}`}>
          <div className="modal-content">
            <h2>Delete Card ?</h2>
            <div className="btn-container">
              <button onClick={handleDeleteModal} className='btn-cancel'>Cancel</button>
              <button onClick={(e) => { handleDelete(props.id) }} className='btn-delete'>Delete</button>
            </div>
          </div>
        </div>
        <span className="card-created-at">{props.createdAt}</span>
      </div>
      <h3 className="card-category">{props.category}</h3>
      <h2 className="card-name">{props.name}</h2>
      <p className="card-desc">{props.description}</p>
      <div className="card-times">
        <span ref={currentRef} className="card-current"><strong>Current:</strong> <span className="current-num">{cardCurrent}h</span></span>
        <span className="seperator"> | </span>
        <span className="card-limit"><strong>Limit:</strong> {props.limit}h</span>
      </div>

      <Timer getCardId={props.getCardId} getTimeFromTimer={getTime} timerActive={getTimerActiveCard}
        handleTimerActive={handleTimerActive} cardLimit={props.limit} saveTimerStartTime={saveStartTime} timerStartTime={timerStartTime}
      />
    </div>
  )
}

export function Cards() {
  const [user, loading] = useAuthState(auth);
  const [cardList, addToCardList] = useState([]);
  // Get values from contextprovider (from project)
  const { selectedProject } = useContext(SelectedProjectContext);
  // Get the sum of cards from contextprovider(from project -> dashboard -> card)
  const { setSumCardsCurrent } = useContext(SumCardsCurrentTimesContext);
  const [selectedCategory, setCategory] = useState("All");
  const [modal, openModal] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [cardLimit, setCardLimit] = useState(0);
  const [filterCards, setFilterCards] = useState("All");

  async function getCardsFromDb() {
    const docRef = db.collection("users").doc(user?.uid);
    docRef.get().then((doc) => {
      if (doc.exists) {
        if (doc.data().cardList && doc.data().cardList.length > 0) {
          addToCardList(doc.data().cardList);
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No Cards in document DB!");
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
    });
  }

  async function addCardListToDb() {
    try {
      const userRef = db.collection("users");
      const query = userRef.doc(user?.uid)

      if (query != undefined && cardList.length > 0) {
        await query.update({ cardList });
      }
    } catch (err) {
      alert('Couldnt connect to database!');
      console.error(err);
    }
  }

  useEffect(() => {
    addCardListToDb();
  }, [cardList])

  useEffect(() => {
    getCardsFromDb();
  }, [user])

  useEffect(() => {
    sumCardCurrentTimes();
  }, [selectedProject])

  function sumCardCurrentTimes() {
    if (selectedProject) {
      if (cardList.length > 0) {
        let sumCurrents = 0;
        let cardProjectId = "";
        cardList.map((card) => {
          if (selectedProject == card.projectId) {
            // Convert card current from string to float and add with sumCurrents
            // toFixed return given digits after decimal point
            sumCurrents = +(sumCurrents + parseFloat(card.current)).toFixed(12);
            cardProjectId = card.projectId;
          }
        })
        setSumCardsCurrent({ sumCurrents, cardProjectId });
      }
    }
  }

  // Gets values from child Card and updates the current time of the selected Card
  function updateCardCurrent(selectedCardCurrent, selectedCardId) {
    if (cardList) {
      cardList.map((card) => {
        if (card.id == selectedCardId) {
          if (selectedCardCurrent > 0) {
            card.current = selectedCardCurrent;
            addCardListToDb();
          } else if (selectedCardCurrent == 0) {
            card.current = 0;
            addCardListToDb();
          }
        }
      })
      sumCardCurrentTimes();
    }
  }

  function handleTimerActive(setTimerActive, selectedCardId) {
    if (cardList) {
      if (setTimerActive == true) {
        cardList.map((card) => {
          if (card.id == selectedCardId) {
            card.timerActive = true;
            addCardListToDb();
          }
        })
      } else if (setTimerActive == false) {
        cardList.map((card) => {
          if (card.id == selectedCardId) {
            card.timerActive = false;
            addCardListToDb();
          }
        })
      }
    }
  }

  function timerStartToCard(startTime, cardId) {
    console.log(startTime, cardId);
    if (cardList) {
      cardList.map((card) => {
        if (card.id == cardId) {
          card.timerStartTime = startTime;
          addCardListToDb();
        }
      })
    }
  }

  // Add, add-card button to titlebar (for fixed positioning)
  const addCardBtn = document.querySelectorAll('.add-card')[0];
  const titleBar = document.querySelectorAll('.titlebar')[0];
  if (addCardBtn) {
    if (titleBar) {
      titleBar.appendChild(addCardBtn);
    }
  }

  function openCreateCardModal() {
    try {
      openModal(true);
      disablePointer(true);
    } catch (e) {
      console.error(e);
    }
  }

  function closeModal() {
    if (openModal) {
      try {
        openModal(false);
        disablePointer(false);
      } catch (e) {
        console.error(e);
      }
    }
  }

  function createCard() {
    const cardItem = [{
      projectId: selectedProject,
      name: cardName,
      limit: cardLimit,
      current: 0,
      desc: cardDesc,
      category: selectedCategory,
      id: generateUid(),
      timerActive: false,
      timer: 0,
      timerStartTime: '',
      createdAt: moment().format('l, LT'),
    }]

    if (cardName !== "") {
      // concat returns new array with cardItem appended to the end
      const newCard = cardList.concat(cardItem);
      addToCardList(newCard);

      closeModal();
    } else {
      alert("Card name cant be empty");
    }
  }

  function deleteCard(id) {
    try {
      const updatedCardList = cardList.filter((item) => item.id !== id);
      addToCardList(updatedCardList);
    } catch (e) {
      console.error(e);
    }
  }

  function editCard(editedCard, id) {
    const newList = cardList.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          desc: editedCard.newDesc,
          name: editedCard.newName,
          limit: editedCard.newLimit,
          category: editedCard.newCateg,
        };

        return updatedItem;
      }

      return item;
    });

    addToCardList(newList);
  }

  return (
    <>
      <button onClick={() => { selectedProject ? openCreateCardModal() : alert('create project first') }}
        className={`${selectedProject ? "" : "disabled"} add-card`}>
        New Card
      </button>
      <div className={`modal new-card-modal ${modal ? 'open' : ''}`}>
        <div className="modal-content">
          <div className="input-container">
            <h2>Create new Card</h2>
            <input
              type="text"
              className="input"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Enter Card name"
            />
            <h3>Enter short Card description</h3>
            <input
              type="text"
              className="input"
              maxLength={50}
              value={cardDesc}
              onChange={(e) => setCardDesc(e.target.value)}
              placeholder="Enter Card description"
            />
            <h3>Select a category</h3>
            <select value={selectedCategory} onChange={(e) => setCategory(e.target.value)}
              name="category" className="category-select">
              <option value="All">All</option>
              <option value="Feature">Feature</option>
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
            </select>
            <h4>Enter a Card time limit in hours (no limit if empty)</h4>
            <input
              type="number"
              className="input"
              value={cardLimit}
              onChange={(e) => setCardLimit(parseInt(e.target.value))}
              placeholder="Card limit in h"
            />
          </div>
          <div className="btn-container">
            <button onClick={closeModal} className='btn-cancel'>Cancel</button>
            <button onClick={createCard} className='btn-create'>Create</button>
          </div>
        </div>
      </div>
      <div className='category-filter'>
        <span className='filter-info'><FIcon /></span>
        <select value={filterCards} onChange={(e) =>
          setFilterCards(e.target.value)} name="category" className="filtered-category">
          <option value="All"> All</option>
          <option value="Feature"> Feature</option>
          <option value="Task"> Task</option>
          <option value="Bug"> Bug</option>
          <option value="Done"> Done</option>
        </select>
      </div>
      <div className='cards'>
        {
          filterCards &&
          cardList &&
          cardList.map((card) => {
            if (card.projectId == selectedProject) {
              return (
                <CardWithTimer
                  key={card.id}
                  id={card.id}
                  name={card.name}
                  category={card.category}
                  description={card.desc}
                  limit={card.limit}
                  createdAt={card.createdAt}
                  getCardId={card.id}
                  selectedCategory={filterCards}
                  getCurrentFromCard={updateCardCurrent}
                  getCurrent={card.current}
                  timerActive={card.timerActive}
                  handleTimerActive={handleTimerActive}
                  handleDelete={deleteCard}
                  handleEdit={editCard}
                  timerStartTime={card.timerStartTime}
                  addTimerStartToCard={timerStartToCard}
                />
              )
            }
          })
        }
      </div>
    </>
  )
}
