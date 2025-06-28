# Perlme Backend

Real-time chat backend server for the Perlme React Native app.

## Features

- Real-time messaging with Socket.IO
- User presence tracking
- Typing indicators
- REST API endpoints
- CORS enabled for cross-origin requests

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

- `GET /api/health` - Server health check
- `GET /api/users` - Get connected users
- `GET /api/messages` - Get all messages

## Socket.IO Events

### Client to Server:
- `join` - Join chat room with user data
- `sendMessage` - Send a new message
- `typing` - Send typing indicator

### Server to Client:
- `messages` - Receive all existing messages
- `newMessage` - Receive a new message
- `userJoined` - User joined notification
- `userLeft` - User left notification
- `userTyping` - Typing indicator from other users

## Development

The server runs on port 3001 by default. You can change this in the `.env` file.

## Production Deployment

For production, consider:
- Adding authentication
- Using a database (MongoDB, PostgreSQL)
- Setting up proper CORS origins
- Adding rate limiting
- Using HTTPS
- Setting up environment variables properly 