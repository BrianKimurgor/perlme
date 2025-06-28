const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const prismaService = require('./prismaService');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // In production, replace with your app's domain
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for active connections (socket.id -> user mapping)
const activeConnections = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', async (userData) => {
    try {
      // Store connection info
      activeConnections.set(socket.id, {
        id: socket.id,
        name: userData.name,
        avatar: userData.avatar || null,
        userId: userData.userId // If user is authenticated
      });
      
      // Send existing messages to new user
      const messages = await prismaService.getMessages(50, 0);
      socket.emit('messages', messages.reverse()); // Reverse to show oldest first
      
      // Notify others that user joined
      socket.broadcast.emit('userJoined', {
        id: socket.id,
        name: userData.name,
        avatar: userData.avatar || null
      });
    } catch (error) {
      console.error('Error handling user join:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Handle new message
  socket.on('sendMessage', async (messageData) => {
    try {
      const connection = activeConnections.get(socket.id);
      if (!connection) return;

      // Create message in database
      const messageRecord = await prismaService.createMessage({
        senderId: connection.userId || 'anonymous', // Use actual user ID if authenticated
        content: messageData.text,
        mediaUrl: messageData.mediaUrl,
        mediaType: messageData.mediaType,
        status: 'SENT'
      });

      // Format message for frontend
      const message = {
        id: messageRecord.id,
        text: messageRecord.content,
        sender: connection.name,
        senderId: socket.id,
        timestamp: messageRecord.createdAt.toISOString(),
        isOwnMessage: false
      };
      
      // Broadcast message to all connected clients
      io.emit('newMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    const connection = activeConnections.get(socket.id);
    if (!connection) return;

    socket.broadcast.emit('userTyping', {
      userId: socket.id,
      userName: connection.name,
      isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const connection = activeConnections.get(socket.id);
    if (connection) {
      activeConnections.delete(socket.id);
      io.emit('userLeft', {
        id: socket.id,
        name: connection.name
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Perlme backend is running' });
});

app.get('/api/users', (req, res) => {
  const userList = Array.from(activeConnections.values());
  res.json(userList);
});

app.get('/api/messages', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const messages = await prismaService.getMessages(parseInt(limit), parseInt(offset));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// User management endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, passwordHash, dateOfBirth } = req.body;
    const user = await prismaService.createUser({
      username,
      email,
      passwordHash,
      dateOfBirth: new Date(dateOfBirth)
    });
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prismaService.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Group management endpoints
app.post('/api/groups', async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await prismaService.createGroup({ name, description });
    res.json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

app.post('/api/groups/:groupId/members', async (req, res) => {
  try {
    const { userId, role = 'MEMBER' } = req.body;
    const member = await prismaService.addUserToGroup(userId, req.params.groupId, role);
    res.json(member);
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ error: 'Failed to add user to group' });
  }
});

// Initialize database connection and start server
async function startServer() {
  try {
    await prismaService.connect();
    
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 Perlme backend server running on port ${PORT}`);
      console.log(`📡 Socket.IO server ready for connections`);
      console.log(`🗄️  Connected to PostgreSQL database`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prismaService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prismaService.disconnect();
  process.exit(0);
});

startServer(); 