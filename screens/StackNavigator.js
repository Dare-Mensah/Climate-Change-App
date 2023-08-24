import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from './Home'
import StartUp from './StartUp'
import Tips from './Tips'
import SignIn from './SignIn'
import SignUp from './SignUp'
import News from './News'

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="StartUp" component={StartUp}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="News" component={News}/>
        <Stack.Screen name="Tips" component={Tips}/>
        <Stack.Screen name="SignIn" component={SignIn}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
    </Stack.Navigator>
</NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})