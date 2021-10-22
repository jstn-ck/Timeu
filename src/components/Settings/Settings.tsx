import './settings.scss';
import { settingItems } from './settingItems';
import React, { useState, useEffect } from 'react';
import jetpack from 'fs-jetpack';
import { ipcRenderer } from 'electron';
import { FSJetpack } from "fs-jetpack/types";


type SettingsMenuState = any

class SettingsMenu extends React.Component<{}, SettingsMenuState> {
  pathToUserSettings: any;
  menuClassName: string;
  settingItems: Array<object>;
  userSettingsObject: any;

  constructor(props: any) {
    super(props);

    this.pathToUserSettings = "";
    this.userSettingsObject = {};
    this.menuClassName = props.visibility ? "settings-menu active" : "settings-menu";
    this.settingItems = props.items;

    this.state = {
      darkMode: this.userSettingsObject.darkMode,
    };
  }

  componentDidMount() {
    this.initIpc();
  }

  async readFromSettings() {
    const spath = this.pathToUserSettings;

    if (spath.read('user-preferences.json', 'json') !== undefined) {
      this.userSettingsObject = spath.read('user-preferences.json', 'json');
      console.log('user settings exists');

      // Only set state if not matching with file
      if (this.state !== this.userSettingsObject) {
        this.setState(this.userSettingsObject);
      }

      this.applySettingsOnStartup();

    } else {
      console.log('user-settings doesnt exist creating');
      const defaultSettings = {
        darkMode: true,
      };

      this.setState(defaultSettings);
      await spath.writeAsync("user-preferences.json", defaultSettings).then(() => {
        this.userSettingsObject = spath.read('user-preferences.json', 'json');
      });
    }
  }

  // Send ping to main process and get app's userData path
  async initIpc() {
    ipcRenderer.on('response', (event, value) => {
      // console.log(`Renderer received ${value}.`);
      this.pathToUserSettings = jetpack.cwd(value);
      this.readFromSettings();
    });

    ipcRenderer.send('get-settings-path', 'ping');
  }

  applySettingsOnStartup() {
    if (this.userSettingsObject.darkMode) {
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "dark");
    } else {
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "light");
    }
  }


  // Settings Functions -------------------------
  toggleDarkMode() {
    const dM = this.userSettingsObject.darkMode;
    const dMwriteTrue = this.pathToUserSettings.write('user-preferences.json', { darkMode: true });
    const dMwriteFalse = this.pathToUserSettings.write('user-preferences.json', { darkMode: false });

    if (this.state.darkMode) {
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "light");
      console.log('state is true theme to light');
      if (dM == true) {
        dMwriteFalse;
        this.setState({ darkMode: false });
      } else if (dM == false || dM == undefined) {
        dMwriteTrue;
        this.setState({ darkMode: true });
        this.pathToUserSettings.write('user-preferences.json', { darkMode: true });
      }
    } else {
      console.log('state is false theme to dark');
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "dark");

      dMwriteTrue;
      this.setState({ darkMode: true });
    }
  }
  // end Settings Functions -------------------------


  switchSettingFunctions(fn: string) {
    switch (fn) {
      case "toggleDarkMode": {
        this.toggleDarkMode();
        break;
      }
      case "testfn": {
        console.log('testfn');
        break;
      }
    }
  }


  render() {
    // item: any because unknown type
    const mapSettingItems = settingItems.map((item: any) =>
      <li className="settings-item" onClick={() => this.switchSettingFunctions(item.settingFunction)}>
        <a href="#" >{item.settingName}</a>
      </li>
    );

    return (
      <div className={this.menuClassName}>
        {/* Toggle button looks like small dot scaling in */}
        <ul className="settings-list">{mapSettingItems}</ul>
      </div>
    )
  }
}

export default function Settings() {
  const [active, setActive] = useState<boolean>(false);

  function toggleMenu(): void {
    setActive(!active);
  }

  return (
    <div className="settings">
      {/* Button component with icon prop ? */}
      <button onClick={toggleMenu}>Press</button>
      <SettingsMenu
        {...settingItems}
        {...active}
      />
    </div>
  )
}
