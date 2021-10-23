import './settings.scss';
import { settingItems } from './settingItems';
import React, { useState, useEffect } from 'react';
import jetpack from 'fs-jetpack';
import { ipcRenderer } from 'electron';
import { FSJetpack } from "fs-jetpack/types";
import settings from 'electron-settings';


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
      default: 'default',
    };
  }

  componentDidMount() {
    this.initIpc();
  }

  async readFromSettings() {
    const spath = this.pathToUserSettings;

    if (spath.read('user-preferences.json', 'json') !== undefined) {
      this.userSettingsObject = await spath.read('user-preferences.json', 'json');
      console.log(this.userSettingsObject);
      this.applySettingsOnStartup();
      console.log('user settings exists');
    } else {
      console.log('user-settings doesnt exist creating');
      const defaultSettings = {
        darkMode: true,
      };

      await spath.writeAsync("user-preferences.json", defaultSettings).then(() => {
        this.userSettingsObject = spath.read('user-preferences.json', 'json');
      });
    }
  }

  // Send ping to main process and get app's userData path
  initIpc() {
    ipcRenderer.on('response', (event, value) => {
      // console.log(`Renderer received ${value}.`);
      this.pathToUserSettings = jetpack.cwd(value);
      this.readFromSettings();
    });

    ipcRenderer.send('get-settings-path', 'ping');
  }


  async applySettingsOnStartup() {
    const settingsObject = this.userSettingsObject;

    if (await settingsObject.darkMode == true) {
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "dark");
    } else if (await settingsObject.darkMode == false) {
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "light");
    } else {
      console.log('settings object in applySettings is undefined');
    }
  }


  // Settings Functions -------------------------
  async toggleDarkMode() {
    const dM = this.userSettingsObject.darkMode;
    console.log(dM);

    if (dM === true) {
      console.log('dark mode in settings is true setting to false');
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "light");
      await this.pathToUserSettings.write('user-preferences.json', { darkMode: false });
    } else if (dM === false) {
      console.log('dark mode is false setting to true');
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "dark");
      await this.pathToUserSettings.write('user-preferences.json', { darkMode: true });
    } else {
      console.log('settings object doesnt exist');
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
