import React, { useContext, useEffect, useState } from "react";
import "./card.scss";
import "@/components/Projects/projects.scss";
import { SelectedProjectContext } from "@/views/Dashboard/Dashboard";
import { generateUid } from '@/helpers/uid';
import moment from "moment-with-locales-es6";
import FIcon from '@/components/Icons/FilterIcon';
import formatTime from '@/components/Timer/Timer';
import Timer from '@/components/Timer/Timer';
moment.locale('de');

// Creates the html structure for a Card with a timer
export const CardWithTimer = (props: any) => {
    const [cardCurrent, setCardCurrent] = useState(0);

    const getTime = (val:any) => {
      console.log(val);
        setCardCurrent(val);
        props.getCurrentFromCard(cardCurrent, props.id);
      }


    // Cards get filtered based on class to prevent timer reset
    return (
      <div key={props.id} className={`card-container
      ${props.selectedCategory == props.category ? props.category : ''} ${props.selectedCategory == 'All' ? props.category : ''}`}>
        <span className="card-created-at">{props.createdAt}</span>
        <h3 className="card-category">{props.category}</h3>
        <h2 className="card-name">{props.name}</h2>
        <p className="card-desc">{props.description}</p>
        <span className="card-current">{cardCurrent}</span>
        <span className="card-limit">{props.limit}</span>
        <Timer getCardId={props.getCardId} getTimeFromTimer={getTime} />
      </div>
    )
}

export function Cards() {
    const [cardList, addToCardList]: any = useState([]);
    // Get values from contextprovider (from project)
    const { selectedProject } = useContext(SelectedProjectContext);
    const [selectedCategory, setCategory] = useState("All");
    const [modal, openModal] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardDesc, setCardDesc] = useState("");
    const [cardLimit, setCardLimit] = useState(0);
    const [filterCards, setFilterCards] = useState("All");
    const [cardCurrent, setCardCurrent] = useState(0);

    if(selectedProject) {
        console.log(selectedProject);
      }

    function updateCardCurrent(val1: any, val2: any) {
        console.log(val1,val2);
        if(cardList) {
            cardList.map((card:any) => {
                if(card.id == val2) {
                    card.current = val1;
                  }
              })
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
            console.log(cardList);
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
            current: cardCurrent,
            desc: cardDesc,
            category: selectedCategory,
            id: generateUid(),
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
                        <select value={selectedCategory} onChange={(e) => setCategory(e.target.value)} name="category" className="category-select">
                            <option value="All">All</option>
                            <option value="Feature">Feature</option>
                            <option value="Task">Task</option>
                            <option value="Bug">Bug</option>
                        </select>
                        <h4>Enter a Card time limit in hours (no limit if empty)</h4>
                        <input
                            type="text"
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
                        cardList.map((card: any) => {
                            if (card.projectId == selectedProject) {
                                return (<CardWithTimer
                                    key={card.id}
                                    id={card.id}
                                    name={card.name}
                                    category={card.category}
                                    description={card.desc}
                                    createdAt={card.createdAt}
                                    getCardId={card.id}
                                    selectedCategory={filterCards}
                                    getCurrentFromCard={updateCardCurrent}
                                    />
                                )
                              }
                          })
                    }
            </div>
        </>
    )
}
