import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

const ChatList = ({ navigation }) => {
  return (
    <View style={styles.center}>
      <Text>This is the chats screen</Text>
      <Button
        title="Go to chat Screen"
        onPress={() => navigation.navigate("Chat")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default ChatList;