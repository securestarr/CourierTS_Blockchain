// src/Components/context/MetaMaskContext.js
import React, { createContext, useState } from 'react';

export const MetaMaskContext = createContext();

export const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        setAccount(accounts[0]);
        setNetwork({
          name: getNetworkName(chainId),
          chainId,
        });
      } catch (error) {
        console.error('MetaMask connection failed:', error);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '0x1':
        return 'Mainnet';
      case '0x3':
        return 'Ropsten';
      case '0x4':
        return 'Rinkeby';
      case '0x5':
        return 'Goerli';
      case '0x2a':
        return 'Kovan';
      default:
        return 'Unknown Network';
    }
  };

  return (
    <MetaMaskContext.Provider value={{ account, network, connectMetaMask }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
