import React from 'react';
import './connectivity.scss';

export default function NetStatus() {
  const connected = navigator.onLine ? 'App status: online' : 'App status: offline';
  const netStatus = navigator.onLine ? 'net-status online' : 'net-status offline';

  return (
    <div className={netStatus}>{connected}</div>
  )
}
