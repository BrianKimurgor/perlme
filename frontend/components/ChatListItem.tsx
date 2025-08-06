import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChatListItemProps {
  name: string;
  lastMessage: string;
  time: string;
  onPress: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ name, lastMessage, time, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>{lastMessage}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  lastMessage: {
    color: '#555',
    fontSize: 14,
  },
  time: {
    color: '#999',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default ChatListItem; 