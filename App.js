import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SignupScreen } from './SignupScreen'
import { LoginScreen } from './LoginScreen';
import { RecordScreen } from './RecordScreen';
import { ChatScreen } from './ChatScreen';
import { CameraScreen } from './CameraScreen';
import { RankingScreen } from './RankingScreen';
import { HomeScreen } from './HomeScreen';
import { UserScreen } from './UserScreen';
import { DetailScreen } from './DetailScreen';
import { SearchScreen }  from './SearchScreen';
import { AddScreen } from './AddScreen'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"   
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Record" component={RecordScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Add" component={AddScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;