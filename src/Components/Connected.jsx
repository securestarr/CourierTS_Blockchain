import React,{useState} from "react";
import { Package, ClipboardCheck, Layers } from "lucide-react";

// Replace with appropriate background if needed
const Connected = (props) => {
  const [products, setProducts] = useState([
      { id: 1, name: 'Product A', status: 'Available', scheduledDelivery: '', actualDelivery: '' },
      { id: 2, name: 'Product B', status: 'Out of Stock', scheduledDelivery: '', actualDelivery: '' },
      { id: 3, name: 'Product C', status: 'Available', scheduledDelivery: '', actualDelivery: '' },
    ]);
  return (
    <div style={{ background: "#f0f0f0", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        <Package size={32} style={{ marginRight: "10px", verticalAlign: "middle" }} />
        Supply Chain Dashboard
      </h1>

      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <h2>Connected Wallet:</h2>
        <p style={{ color: "#4caf50", fontWeight: "bold" }}>{props.account}</p>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ marginBottom: "10px" }}>Available Products</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {products.map((product, index) => (
            <li
              key={index}
              style={{
                margin: "10px 0",
                padding: "15px",
                background: "#fff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
              }}
            >
              <strong>Product ID:</strong> {product.id} <br />
              <strong>Name:</strong> {product.name} <br />
              <strong>Status:</strong> {product.status} <br />
              <strong>Owner:</strong> {product.owner}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={props.fetchProducts}
        style={{
          display: "block",
          margin: "0 auto",
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Refresh Product List
      </button>
    </div>
  );
};

export default Connected;
