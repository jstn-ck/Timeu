import React, {useContext, useEffect, useState} from "react";
import "./cards.scss";
import "@/components/Projects/projects.scss";
import {SelectedProjectContext, SumCardsCurrentTimesContext} from "@/views/Dashboard/Dashboard";
import {generateUid} from '@/helpers/uid';
import moment from "moment-with-locales-es6";
import FIcon from '@/components/Icons/FilterIcon';
import {auth, db} from '@/firebase/firebase';
import {useAuthState} from "react-firebase-hooks/auth";
import {disablePointer} from "@/helpers/disablePointer";
import {CardWithTimer} from "@/components/Cards/CardWithTimer";

// Set moment locale to de to get the german date/time format
moment.locale('de');

export function Cards() {
  const [user, loading] = useAuthState(auth);
  const [cardList, addToCardList] = useState([]);
  // Get values from contextprovider (from project)
  const {selectedProject} = useContext(SelectedProjectContext);
  // Get the sum of cards from contextprovider(from project -> dashboard -> card)
  const {setSumCardsCurrent} = useContext(SumCardsCurrentTimesContext);
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
      const userRef = db.collection("users").doc(user?.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          if (!doc.data().cardList) {
            userRef.update({cardList});
          } else if (doc.data().cardList) {
            userRef.update({cardList});
          }
        } else {
          // doc.data() will be undefined
          console.log("No Cards in document DB!");
        }
      })
    } catch (err) {
      console.error(err);
      alert('Couldnt connect to Database!');
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

  function sumCardCurrentTimes(cards) {
    if (selectedProject) {
      if (cardList.length > 0) {
        let sumCurrents = 0;
        let cardProjectId = "";
        cardList.map((card) => {
          if (selectedProject === card.projectId) {
            // Convert card current from string to float and add with sumCurrents
            // toFixed return given digits after decimal point
            sumCurrents = +(sumCurrents + parseFloat(card.current)).toFixed(12);
            cardProjectId = card.projectId;
          }
        })
        setSumCardsCurrent({sumCurrents, cardProjectId});
      }
      if (cards) {
        if (cards.length >= 0) {
          console.log('yes')
          let sumCurrents = 0;
          cards.map((card) => {
            if (selectedProject === card.projectId) {
              sumCurrents = +(sumCurrents + parseFloat(card.current)).toFixed(12);
              cardProjectId = card.projectId;
            }
          })
          setSumCardsCurrent({sumCurrents, selectedProject});
        }
      }
    }
  }

  // Gets values from child Cards and updates the current time of the selected Cards
  function updateCardCurrent(selectedCardCurrent, selectedCardId) {
    if (cardList) {
      cardList.map((card) => {
        if (card.id === selectedCardId) {
          if (selectedCardCurrent > 0) {
            card.current = selectedCardCurrent;
            addCardListToDb();
          } else if (selectedCardCurrent === 0) {
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
      if (setTimerActive === true) {
        cardList.map((card) => {
          if (card.id === selectedCardId) {
            card.timerActive = true;
            addCardListToDb();
          }
        })
      } else if (setTimerActive === false) {
        cardList.map((card) => {
          if (card.id === selectedCardId) {
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
        if (card.id === cardId) {
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
      alert("Cards name cant be empty");
    }
  }

  function deleteCard(id) {
    try {
      const updatedCardList = cardList.filter((item) => item.id !== id);
      addToCardList(updatedCardList);
      sumCardCurrentTimes(updatedCardList);
    } catch (e) {
      console.error(e);
    }
  }

  function editCard(editedCard, id) {
    const newList = cardList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          desc: editedCard.newDesc,
          name: editedCard.newName,
          limit: editedCard.newLimit,
          category: editedCard.newCateg,
        };
      }

      return item;
    });

    addToCardList(newList);
  }

  return (
    <>
      <button onClick={() => {
        selectedProject ? openCreateCardModal() : alert('create project first')
      }}
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
        <span className='filter-info'><FIcon/></span>
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
            if (card.projectId === selectedProject) {
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
