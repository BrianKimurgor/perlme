import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MessageBubbleProps {
  text: string;
  isOwnMessage?: boolean;
  sender?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isOwnMessage = false, sender }) => {
  return (
    <View style={[styles.container, isOwnMessage ? styles.own : styles.other]}>
      {sender && !isOwnMessage && <Text style={styles.sender}>{sender}</Text>}
      <Text style={styles.text}>{text}</Text>
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
  },
  sender: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  text: {
    fontSize: 16,
  },
});

export default MessageBubble; 