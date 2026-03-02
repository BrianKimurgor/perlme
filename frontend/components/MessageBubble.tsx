import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    sender: string;
    senderId: string;
    timestamp: string;
    isOwnMessage: boolean;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { text, isOwnMessage, sender, timestamp } = message;

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, isOwnMessage ? styles.own : styles.other]}>
      {!isOwnMessage && !!sender && <Text style={styles.sender}>{sender}</Text>}
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{formatTime(timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 12,
  },
  own: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  sender: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff3366',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#111827',
  },
  time: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default MessageBubble; 