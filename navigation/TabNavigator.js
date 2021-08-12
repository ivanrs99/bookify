import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChatStackNavigator, HomeStackNavigator, SearchStackNavigator, ProfileStackNavigator } from "./StackNavigator";
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
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
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarLabel: () => null,
        })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator}
                options={({ navigation }) => {
                    const { routes, index } = navigation.dangerouslyGetState();
                    const { state: exploreState } = routes[index];
                    let tabBarVisible = true;
                    if (exploreState) {
                        const { routes: exploreRoutes, index: exploreIndex } = exploreState;
                        const exploreActiveRoute = exploreRoutes[exploreIndex];
                        if (exploreActiveRoute.name === "ReviewForm") tabBarVisible = false;
                    }
                    return {
                        tabBarVisible,
                    };
                }} />
            {/*<Tab.Screen name="Search" component={SearchStackNavigator} />
            <Tab.Screen name="Chat" component={ChatStackNavigator} options={{ tabBarBadge: 3 }} /> */}
            <Tab.Screen name="Profile" component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
};
export default BottomTabNavigator;