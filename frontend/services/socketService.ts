import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  text: string;
  sender: string;
  senderId?: string;
  timestamp: string;
  isOwnMessage: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string = 'http://localhost:3001'; // Change this for production

  // Event callbacks
  private onMessageCallback?: (message: Message) => void;
  private onUserJoinedCallback?: (user: User) => void;
  private onUserLeftCallback?: (user: User) => void;
  private onUserTypingCallback?: (data: { userId: string; userName: string; isTyping: boolean }) => void;
  private onConnectCallback?: () => void;
  private onDisconnectCallback?: () => void;

  connect(userName: string, avatar?: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket?.emit('join', { name: userName, avatar });
      this.onConnectCallback?.();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.onDisconnectCallback?.();
    });

    this.socket.on('messages', (messages: Message[]) => {
      console.log('Received messages:', messages);
    });

    this.socket.on('newMessage', (message: Message) => {
      console.log('New message received:', message);
      this.onMessageCallback?.(message);
    });

    this.socket.on('userJoined', (user: User) => {
      console.log('User joined:', user);
      this.onUserJoinedCallback?.(user);
    });

    this.socket.on('userLeft', (user: User) => {
      console.log('User left:', user);
      this.onUserLeftCallback?.(user);
    });

    this.socket.on('userTyping', (data) => {
      console.log('User typing:', data);
      this.onUserTypingCallback?.(data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(text: string) {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', { text });
    } else {
      console.warn('Socket not connected');
    }
  }

  sendTypingIndicator(isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('typing', isTyping);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listeners
  onMessage(callback: (message: Message) => void) {
    this.onMessageCallback = callback;
  }

  onUserJoined(callback: (user: User) => void) {
    this.onUserJoinedCallback = callback;
  }

  onUserLeft(callback: (user: User) => void) {
    this.onUserLeftCallback = callback;
  }

  onUserTyping(callback: (data: { userId: string; userName: string; isTyping: boolean }) => void) {
    this.onUserTypingCallback = callback;
  }

  onConnect(callback: () => void) {
    this.onConnectCallback = callback;
  }

  onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService; 