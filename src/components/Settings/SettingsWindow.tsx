import React from "react";
import {Component} from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router";
import { auth, db } from "@/firebase/firebase";

type SettWinProps = {
  onClose(): void;
}

export default class SettingsWindow extends Component<SettWinProps> {
  constructor(props: SettWinProps) {
    super(props);
  }
  private settContainer = document.createElement('div');
  private logoutContainer = document.createElement('button');

  // reference of the window
  private externalWindow: null | Window = null;

  componentDidMount() {
    let externalWindow = window.open('', 'Preferences ');

    if (externalWindow) {
      this.logoutContainer.classList.add('logout');
      let logoutText = document.createTextNode('Logout')
      this.logoutContainer.appendChild(logoutText);
      this.settContainer.appendChild(this.logoutContainer);      

      this.logoutContainer.addEventListener('click', async function() {
        // Logout
        externalWindow?.close();
        await auth.signOut();
      })

      externalWindow.document.body.appendChild(this.settContainer);
      externalWindow.onunload = () => this.props.onClose();
    }
  }

  render() {
    // !! this.props.children -> append tags in component
    return ReactDOM.createPortal(this.props.children, this.settContainer);
  }
}
