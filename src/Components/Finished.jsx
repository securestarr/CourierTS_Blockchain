import React from "react";
import { CheckCircle, MapPin } from "lucide-react";

const Finished = (props) => {
  return (
    <div style={{ background: "#f9f9f9", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <CheckCircle size={64} style={{ color: "#4caf50", marginBottom: "10px" }} />
        <h1>Product Journey Summary</h1>
      </div>

      <div style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "10px" }}>Product Details</h2>
        <p><strong>Product ID:</strong> {props.product.id}</p>
        <p><strong>Name:</strong> {props.product.name}</p>
        <p><strong>Current Status:</strong> {props.product.status}</p>
        <p><strong>Owner:</strong> {props.product.owner}</p>

        <h2 style={{ marginTop: "20px", marginBottom: "10px" }}>Journey</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {props.journey.map((step, index) => (
            <li
              key={index}
              style={{
                padding: "10px",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              <MapPin size={16} style={{ marginRight: "5px", verticalAlign: "middle" }} />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Finished;
