import {Component} from "react";
import ReactDOM from "react-dom";
import { auth, db } from "@/firebase/firebase";
import "./settings.scss";

export default class SettingsWindow extends Component {
  constructor(props) {
    super(props);
  }
  settContainer = document.createElement('div');
  logoutContainer = document.createElement('button');

  // reference of the window
  externalWindow = null;

  componentDidMount() {
    let externalWindow = window.open('', 'Preferences ');

    if (externalWindow) {
      this.logoutContainer.classList.add('logout');
      this.settContainer.classList.add("settings-container");
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
    // this.props.children -> append children in component
    return ReactDOM.createPortal(this.props.children, this.settContainer);
  }
}
