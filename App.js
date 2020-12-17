import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen } from './LoginScreen';
import { RecordScreen } from './RecordScreen';
import { ChatScreen } from './ChatScreen';
import { CameraScreen } from './CameraScreen';
import { RankingScreen } from './RankingScreen';
import { HomeScreen } from './HomeScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"   
        screenOptions={{
          headerShown: true
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;