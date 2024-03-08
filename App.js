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
import Settings from './screens/Settings';
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
import EditComment from './screens/EditComment';
import CarbonFootPrintCalc from './screens/CarbonFootPrintCalc';
import EndScreenCoop from './screens/EndScreenCoop';
import EndlessWordle from './screens/EndlessWordle';
import EndlessEndScreen from './screens/EndlessEndScreen';
import WordleCoop2 from './screens/WordleCoop2';
import Achievements from './screens/Achievements';
import CoopWordleInfo from './screens/CoopWordleInfo';
import EndlessWordleInfo from './screens/EndlessWordleInfo';
import GuestWordle from './screens/GuestWordle';
import GuestWordleCoop from './screens/GuestWordleCoop';
import GuestCoopInfo from './screens/GuestCoopInfo';
import GuestEndlessWordle from './screens/GuestEndlessWordle';
import GuestEndlessEndScreen from './screens/GuestEndlessEndScreen';
import GuestEndlessInfo from './screens/GuestEndlessInfo';
import SelectDifficultyEndlessWordle from './screens/SelectDifficultyEndlessWordle';
import EndlessWordleMedium from './screens/EndlessWordleMedium';
import EndlessWordleHard from './screens/EndlessWordleHard';
import About from './screens/About';
import Privacy from './screens/Privacy';
import Accessibility from './screens/Accessibility';
import GuestSelectDiffWordle from './screens/GuestSelectDiffWordle';
import GuestEndlessWordleMedium from './screens/GuestEndlessWordleMedium';
import GuestEndlessWordleHard from './screens/GuestEndlessWordleHard';
import WordleLeaderboards from './screens/WordleLeaderboards';



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
        <Stack.Screen name="GuestWordle" component={GuestWordle}/>
        <Stack.Screen name="EndScreen" component={EndScreen}/>
        <Stack.Screen name="GuestWordleCoop" component={GuestWordleCoop}/>
        <Stack.Screen name="GuestCoopInfo" component={GuestCoopInfo}/>
        <Stack.Screen name="GuestEndlessWordle" component={GuestEndlessWordle}/>
        <Stack.Screen name="GuestEndlessInfo" component={GuestEndlessInfo}/>
        <Stack.Screen name="GuestEndlessEndScreen" component={GuestEndlessEndScreen}/>
        <Stack.Screen name="Tips" component={Tips}/>
        <Stack.Screen name="SignUpComplete" component={SignUpComplete}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="EndlessWordleInfo" component={EndlessWordleInfo}/>
        <Stack.Screen name="EndlessWordle" component={EndlessWordle}/>
        <Stack.Screen name="GuestSelectDiffWordle" component={GuestSelectDiffWordle}/>
        <Stack.Screen name="GuestEndlessWordleMedium" component={GuestEndlessWordleMedium}/>
        <Stack.Screen name="GuestEndlessWordleHard" component={GuestEndlessWordleHard}/>
        
        
        
      </Stack.Navigator>
    );
  }


  return(
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="SignUpComplete" component={SignUpComplete}/>
      <Stack.Screen name="News" component={News}/>
      <Stack.Screen name="Tips" component={Tips}/>
      <Stack.Screen name="Settings" component={Settings}/>
      <Stack.Screen name="EditProfile" component={EditProfile}/>
      <Stack.Screen name="Wordle" component={Wordle}/>
      <Stack.Screen name="EndScreen" component={EndScreen}/>
      <Stack.Screen name="BlogScreen" component={BlogScreen}/>
      <Stack.Screen name="BlogDetails" component={BlogDetails}/>
      <Stack.Screen name="EditBlog" component={EditBlog}/>
      <Stack.Screen name="EditComment" component={EditComment}/>
      <Stack.Screen name="CarbonFootPrintCalc" component={CarbonFootPrintCalc}/>
      <Stack.Screen name="EndScreenCoop" component={EndScreenCoop}/>
      <Stack.Screen name="EndlessWordle" component={EndlessWordle}/>
      <Stack.Screen name="EndlessEndScreen" component={EndlessEndScreen}/>
      <Stack.Screen name="WordleCoop2" component={WordleCoop2}/>
      <Stack.Screen name="Achievements" component={Achievements}/>
      <Stack.Screen name="CoopWordleInfo" component={CoopWordleInfo}/>
      <Stack.Screen name="EndlessWordleInfo" component={EndlessWordleInfo}/>
      <Stack.Screen name="SelectDifficultyEndlessWordle" component={SelectDifficultyEndlessWordle}/>
      <Stack.Screen name="EndlessWordleMedium" component={EndlessWordleMedium}/>
      <Stack.Screen name="EndlessWordleHard" component={EndlessWordleHard}/>
      <Stack.Screen name="About" component={About}/>
      <Stack.Screen name="Privacy" component={Privacy}/>
      <Stack.Screen name="Accessibility" component={Accessibility}/>
      <Stack.Screen name="WordleLeaderboards" component={WordleLeaderboards}/>
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




