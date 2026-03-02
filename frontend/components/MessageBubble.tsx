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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[styles.container, isOwnMessage ? styles.own : styles.other]}>
      {!isOwnMessage && !!sender && <Text style={styles.sender}>{sender}</Text>}
      <Text style={[styles.text, isOwnMessage && styles.ownText]}>{text}</Text>
      <Text style={[styles.time, isOwnMessage && styles.ownTime]}>
        {formatTime(timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 18,
  },
  own: {
    backgroundColor: '#ff3366',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    shadowColor: '#ff3366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  other: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#f3e8ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sender: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8e44ad',
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 20,
  },
  ownText: {
    color: '#fff',
  },
  time: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
  },
});

export default MessageBubble; 