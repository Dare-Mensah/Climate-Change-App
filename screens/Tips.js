import {  ImageBackground, StatusBar, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native'
import COLORS from '../data/colors'
import StartUp from './StartUp'
import * as Animatable from 'react-native-animatable';

const Tips = ({navigation, route}) => {
    const Tips = route.params;
    const navi = useNavigation();
  return (
    <View style={{flex:1}}>
      <ImageBackground style={{flex:1}} source={Tips.image}>
      <View style={styles.header}>
         <Pressable onPress={() => navi.navigate("Home")}>
          <Image style={{width:40, height:40}} source={require("../assets/back.png")}></Image>
        </Pressable>
      </View>

      <View style={styles.header2}>
        <Text style={styles.text_footer}>{Tips.name}</Text>
      </View>

      <Animatable.View 
      animation={"fadeInUpBig"}
      style={styles.footer}
      >
        <Text style ={{marginTop: 20, fontWeight: "bold", fontSize: 20}}>About</Text>
        <Text style={{marginTop:20, lineHeight: 22, fontWeight:'400',}}>{Tips.description}</Text>
      </Animatable.View>

      </ImageBackground>
    </View>
  )
}

export default Tips

const styles = StyleSheet.create({
    header:{
        marginTop: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:20,
    },
    detailsContainer: {
        top: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius:30,
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        //flex: 1,
    },

    imageDetails: {
        padding:20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position:'absolute',
        bottom:30
    },

    header1:{
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.third,
        //borderBottomLeftRadius:20,
        //borderBottomRightRadius:20,
        //elevation:10
      },

    header2:{
        flex: 1,
        justifyContent:'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },

    footer:{
      flex: 3,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 30,
  },

  text_footer:{
    color: 'white',
    fontSize: 30,
},

})