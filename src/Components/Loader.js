import React from 'react';
import './Loader.css'; // Define styles for the loading spinner

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
