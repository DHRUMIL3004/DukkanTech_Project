import React from 'react';
import './Loader.css';

const Loader = ({ message = "Loading...", size = "medium", overlay = false }) => {
  const loaderClass = `loader ${size} ${overlay ? 'overlay' : ''}`;

  if (overlay) {
    return (
      <div className="loader-overlay">
        <div className={loaderClass}>
          <div className="loader-spinner"></div>
          <p className="loader-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={loaderClass}>
      <div className="loader-spinner"></div>
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;