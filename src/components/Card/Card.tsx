import React, { useContext, useEffect, useState } from "react";
import "./card.scss";
import { SelectedProjectContext } from "@/views/Dashboard/Dashboard";
import { nanoid } from "nanoid";
import moment from "moment";

export function Cards() {
    const [cardList, addToCardList]: any = useState([]);
    const { selectedProject } = useContext(SelectedProjectContext);
    const [selectedCategory, setCategory] = useState("");
    const [modal, openModal] = useState(false);
    const [cardName, setCardName] = useState("");
    const [cardDesc, setCardDesc] = useState("");
    const [cardLimit, setCardLimit] = useState(0);

    if (selectedProject) {
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
            project: selectedProject,
            name: cardName,
            limit: cardLimit,
            desc: cardDesc,
            category: selectedCategory,
            id: nanoid(),
            createdAt: moment().format('MM Do  YY, h:mm')
        }]

        if (cardName !== "") {
            const newCard = cardList.concat(cardItem);
            addToCardList(newCard);

            closeModal();
        } else {
            alert("Project name cant be empty");
        }
    }

    return (
        <>
            <button onClick={openCreateCardModal} className='add-card'>New</button>
            <div className={`modal new-card-modal ${modal ? 'open' : ''}`}>
                {/* modal content for fade-in scale-in animation to work */}
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
                    cardList &&
                    cardList.map((card: any, index: any) => (
                        <div key={card.id} className="card-container">
                            <h1>{card.name}</h1>
                        </div>
                    ))
                }
            </div>
        </>
    )
}