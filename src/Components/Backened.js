const express = require('express');
const app = express();

// Sample route to get product details
app.get('/products', (req, res) => {
  // Fetch products from the database or blockchain
  res.json(products);
});

// Sample route to update product status
app.post('/update-status', (req, res) => {
  const { productId, status } = req.body;
  // Update product status in the blockchain and database
  res.status(200).send('Status updated successfully');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
