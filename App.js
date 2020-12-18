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
<<<<<<< HEAD
import { DetailScreen } from './DetailScreen';
=======
import { SearchScreen }  from './SearchScreen'
>>>>>>> a355f1998072544a5737ace8d4808d700fc1fbba

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
<<<<<<< HEAD
        <Stack.Screen name="Detail" component={DetailScreen} />
=======
        <Stack.Screen name="Search" component={SearchScreen} />

>>>>>>> a355f1998072544a5737ace8d4808d700fc1fbba

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;