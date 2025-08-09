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

## Backend Build Order for a Scalable Dating App

### 1. `config/`
- **Files**: `database.ts`, `redis.ts`, `jwt.ts`, `index.ts`  
- **Purpose**: Set up Prisma connection, Redis client, JWT secret handling.

### 2. `constants/`
- **Files**: `error-codes.ts`, `messages.ts`, `app.constants.ts`  
- **Purpose**: Centralize static config values and messages.

### 3. `exceptions/`
- **Files**: `base.exception.ts`, `validation.exception.ts`, `not-found.exception.ts`  
- **Purpose**: Custom error handling classes.

### 4. `types/`
- **Files**: All type definition files  
- **Purpose**: Ensure consistent data contracts across layers.

### 5. `entities/`
- **Files**: `user.entity.ts`, `profile.entity.ts`, etc.  
- **Purpose**: Domain entities/models that match your Prisma schema but are decoupled from the ORM.

### 6. `dto/`
- **Files**: All DTOs for each feature  
- **Purpose**: Input/output contracts for validation and shaping responses.

### 7. `utils/`
- **Files**: `crypto.util.ts`, `logger.util.ts`, etc.  
- **Purpose**: Helper utilities.

### 8. `repositories/`
- **Files**: `base.repository.ts` first, then feature-specific repositories  
- **Purpose**: Direct Prisma calls and persistence logic.

### 9. `services/`
- **Files**: `auth.service.ts`, `user.service.ts`, etc.  
- **Purpose**: Core business logic per feature.

### 10. `events/`
- **Files**: `event-emitter.ts` and domain-specific events  
- **Purpose**: Event-emitter setup and handling.

### 11. `jobs/`
- **Files**: `match-suggestions.job.ts`, etc.  
- **Purpose**: Background tasks.

### 12. `middleware/`
- **Files**: Global and feature-specific middlewares  
- **Purpose**: Request preprocessing, authentication, rate-limiting, etc.

### 13. `decorators/`
- **Files**: Custom decorators for validation/auth  
- **Purpose**: Declarative validation and authentication rules.

### 14. `controllers/`
- **Files**: HTTP controllers for each feature  
- **Purpose**: Handle HTTP requests and responses.

### 15. `routes/`
- **Files**: Define and export API endpoints  
- **Purpose**: Map endpoints to controllers.

### 16. `app.ts`
- **Purpose**: Bring everything together, register middlewares, routes, and error handling.

---

## Bottom-Up Development Approach

1. **Foundations**: `config/`, `constants/`, `exceptions/`, `types/`
2. **Domain Structures**: `entities/`, `dto/`
3. **Data Layer**: `repositories/`
4. **Business Logic**: `services/`
5. **Delivery Layer**: `controllers/`, `routes/`
