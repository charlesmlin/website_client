import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const addHealthEndpoint = (server) => {
  server.middlewares.use('/health', (req, res, next) => {
    if (req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
      );
    } else {
      next();
    }
  });
};

// Handle dev and preview health endpoint, production to be handled by nginx
const healthEndpointPlugin = () => {
  return {
    name: 'health-endpoint',
    configureServer: (server) => addHealthEndpoint(server),
    configurePreviewServer: (server) => addHealthEndpoint(server),
  };
};

export default defineConfig({
  plugins: [react(), healthEndpointPlugin()],
  server: {
    host: true,
    port: 5000,
  },
  preview: {
    host: true,
    port: 5000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
