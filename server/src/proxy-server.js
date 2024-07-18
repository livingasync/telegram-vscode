const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware per rimuovere l'intestazione X-Frame-Options
app.use((req, res, next) => {
  res.removeHeader('X-Frame-Options');
  next();
});

app.use('/', createProxyMiddleware({
  target: 'https://web.telegram.org/k/',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${proxyReq.path}`);
    proxyReq.setHeader('origin', 'https://web.telegram.org');
  },
  onProxyRes: (proxyRes, req, res) => {
    delete proxyRes.headers['x-frame-options'];
    console.log('Response headers:', proxyRes.headers);
  },
  logLevel: 'debug'
}));

app.listen(3000, () => {
  console.log('Proxy server is running on http://localhost:3000');
});
