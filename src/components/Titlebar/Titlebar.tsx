import './titlebar.scss';
import React from 'react';
import Settings from '@/components/Settings/Settings';

type TitlebarProps = {
  default: string,
}

type TitlebarState = {
  default: string,
}

export default class Titlebar extends React.Component<TitlebarProps, TitlebarState> {
  constructor(props: TitlebarProps) {
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
