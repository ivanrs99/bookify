import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LogStackNavigator } from './navigation/StackNavigator';
import { createTheming } from '@callstack/react-theme-provider';
import FlashMessage from "react-native-flash-message";
import global from './components/global'

const App = () => {
  const { ThemeProvider } = createTheming();  

  return (
    <ThemeProvider>
      <StatusBar backgroundColor={global.PRIMARY_COLOR}/>
      <NavigationContainer>
        <LogStackNavigator />        
      </NavigationContainer>
      <FlashMessage position="top" />
    </ThemeProvider>
  )
}

export default App;