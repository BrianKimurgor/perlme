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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#fce4ec',
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 3,
  },
  lastMessage: {
    color: '#6b7280',
    fontSize: 14,
  },
  time: {
    color: '#8e44ad',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ChatListItem; 