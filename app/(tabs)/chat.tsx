import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import socketService, { Message } from '@/services/socketService';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const initialMessages: Message[] = [
  { id: '1', text: 'Hello! Welcome to Perlme chat!', sender: 'System', timestamp: new Date().toISOString(), isOwnMessage: false },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Connect to socket server
    socketService.connect('You'); // You can make this dynamic based on user login

    // Set up event listeners
    socketService.onConnect(() => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    socketService.onDisconnect(() => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    socketService.onMessage((message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketService.onUserJoined((user) => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: `${user.name} joined the chat`,
        sender: 'System',
        timestamp: new Date().toISOString(),
        isOwnMessage: false
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    socketService.onUserLeft((user) => {
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: `${user.name} left the chat`,
        sender: 'System',
        timestamp: new Date().toISOString(),
        isOwnMessage: false
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    socketService.onUserTyping((data) => {
      setIsTyping(data.isTyping);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSend = (text: string) => {
    if (!isConnected) {
      Alert.alert('Connection Error', 'Not connected to server. Please check your connection.');
      return;
    }

    // Add message to local state immediately for better UX
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'You',
      timestamp: new Date().toISOString(),
      isOwnMessage: true
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Send to server
    socketService.sendMessage(text);
  };

  const handleTyping = (isTyping: boolean) => {
    socketService.sendTypingIndicator(isTyping);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      text={item.text}
      sender={item.sender}
      isOwnMessage={item.isOwnMessage}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Connection Status */}
      <View style={[styles.statusBar, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]}>
        <Text style={styles.statusText}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Text>
        {isTyping && (
          <Text style={styles.typingText}>Someone is typing...</Text>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      <View style={styles.inputContainer}>
        <ChatInput onSend={handleSend} onTyping={handleTyping} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusBar: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  typingText: {
    color: 'white',
    fontSize: 12,
    fontStyle: 'italic',
  },
  messages: {
    padding: 12,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
}); 