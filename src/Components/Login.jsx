import React from "react";
import { Wallet } from "lucide-react";

const Login = (props) => {
  return (
    <div style={{ background: "#e0e0e0", padding: "20px", fontFamily: "Arial, sans-serif", height: "100vh" }}>
      <div
        style={{
          maxWidth: "500px",
          margin: "100px auto",
          textAlign: "center",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Wallet size={64} style={{ color: "#007bff", marginBottom: "20px" }} />
        <h1>Welcome to Supply Chain Manager</h1>
        <p>Secure and transparent supply chain tracking on blockchain</p>
        <button
          onClick={props.connectWallet}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Login;
