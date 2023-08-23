import {  Pressable, StyleSheet, Text, View, Dimensions, Image, Animated} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';

const StartUp = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.container}>
        <Text style={styles.Title1}>Climate Sense</Text>
  
  
        <Pressable
          style = {{
          justifyContent: 'center',
          alignItems: 'center',
  
        }}
        >
  
        <Animatable.Image
        animation={"bounceIn"} 
        source={require('../assets/planet-earth.png')}
        style={styles.Images}
  
        />
        </Pressable>
  
  
  
  
  
        <Pressable 
        onPress={() => navigation.navigate("SignIn")}
        style={[styles.box1,{marginTop:60,justifyContent:'center',alignItems:'center', backgroundColor:COLORS.third}] }
        >
        <Text style={[styles.text1,{color:COLORS.white}]}>Login</Text>
        </Pressable>
  
  
  
  
        <Pressable onPress={() => navigation.navigate("SignUp")}
        style={[styles.box1, {marginTop:50, backgroundColor:COLORS.third}]}
        >
        <Text style={[styles.text1,{color:COLORS.white}]}>SignUp</Text>
        </Pressable>
  
  
      </View>
    )
}

export default StartUp

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingTop:50
    },
    
    Images:{
      height: 230,
      width: 230,
      marginTop:60,
      //borderRadius: 270 / 2,
      //backgroundColor: '#CDFADB',
      justifyContent: 'center',
      alignItems: 'center',
      //shadowColor: '#000000',
      //shadowOffset: {
          //width: 0,
          //height: 2,
      //},
      //shadowOpacity: 0.09,
      //shadowRadius: 10,
    },
    
      Title1:{
        fontSize: 40,
        marginTop: 90,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',
        justifyContent:'center',
        textAlign:'center',
    
    },
    
    box1:{
      backgroundColor: '#EAEAEA',
      elevation: 2,
      borderRadius: 20,
      width: 210,
      height: 60,
      shadowColor: '#000000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.09,
      shadowRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 95,
      textAlign: 'center'
    },
    
    text1:{
      alignItems: 'center',
      fontWeight:'bold',
      fontSize: 20,
    
    },
    
})