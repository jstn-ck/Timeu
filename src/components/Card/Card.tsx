import React, { useContext, useEffect, useState } from "react";
import "./card.scss";
import "@/components/Projects/projects.scss";
import { SelectedProjectContext } from "@/views/Dashboard/Dashboard";
import { generateUid } from '@/helpers/uid';
import moment from "moment";

export function Cards() {
    const [cardList, addToCardList]: any = useState([]);
    // Get values from contextprovider (from project)
    const { selectedProject } = useContext(SelectedProjectContext);
    const [selectedCategory, setCategory] = useState("");
    const [modal, openModal] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardDesc, setCardDesc] = useState("");
    const [cardLimit, setCardLimit] = useState(0);

    // useEffect(() => {
    //   // Renders component only if specified variables changes
    // }, [selectedProject, cardList])

    if(selectedProject) {
        console.log(selectedProject);
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
            openModal(false);
        }
    }

    function createCard() {
        const cardItem = [{
            projectId: selectedProject,
            name: cardName,
            limit: cardLimit,
            desc: cardDesc,
            category: selectedCategory,
            id: generateUid(),
            createdAt: moment().format('MM.Do.YY, h:mm')
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
            <button onClick={() => {selectedProject ? openCreateCardModal() : alert('create project first')}} className={`${selectedProject? "" : "disabled"} add-card`}>New Card</button>
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
                            maxLength={20}
                            value={cardDesc}
                            onChange={(e) => setCardDesc(e.target.value)}
                            placeholder="Enter Card description"
                        />
                        <h3>Select a category</h3>
                        <select value={selectedCategory} onChange={(e) => setCategory(e.target.value)} name="category" className="category-select">
                            <option value="">--Category--</option>
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
            <div className='cards'>
                {
                    cardList.map((card: any) => {
                        if (card.projectId == selectedProject) {
                            return (
                            <div key={card.id} className="card-container">
                                <h1>{card.name}</h1>
                            </div>
                            )
                          }
                      })
                }
            </div>
        </>
    )
}
