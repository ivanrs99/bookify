import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";

const Search = ({ navigation }) => {
  return (
    <View style={styles.center}>
      <Text>This is the Search screen</Text>
      <Button
        title="Go to chat Screen"
        onPress={() => navigation.push('Profile', { email: 'ivanrs99@hot' })}
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
export default Search;