import React from 'react';

const ProductDetails = ({ product, goBack }) => {
  return (
    <div className="product-details">
      <h2>Product Details</h2>
      <table className="details-table">
        <tbody>
          <tr>
            <td>Product ID:</td>
            <td>{product.id}</td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{product.name}</td>
          </tr>
          <tr>
            <td>Location:</td>
            <td>{product.location}</td>
          </tr>
          <tr>
            <td>Status:</td>
            <td>{product.status}</td>
          </tr>
          <tr>
            <td>Scheduled Delivery:</td>
            <td>{product.deliveryTime}</td>
          </tr>
          <tr>
            <td>Actual Delivery:</td>
            <td>{product.actualDeliveryTime}</td>
          </tr>
          <tr>
            <td>Timestamps:</td>
            <td>
              <ul>
                {product.timestamps.map((timestamp, index) => (
                  <li key={index}>{timestamp}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={goBack} className="btn-back">Back to Product List</button>
    </div>
  );
};

export default ProductDetails;
