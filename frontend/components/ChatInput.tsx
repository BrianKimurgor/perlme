import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

interface ChatInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onTyping }) => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Debounced typing indicator
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping && onTyping) {
        onTyping(false);
        setIsTyping(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [text, isTyping, onTyping]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    
    // Send typing indicator
    if (onTyping && !isTyping && newText.length > 0) {
      setIsTyping(true);
      onTyping(true);
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
      
      // Stop typing indicator
      if (onTyping && isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleTextChange}
        placeholder="Type a message..."
        multiline
        maxLength={500}
      />
      <Button 
        title="Send" 
        onPress={handleSend}
        disabled={!text.trim()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
  },
});

export default ChatInput; 