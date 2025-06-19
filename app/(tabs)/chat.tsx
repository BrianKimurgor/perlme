import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

const initialMessages = [
  { id: '1', text: 'Hello!', sender: 'Alice', isOwnMessage: false },
  { id: '2', text: 'Hi there!', sender: 'You', isOwnMessage: true },
  { id: '3', text: 'How are you?', sender: 'Alice', isOwnMessage: false },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(initialMessages);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), text, sender: 'You', isOwnMessage: true },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            sender={item.sender}
            isOwnMessage={item.isOwnMessage}
          />
        )}
        contentContainerStyle={styles.messages}
      />
      <View style={styles.inputContainer}>
        <ChatInput onSend={handleSend} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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