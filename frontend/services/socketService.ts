import { io, Socket } from 'socket.io-client';
import { SOCKET_SERVER_URL } from '../src/utils/config';
import { expoLogger as logger } from "@/src/utils/logger";

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
  private readonly serverUrl: string = SOCKET_SERVER_URL;

  connect(token: string) {
    if (this.socket?.connected || !token) {
      return;
    }

    this.socket = io(this.serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      logger.info('Connected to server');
    });

    this.socket.on('disconnect', () => {
      logger.info('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      logger.error('Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitTyping(receiverId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('typing', { receiverId });
  }

  emitStopTyping(receiverId: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('stop_typing', { receiverId });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
      return;
    }
    this.socket.off(event);
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService; 
