import './titlebar.scss';
import React from 'react';
import Settings from '@/components/Settings/Settings';
import Projects from '../Projects/Projects';

export default class Titlebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="titlebar">
          <Settings />
      </div>
    )
  }
}
