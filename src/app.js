const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'checkout-service',
    timestamp: new Date().toISOString()
  });
});

// Simple checkout endpoint
app.post('/checkout', (req, res) => {
  const { cartId, amount } = req.body;
  
  if (!cartId || !amount) {
    return res.status(400).json({
      error: 'Missing cartId or amount'
    });
  }

  res.status(200).json({
    transactionId: `TXN-${Date.now()}`,
    cartId: cartId,
    amount: amount,
    status: 'completed',
    timestamp: new Date().toISOString()
  });
});

// Service info endpoint
app.get('/info', (req, res) => {
  res.status(200).json({
    service: 'checkout-service',
    version: '1.0.0',
    environment: process.env.ENVIRONMENT || 'unknown',
    deployment: process.env.DEPLOYMENT_ID || 'unknown'
  });
});

app.listen(PORT, () => {
  console.log(`Checkout Service listening on port ${PORT}`);
  console.log(`Environment: ${process.env.ENVIRONMENT || 'unknown'}`);
});
