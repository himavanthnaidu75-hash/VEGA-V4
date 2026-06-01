const config = {
  // In production (deployed), use the Railway backend
  // In development (localhost), use local backend
  API_URL: import.meta.env.VITE_API_URL || 'https://vega-backend-production-4ecc.up.railway.app',
  WS_URL: import.meta.env.VITE_WS_URL || 'wss://vega-backend-production-4ecc.up.railway.app/ws',
};

export default config;
