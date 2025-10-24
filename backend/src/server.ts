import app from './app.js';
import { createServer } from 'node:http';
import { config } from './config/index.js';
import {Server} from "socket.io";
import registerChatEvents from './events/chat.events.js';

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }  // allow cross-origin for dev
});

// Register chat events
registerChatEvents(io);

try {
  server.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
  });
} catch (err) {
  console.error('🔥 Server failed to start:', err);
  process.exit(1);
}
