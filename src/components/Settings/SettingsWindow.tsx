import React from "react";
import {Component} from "react";
import ReactDOM from "react-dom";

type SettWinProps = {
  onClose(): void;
}

export default class SettingsWindow extends Component<SettWinProps> {
  constructor(props: SettWinProps) {
    super(props);
  }
  private settContainer = document.createElement('div');

  // reference of the window
  private externalWindow: null | Window = null;

  componentDidMount() {
    this.externalWindow = window.open('', 'Preferences ');

    if (this.externalWindow) {
      this.externalWindow.document.body.appendChild(this.settContainer);
      this.externalWindow.onunload = () => this.props.onClose();
    }
  }

  render() {
    // !! this.props.children -> append tags in component
    return ReactDOM.createPortal(this.props.children, this.settContainer);
  }
}
