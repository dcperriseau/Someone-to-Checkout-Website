import React from 'react';

const BackButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="absolute flex items-center text-gray-500">
      &lt; <span className="ml-1">Back</span>
    </button>
  );
};

export default BackButton;
