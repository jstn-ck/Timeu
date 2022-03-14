import React from "react";
import "./error-message.scss";

export function ErrorMessage(message: string) {
    let div = document.createElement('div');
    if(!document.querySelectorAll('.error-message')[0]) {
        div.classList.add('error-message');
        let errorMessage = document.createTextNode(message);
        div.appendChild(errorMessage);
        document.querySelectorAll('#root')[0].appendChild(div);
    
        setTimeout(() => {
            div.classList.add('hidden');
        }, 4000)
    
        setTimeout(() => {
            div.remove();
        }, 4400);
    }
}