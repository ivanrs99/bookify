import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import Chat from "../screens/ChatScreen";
import ChatList from "../screens/ChatListScreen";
import Home from "../screens/HomeScreen";
import ReviewForm from '../screens/CreateReviewScreen'
import Search from "../screens/SearchScreen";
import Profile from "../screens/ProfileScreen";
import Login from "../screens/login/LoginScreen";
import Register from "../screens/login/RegisterScreen";
import BottomTabNavigator from "../navigation/TabNavigator";
import firebase from '../database/firebase';

const Stack = createStackNavigator();

const screenOptionStyle = {
  /*headerStyle: {
    backgroundColor: "tomato",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",*/
  headerShown: false,
  animationEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
};

const LogStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}

const ChatStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Chats" component={ChatList} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ReviewForm" component={ReviewForm} options={{tabBarVisible: false}}/>
    </Stack.Navigator>
  );
}

const SearchStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Profile" component={Profile} initialParams={{ email: firebase.auth().currentUser.email }}/>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ReviewForm" component={ReviewForm} options={{tabBarVisible: false}}/>
    </Stack.Navigator>
  );
}

export { ChatStackNavigator, HomeStackNavigator, SearchStackNavigator, ProfileStackNavigator, LogStackNavigator };