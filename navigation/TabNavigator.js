import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChatStackNavigator, HomeStackNavigator, SearchStackNavigator, ProfileStackNavigator, AddReviewStackNavigator } from "./StackNavigator";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const tabScreenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
        } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
        } else if (route.name === 'Add') {
            return (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 13,
                        height: 45,
                        width: 45,
                        borderRadius: 58,
                        backgroundColor: 'tomato',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Ionicons name='add-outline' size={size} color='white' />
                </View>
            );
        }
        return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarLabel: () => null,
})

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={tabScreenOptions}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Add" component={AddReviewStackNavigator}
                options={() => {
                    let tabBarVisible = false;
                    return { tabBarVisible };
                }} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} />
            {/*<Tab.Screen name="Search" component={SearchStackNavigator} />
            <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ tabBarBadge: 3 }} /> */}
        </Tab.Navigator>
    );
};
export default BottomTabNavigator;