import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

const Chat = ({ navigation }) => {
  return (
    <View style={styles.center}>
      <Text>This is the chat screen</Text>
      <Button
        title="Back"
        onPress={() => navigation.goBack()}
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

export default Chat;