import React from 'react';

const styles = {
  Icon: {
    color: '#bababa',
    fill: '#bababa',
    fontSize: '20px',
    top: '206px',
    left: '1396px',
    width: '20px',
    height: '20px',
  },
};

const IconComponent = () => (
  <svg style={styles.Icon}  viewBox="0 0 192 512">
    <path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z">
    </path>
  </svg>
);

const defaultProps = {
  IconComponent,
};

const Icon = (props) => {
  return (
    props.IconComponent 
      ? <props.IconComponent style={styles.Icon} /> 
      : <defaultProps.IconComponent />
  );
};

export default Icon;