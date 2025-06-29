const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

// Create Express server
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for the React app
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
}));

// Logging middleware
app.use(morgan('dev'));

// Setup proxy middleware to MikroTik Router
const mikroTikProxy = createProxyMiddleware({
  target: 'http://192.168.1.1',
  changeOrigin: true, // Changes the origin of the host header to the target URL
  pathRewrite: {
    '^/api': '' // Remove /api prefix when forwarding requests
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request to the router
    console.log(`Proxying ${req.method} request to: ${req.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      error: 'Proxy error connecting to MikroTik router',
      message: err.message
    });
  }
});

// Use the proxy for all requests to /api path
app.use('/api', mikroTikProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Proxy server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Proxying requests to MikroTik router at http://192.168.1.1`);
});

