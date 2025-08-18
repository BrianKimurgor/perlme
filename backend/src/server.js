import app from './app.js';
import { config } from './config/index.js';

try {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
  });
} catch (err) {
  console.error('🔥 Server failed to start:', err);
  process.exit(1);
}
