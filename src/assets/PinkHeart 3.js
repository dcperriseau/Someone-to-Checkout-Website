import React from 'react';

const Icon = ({ top, left, color, size }) => (
  <svg
    className={`absolute ${color} fill-current`}
    style={{ top: `${top}px`, left: `${left}px`, width: `${size}px`, height: `${size}px` }}
    viewBox="0 0 512 512"
  >
    <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
  </svg>
);

Icon.defaultProps = {
  top: 0,
  left: 0,
  color: 'text-customPink',
  size: 20,
};

export default Icon;
