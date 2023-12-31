import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, useEffect} from 'react';
import {firebase} from './config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity } from 'react-native'


import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import StartUp from './screens/StartUp';
import News from './screens/News';
import Tips from './screens/Tips';
import ForgotPassword from './screens/ForgotPassword';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import Onboarding from './screens/Onboarding';
import SignUpComplete from './screens/SignUpComplete';
import GuestHome from './screens/GuestHome';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Wordle from './screens/Wordle';
import EndScreen from './screens/EndScreen';
import GuestProfile from './screens/GuestProfile';
import BlogScreen from './screens/BlogScreen';
import BlogDetails from './screens/BlogDetails';
import EditBlog from './screens/EditBlog';



const Stack = createStackNavigator();

//const navigation = useNavigation();



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
        <Stack.Screen name="Onboarding" component={Onboarding}/>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="GuestHome" component={GuestHome}/>
        <Stack.Screen name="GuestProfile" component={GuestProfile}/>
        <Stack.Screen name="Wordle" component={Wordle}/>
        <Stack.Screen name="EndScreen" component={EndScreen}/>
        <Stack.Screen name="Tips" component={Tips}/>
        <Stack.Screen name="SignUpComplete" component={SignUpComplete}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        
      </Stack.Navigator>
    );
  }


  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="SignUpComplete" component={SignUpComplete}/>
      <Stack.Screen name="News" component={News}/>
      <Stack.Screen name="Tips" component={Tips}/>
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="EditProfile" component={EditProfile}/>
      <Stack.Screen name="Wordle" component={Wordle}/>
      <Stack.Screen name="EndScreen" component={EndScreen}/>
      <Stack.Screen name="BlogScreen" component={BlogScreen}/>
      <Stack.Screen name="BlogDetails" component={BlogDetails}/>
      <Stack.Screen name="EditBlog" component={EditBlog}/>
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




