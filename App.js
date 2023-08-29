import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, useEffect} from 'react';
import {firebase} from './config'


import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import StartUp from './screens/StartUp';
import News from './screens/News';
import Tips from './screens/Tips';
import ForgotPassword from './screens/ForgotPassword';


const Stack = createStackNavigator();



function App(){
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();


  //Handle user state chnages
  function onAuthStateChnaged(user){
    setUser(user);
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChnaged)
    return subscriber
  }, []);

  if (initializing) return null;

  if (!user){
    return (
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="StartUp" component={StartUp}/>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
      </Stack.Navigator>
    );
  }


  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="News" component={News}/>
        <Stack.Screen name="Tips" component={Tips}/>
    </Stack.Navigator>
  )
}


export default () => {
  return(
    <NavigationContainer>
      <App/>
    </NavigationContainer>
  )
}




