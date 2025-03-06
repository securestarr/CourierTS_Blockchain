// src/Components/ProductList.js
import React, { useState, useContext } from 'react';
import { MetaMaskContext } from './context/MetaMaskContext';
import './ProductList.css';

const ProductList = () => {
  const { connectMetaMask, account, network } = useContext(MetaMaskContext);
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', status: 'Available', scheduledDelivery: '', actualDelivery: '' },
    { id: 2, name: 'Product B', status: 'Out of Stock', scheduledDelivery: '', actualDelivery: '' },
    { id: 3, name: 'Product C', status: 'Available', scheduledDelivery: '', actualDelivery: '' },
  ]);

  // Update delivery dates
  const updateDeliveryDate = (productId, newScheduledDate) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? {
            ...product,
            scheduledDelivery: newScheduledDate,
            actualDelivery: new Date(newScheduledDate).toLocaleDateString(),
          }
        : product
    );
    setProducts(updatedProducts);
  };

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <button onClick={connectMetaMask}>
        {account ? 'Connected to MetaMask' : 'Connect MetaMask'}
      </button>
      {account && (
        <div>
          <p>Connected Account: {account}</p>
          {network && <p>Network: {network.name} (Chain ID: {network.chainId})</p>}
        </div>
      )}
      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Status</th>
            <th>Scheduled Delivery</th>
            <th>Actual Delivery</th>
            <th>Update Delivery</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.status}</td>
              <td>{product.scheduledDelivery}</td>
              <td>{product.actualDelivery || '-'}</td>
              <td>
                <input
                  type="date"
                  value={product.scheduledDelivery}
                  onChange={(e) => updateDeliveryDate(product.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
