import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

// Update with your contract's ABI and deployed address
import { contractAbi, contractAddress } from "./Constant/constant";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [newPackageDescription, setNewPackageDescription] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [newPackageStage, setNewPackageStage] = useState("");
  const [newHandlerAddress, setNewHandlerAddress] = useState("");
  const [packageHistory, setPackageHistory] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);
  useEffect(() => {
    if(isConnected){
      fetchProducts();
      fetchPackages();
    }
  }, [isConnected]);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const providerInstance = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(providerInstance);
        await providerInstance.send("eth_requestAccounts", []);
        const signer = providerInstance.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        console.log("Connected to MetaMask:", address);
        fetchProducts();
        fetchPackages();
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  }

  async function fetchProducts() {
    if (!provider) return;
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    try {
      const productList = await contract.getAllProducts();
      setProducts(
        productList.map((p) => ({
          id: p.id.toNumber(),
          name: p.name,
          manufacturer: p.manufacturer,
          currentLocation: p.currentLocation,
        }))
      );
      console.log(products)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  async function fetchPackages() {
    if (!provider) return;
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    try {
      const packageCount = await contract.packageCounter();
      const fetchedPackages = [];

      for (let i = 1; i <= packageCount; i++) {
        const packageData = await contract.packages(i);
        fetchedPackages.push({
          id: packageData.id.toNumber(),
          description: packageData.description,
          currentHandler: packageData.currentHandler,
          stage: getPackageStage(packageData.stage),
          creator: packageData.creator,
          timestamp: new Date(packageData.timestamp.toNumber() * 1000).toLocaleString(),
        });
      }

      setPackages(fetchedPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  }
  
  
  function getPackageStage(stage) {
    switch (stage) {
      case 0:
        return "Created";
      case 1:
        return "In Transit";
      case 2:
        return "Delivered";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  }

  async function createPackage() {
    if (!provider || !newPackageDescription) return;
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractAbi, signer);
    try {
      const tx = await contract.createPackage(newPackageDescription);
      await tx.wait();
      fetchPackages();
      setNewPackageDescription("");
    } catch (error) {
      console.error("Error creating package:", error);
    }
  }
  async function fetchPackageHistory(packageId) {
    if (!provider || !packageId) return;
  
    const contract = new ethers.Contract(contractAddress, contractAbi, provider);
    try {
      const history = await contract.getPackageHistory(parseInt(packageId, 10));
      setPackageHistory(
        history.map((entry) => ({
          handler: entry.handler,
          timestamp: new Date(entry.timestamp.toNumber() * 1000).toLocaleString(),
          stage: getPackageStage(entry.stage),
        }))
      );
    } catch (error) {
      console.error("Error fetching package history:", error);
      setPackageHistory([]);
    }
  }
  
  async function updatePackageStatus() {
    if (
      !provider || 
      !selectedPackageId || 
      !newPackageStage || 
      !newHandlerAddress
    ) {
      return;
    }
  
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
  
    try {
      const stageValue = parseInt(newPackageStage, 10); // Convert stage to integer
      const tx = await contract.updatePackageStatus(
        parseInt(selectedPackageId, 10),
        stageValue,
        newHandlerAddress
      );
      await tx.wait();
      fetchPackages();
      setSelectedPackageId("");
      setNewPackageStage("");
      setNewHandlerAddress("");
    } catch (error) {
      console.error("Error updating package status:", error);
    }
  }
  
  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }
  const styles = {
    app: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    select: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid #e5e7eb',
      fontSize: '0.875rem',
      backgroundColor: 'white',
      width: '100%',
      cursor: 'pointer'
    },
    header: {
      marginBottom: '2rem',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#111827',
      margin: '0'
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    section: {
      width: '100%'
    },
    heading: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
      color: '#111827'
    },
    tableContainer: {
      width: '100%',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      marginBottom: '2rem'
    },
    scrollContainer: {
      overflowX: 'auto',
      overflowY: 'auto',
      maxHeight: '400px'
    },
    table: {
      width: '100%',
      minWidth: '800px',
      borderCollapse: 'collapse'
    },
    thead: {
      backgroundColor: '#f9fafb'
    },
    th: {
      position: 'sticky',
      top: 0,
      backgroundColor: '#f9fafb',
      padding: '0.75rem 1rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#111827'
    },
    td: {
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      color: '#111827',
      borderTop: '1px solid #e5e7eb'
    },
    tdNoWrap: {
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      color: '#111827',
      whiteSpace: 'nowrap',
      borderTop: '1px solid #e5e7eb'
    },
    tr: {
      transition: 'background-color 0.2s'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '500px'
    },
    input: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid #e5e7eb',
      fontSize: '0.875rem'
    },
    formSection: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    }
  };
  const stageOptions = [
    { value: 0, label: 'Created - Initial Stage' },
    { value: 1, label: 'In Transit - Being Shipped' },
    { value: 2, label: 'Delivered - At Destination' },
    { value: 3, label: 'Completed - Final Stage' }
  ];
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>Supply Chain Management</h1>
        {isConnected ? (
          <p style={{ margin: 0 }}>Connected Account: {account}</p>
        ) : (
          <button style={styles.button} onClick={connectToMetamask}>
            Connect to MetaMask
          </button>
        )}
      </header>

      <main style={styles.main}>
        {isConnected && (
          <>
            <section style={styles.section}>
              <h2 style={styles.heading}>Products</h2>
              <div style={styles.tableContainer}>
                <div style={styles.scrollContainer}>
                  <table style={styles.table}>
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Manufacturer</th>
                        <th style={styles.th}>Current Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          style={styles.tr}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={styles.tdNoWrap}>{product.id}</td>
                          <td style={styles.td}>{product.name}</td>
                          <td style={styles.tdNoWrap}>{product.manufacturer}</td>
                          <td style={styles.tdNoWrap}>{product.currentLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.heading}>Packages</h2>
              <div style={styles.tableContainer}>
                <div style={styles.scrollContainer}>
                  <table style={styles.table}>
                    <thead style={styles.thead}>
                      <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Current Handler</th>
                        <th style={styles.th}>Stage</th>
                        <th style={styles.th}>Creator</th>
                        <th style={styles.th}>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr
                          key={pkg.id}
                          style={styles.tr}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={styles.tdNoWrap}>{pkg.id}</td>
                          <td style={styles.td}>{pkg.description}</td>
                          <td style={styles.tdNoWrap}>{pkg.currentHandler}</td>
                          <td style={styles.tdNoWrap}>{pkg.stage}</td>
                          <td style={styles.tdNoWrap}>{pkg.creator}</td>
                          <td style={styles.tdNoWrap}>{pkg.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section style={styles.formSection}>
              <h2 style={styles.heading}>Create New Package</h2>
              <div style={styles.form}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Description"
                  value={newPackageDescription}
                  onChange={(e) => setNewPackageDescription(e.target.value)}
                />
                <button style={styles.button} onClick={createPackage}>
                  Create Package
                </button>
              </div>
            </section>

            <section style={styles.formSection}>
              <h2 style={styles.heading}>Update Package Status</h2>
              <div style={styles.form}>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="Package ID"
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                />
                <select
        style={styles.select}
        value={newPackageStage}
        onChange={(e) => setNewPackageStage(e.target.value)}
      >
        <option value="">Select Stage</option>
        {stageOptions.map((stage) => (
          <option key={stage.value} value={stage.value}>
            {stage.label}
          </option>
        ))}
      </select>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="New Handler Address"
                  value={newHandlerAddress}
                  onChange={(e) => setNewHandlerAddress(e.target.value)}
                />
                <button style={styles.button} onClick={updatePackageStatus}>
                  Update Status
                </button>
              </div>
            </section>
            <section style={styles.section}>
  <h2 style={styles.heading}>Retrieve Package History</h2>

  {/* Input field for Package ID */}
  <div style={{ ...styles.form, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
    <input
      style={styles.input}
      type="number"
      placeholder="Package ID"
      onChange={(e) => fetchPackageHistory(e.target.value)}
    />
  </div>

  {/* Table for displaying package history */}
  <div style={styles.tableContainer}>
    <div style={styles.scrollContainer}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Handler</th>
            <th style={styles.th}>Timestamp</th>
            <th style={styles.th}>Stage</th>
          </tr>
        </thead>
        <tbody>
          {packageHistory.map((entry, index) => (
            <tr
              key={index}
              style={styles.tr}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={styles.tdNoWrap}>{entry.handler}</td>
              <td style={styles.tdNoWrap}>{entry.timestamp}</td>
              <td style={styles.tdNoWrap}>{entry.stage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>


          </>
        )}
      </main>
    </div>
  );
}

export default App;
