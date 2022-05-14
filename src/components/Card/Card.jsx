import React, { useContext, useEffect, useState } from "react";
import "./card.scss";
import "@/components/Projects/projects.scss";
import { SelectedProjectContext } from "@/views/Dashboard/Dashboard";
import { SumCardsCurrentTimesContext } from "@/views/Dashboard/Dashboard";
import { generateUid } from '@/helpers/uid';
import moment from "moment-with-locales-es6";
import FIcon from '@/components/Icons/FilterIcon';
import Timer from '@/components/Timer/Timer';
// Set momentjs to get german format
moment.locale('de');

// Creates the html structure for a Card with a timer
export const CardWithTimer = (props) => {
    const [cardCurrent, setCardCurrent] = useState(0);

    useEffect(() => {
        // After switching project the timer gets reset
        // So the card has to get its old value from the parent card value
        // Set it only if the parent value changes
        if(props.getCurrent) {
            setCardCurrent(props.getCurrent);
          }
      }, [props.getCurrent])

    const handleTimerActive = (setTimerActive) => {
      console.log('woop');
        props.handleTimerActive(setTimerActive, props.id);
      }

    // Get Time gets the current time in hours from child Timer component
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

    // Cards get filtered based on class to prevent timer reset
    return (
      <div key={props.id} className={`card-container
          ${props.selectedCategory == props.category ? props.category : ''}
          ${props.selectedCategory == 'All' ? props.category : ''}`}>
        <span className="card-created-at">{props.createdAt}</span>
        <h3 className="card-category">{props.category}</h3>
        <h2 className="card-name">{props.name}</h2>
        <p className="card-desc">{props.description}</p>
        <span className="card-current">{cardCurrent}h</span>
        <span className="card-limit">{props.limit}</span>

        <Timer getCardId={props.getCardId} getTimeFromTimer={getTime} timerActive={props.timerActive}
          handleTimerActive={handleTimerActive} cardLimit={props.limit}
        />
      </div>
    )
}

export function Cards() {
    const [cardList, addToCardList] = useState([]);
    // Get values from contextprovider (from project)
    const { selectedProject } = useContext(SelectedProjectContext);
    const { setSumCardsCurrent } = useContext(SumCardsCurrentTimesContext);
    const [selectedCategory, setCategory] = useState("All");
    const [modal, openModal] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardDesc, setCardDesc] = useState("");
    const [cardLimit, setCardLimit] = useState(0);
    const [filterCards, setFilterCards] = useState("All");

    if(selectedProject) {
      console.log(selectedProject);
    }

    useEffect(() => {
      sumCardCurrentTimes();
    })

    function sumCardCurrentTimes() {
        if(selectedProject) {
          if (cardList.length > 0) {
            let sumCurrents = 0;
              cardList.map((card) => {
                  if(selectedProject == card.projectId) {
                    // Convert card current from string to float and add with sumCurrents
                    // toFixed return given digits after decimal point
                    sumCurrents = +(sumCurrents + parseFloat(card.current)).toFixed(12);
                  }
                })
            setSumCardsCurrent(sumCurrents);
            }
        }
      }

    // Gets values from child Card and updates the current time of the selected Card
    function updateCardCurrent(selectedCardCurrent, selectedCardId) {
        if(cardList) {
            cardList.map((card) => {
                if(card.id == selectedCardId) {
                  if(selectedCardCurrent > 0) {
                      card.current = selectedCardCurrent;
                    } else if (selectedCardCurrent == 0) {
                        card.current = 0;
                      }
                  }
              })
          }
      }

    function handleTimerActive(setTimerActive, selectedCardId) {
      if(cardList) {
          if(setTimerActive == true) {
              cardList.map((card) => {
                  if(card.id == selectedCardId) {
                      card.timerActive = true;
                    }
                })
            } else if(setTimerActive == false) {
                cardList.map((card) => {
                    if(card.id == selectedCardId) {
                        card.timerActive = false;
                      }
                  })
              }
        }
      }

    // Add, add-card button to titlebar (for fixed positioning)
    const addCardBtn = document.querySelectorAll('.add-card')[0];
    const titleBar = document.querySelectorAll('.titlebar')[0];
    if (addCardBtn) {
        if(titleBar) {
            titleBar.appendChild(addCardBtn);
          }
      }

    function openCreateCardModal() {
        try {
            openModal(true);
        } catch (e) {
            console.error(e);
        }
    }

    function closeModal() {
        if (openModal) {
          try {
            openModal(false);
            } catch(e) {
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
            createdAt: moment().format('l, LT')
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


    return (
        <>
            <button onClick={() => {selectedProject ? openCreateCardModal() : alert('create project first')}}
            className={`${selectedProject? "" : "disabled"} add-card`}>
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
                        <select value={filterCards} onChange={(e) => setFilterCards(e.target.value)} name="category" className="filtered-category">
                            <option value="All"> All</option>
                            <option value="Feature"> Feature</option>
                            <option value="Task"> Task</option>
                            <option value="Bug"> Bug</option>
                        </select>
                </div>
              <div className='cards'>
                    {
                        filterCards &&
                        cardList &&
                        cardList.map((card) => {
                            if (card.projectId == selectedProject) {
                                return (<CardWithTimer
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
                                    />
                                )
                              }
                          })
                    }
            </div>
        </>
    )
}
