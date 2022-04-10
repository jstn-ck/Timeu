import './settings.scss';
import { settingItems } from './settingItems';
import React from 'react';
import * as jetpack from 'fs-jetpack';
import { ipcRenderer } from 'electron';
import { FSJetpack } from "fs-jetpack/types";
import { useState } from 'react';
import SettingsWindow from "@/components/Settings/SettingsWindow";
import SIcon from '@/components/Icons/SettingsIcon';
import Connectivity from '@/components/Connectivity/Connectivity';

// interface ISettingsItems {
//   settingName: string
//   settingFunction: string
// }

type SettingProps = {
  items: Array<object>,
}

type SettingState = {
  default: string,
}

interface ISettingsObject {
  darkMode: boolean,
}

class SettingsMenu extends React.Component<SettingProps, SettingState> {
  settingItems: Array<object>;
  pathToUserSettings: string | FSJetpack | any;
  userSettingsObject: ISettingsObject;
  defaultSettings: ISettingsObject;

  constructor(props: SettingProps) {
    super(props);

    this.pathToUserSettings = "";
    this.settingItems = props.items;

    this.defaultSettings = {
      darkMode: true,
    }

    this.userSettingsObject = this.defaultSettings;

    this.state = {
      default: "default",
    }
  }

  componentDidMount() {
    this.initIpc();
  }

  initIpc() {
    // Rewrite because of possible memory leak
    ipcRenderer.on("response", (event, value) => {
      // console.log(`Renderer received ${value}.`);
      this.pathToUserSettings = jetpack.cwd(value);
      this.readFromSettings();
    })

    ipcRenderer.send('get-settings-path', 'ping');
  }

  async applySettingsOnStartup(): Promise<void> {
    const settingsObject = this.pathToUserSettings.read("user-preferences.json", "json");

    if (await settingsObject.darkMode === true) {
      try {
        document
          .getElementsByTagName("HTML")[0]
          .setAttribute("data-theme", "dark");
      } catch (err) {
        console.log('Cannot set data-theme: ' + err);
      }
    } else if (await settingsObject.darkMode === false) {
      try {
        document
          .getElementsByTagName("HTML")[0]
          .setAttribute("data-theme", "light");
      } catch (err) {
        console.log('Cannot set data-theme: ' + err);
      }

    } else {
      console.log('settings object in applySettings is undefined');
    }
  }

  async readFromSettings(): Promise<void> {
    const settingsPath = this.pathToUserSettings;
    if (this.pathToUserSettings.read("user-preferences.json", "json") !== undefined) {
      this.userSettingsObject = await settingsPath.readAsync("user-preferences.json", "json");
      this.applySettingsOnStartup();
      console.log('user settings exist');
    } else {
      console.log('user settings does not exist.. creating');

      try {
        await settingsPath.writeAsync("user-preferences.json", this.defaultSettings);
        this.userSettingsObject = settingsPath.read("user-preferences.json", "json");
      } catch (err) {
        console.log("Could not write to settings file: " + err);
      }
    }
  }

  // Settings Functions
  async toggleDarkMode() {
    try {
      this.userSettingsObject = await this.pathToUserSettings.readAsync('user-preferences.json', 'json');
    } catch (err) {
      console.log(err);
    }

    let dM = this.userSettingsObject.darkMode;

    if (dM === true) {
      await this.pathToUserSettings.writeAsync('user-preferences.json', { darkMode: false });
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "light");
    } else if (dM === false) {
      await this.pathToUserSettings.writeAsync('user-preferences.json', { darkMode: true });
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", "dark");
    } else {
      console.log('cannot toggle dark mode, settings object doesnt exist');
    }
  }
  // end Settings Functions

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
    // What is the type of item? ..
    const mappedSettingItems = this.settingItems.map((item: any, index) =>
      <li className="settings-menu-item" key={index} onClick={() => this.switchSettingFunctions(item.settingFunction)}>
        <span className="settings-menu-item-name">{item.settingName}</span>
      </li>
    );

    return (
      <div className="settings-menu">
        {/* Toggle button looks like small dot scaling in */}
        <ul className="settings-list">{mappedSettingItems}</ul>
      </div>
    )
  }
}


export default function Settings(): JSX.Element {
  const [settWin, openSettWin] = useState(false);
  const menu = document.querySelectorAll('.settings-menu')[0];

  function toggleMenu() {
    try {
      openSettWin(true);
      if(menu) {
        // Casual checks if element even exists (good practice to not get undefined errors)
        document.querySelectorAll('.settings-menu')[0].classList.toggle('open');
      }
    } catch (err) {
      // Rename from console.log to .error für Doku (error handling)
      console.error(err);
    }
  }

  if(settWin) {
    return (
      <div className="settings">
        <button onClick={toggleMenu} className="button-icon">
          <SIcon />
        </button>
        <SettingsWindow onClose={() => { openSettWin(false); } }>
        <SettingsMenu
            items={settingItems} />
        <Connectivity />
        </SettingsWindow>
      </div>
    )
  }

  return (
    <div className="settings">
      <button onClick={toggleMenu} className="button-icon">
        <SIcon />
      </button>
    </div>
  )
}

