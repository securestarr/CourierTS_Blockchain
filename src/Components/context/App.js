// src/index.js or src/App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MetaMaskProvider } from './context/MetaMaskContext'; // Correct path

ReactDOM.render(
  <MetaMaskProvider>
    <App />
  </MetaMaskProvider>,
  document.getElementById('root')
);
