import './titlebar.scss';
import React from 'react';
import Connectivity from '@/components/Connectivity/Connectivity';

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
        <div className="tb-connectivity">
          <Connectivity />
        </div>
      </div>
    )
  }
}
