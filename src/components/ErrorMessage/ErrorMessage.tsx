import React from "react";
import "./error-message.scss";

export function ErrorMessage(message: string) {
    let div = document.createElement('div');
    div.classList.add('error-message');
    let errorMessage = document.createTextNode(message);
    div.appendChild(errorMessage);
    document.body.appendChild(div)
}