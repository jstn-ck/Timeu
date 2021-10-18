import './settings.scss';
import { settingItems } from './settingItems';
import { toggleDarkMode } from './settingFunctions';
import React, { useState } from 'react';

function SettingsMenu(props: any) {
  let menuClassName: string = props.visibility ? "settings-menu active" : "settings-menu";
  const settItems: Array<object> = props.items;
  let [theme, setTheme] = useState('dark');


  function settingFunctions(fn: string): void {
    switch (fn) {
      case "toggleDarkMode": {
        toggleDarkMode(theme);
        break;
      }
      case "testfn": {
        break;
      }
    }
  }
  // item: any because unknown type
  const mapSettItems = settItems.map((item: any) =>
    <li className="settings-item">
      <a href="#" onClick={() => settingFunctions(item.settingFunction)}>{item.settingName}</a>
    </li>
  );

  return (
    <div className={menuClassName}>
      {/* Toggle button looks like small dot scaling in */}
      <ul className="settings-list">{mapSettItems}</ul>
    </div>
  )
}

export default function Settings() {
  let defineSettingItems = settingItems;

  const [active, setActive] = useState<boolean>(false);

  function toggleMenu(): void {
    setActive(!active);
  }

  return (
    <div className="settings">
      {/* Button component with icon prop ? */}
      <button onClick={toggleMenu}>Press</button>
      <SettingsMenu
        items={defineSettingItems}
        visibility={active}
      />
    </div>
  )
}
