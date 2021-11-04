import React from 'react';
import './icon.scss';

interface IProps {
  icon: string,
  size: string,
}

const Icon = (props: IProps) => {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 1024 1024"
    >
      <path
        d={props.icon}
      >
      </path>
    </svg>
  );
};

export default Icon;
