import React from "react"
import "./loading-screen.scss"

export function LoadingScreen() {
    return(
      <div className="loading-dashboard">
        <div className="loading-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
}