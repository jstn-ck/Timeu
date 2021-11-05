import React from 'react';
import './icon.scss';

interface IProps {
  icon: string,
  size: string,
}

const Icon = (props: IProps) => {
  let size: string = '';

  switch (props.size) {
    case 'small': {
      size = '15';
      break;
    }
    case 'medium': {
      size = '25';

      break;
    }
    case 'large': {
      size = '35';
      break;
    }

    default: {
      size = '15';
      break;
    }
  }

  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
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
