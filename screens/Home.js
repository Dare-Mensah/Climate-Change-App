import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import COLORS from '../data/colors'
import DATA from '../data/data1'
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'

import { useNavigation } from '@react-navigation/native';
const {width} = Dimensions.get('screen')

const Home = ({username}) => {
    const navigation = useNavigation();

    const [name, setName] = useState('')

    useEffect(() => {
      firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists){
          setName(snapshot.data())
        }
        else {
          console.log('User does not exists')
        }
      })
    }, [])

    const Card =({Tips}) => {
      return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Tips", Tips)}>
      <ImageBackground style={styles.cardImage} source={Tips.image}>
        <Text style={{color: COLORS.white, fontSize: 20, fontWeight:'800'}}>{Tips.name}</Text>
        <Text style={{color: COLORS.white, fontSize: 15, fontWeight:'300', marginVertical:20}}>{Tips.author}</Text>
        <Image style={{height: 70, width:70, marginLeft:50, }} source={Tips.icon}/>
      </ImageBackground>
      </TouchableOpacity>
      )
    }
  
    return (
  

      <SafeAreaView style={{flex:1, backgroundColor:COLORS.white}}>
        <StatusBar translucent={false} backgroundColor={COLORS.third}/>
        <View style={styles.header}>
          <Pressable>
            <Image style={{height: 30, width:30}} source={require('../assets/home2.png')}/>
          </Pressable>
  
          <Text style={{
          fontSize: 20,
          fontWeight:'800',
          //paddingTop:5,
          color: COLORS.white,
        }}>Climate Sense</Text>
  
          <Pressable>
            <Image style={{height: 30, width:30, paddingTop: 5}} source={require('../assets/user1.png')}/>
          </Pressable>
        </View>
    
        <Text style={[styles.Title1, style={paddingHorizontal:20, paddingTop:10}]}>Hi, {name.username}</Text>
  
        <ScrollView showsVerticalScrollIndicator={false}>
  
        <Animatable.View 
        animation={"fadeInUpBig"}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 2,
          borderRadius: 20,
          width: 370,
          height: 130,
          shadowColor: '#000000',
          shadowOffset: {
              width: 0,
              height: 2,
          },
          shadowOpacity: 0.09,
          shadowRadius: 10,
          marginTop: 20,
          marginLeft:20,}}>
  
          <View style={{flexDirection:'row'}}>
            <Text 
            style={{fontSize:70, 
            fontWeight:'bold',
            paddingTop:8, 
            paddingHorizontal:30}}
            >5°</Text>
  
          <View style={{flexDirection:'column'}}>
          <Text style={{        
          alignItems: 'center',
          fontSize: 33,
          marginLeft:50,
          paddingTop: 15,
          fontWeight:'200',}} >Chilly</Text>
  
  
          <Text style={{        
          alignItems: 'center',
          fontSize: 33,
          marginLeft:40,
          //paddingTop: 15,
          fontWeight:'200',}} >London</Text>
          </View>
          </View>
        </Animatable.View>
  
        <Text style={styles.sectionTitle}>Tips</Text>
  
  
        <View>
          <FlatList 
          contentContainerStyle={{paddingLeft:20}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          renderItem={({item}) => <Card Tips={item}/>}
          />
        </View>
  
        <Text style={styles.sectionTitle}>Wordle</Text>
  
  
        </ScrollView>
      </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    Title1:{
        fontSize: 34,
        marginTop: 20,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',

    },

    header:{
      paddingVertical: 21,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: COLORS.third,
      borderBottomLeftRadius:20,
      borderBottomRightRadius:20,
      elevation:10
    },
  
    headerTitle:{
      color: COLORS.white,
      fontSize: 23,
      fontWeight: '400',
    },
  
    inputContainer:{
      height: 60,
      width:'100%',
      backgroundColor: COLORS.white,
      borderRadius:10,
      position: 'absolute',
      top: 90,
      flexDirection: 'row',
      paddingHorizontal: 20,
      alignItems:'center',
      elevation: 12,
  
    },
  
    sectionTitle:{
      marginHorizontal: 20,
      marginVertical:25,
      fontSize: 20,
      fontWeight:'300'
    },
  
    cardImage:{
      height: 220,
      width: width /2,
      marginRight: 20,
      padding: 20,
      overflow:"hidden",
      borderRadius: 10,
      
    },
    othercards:{
      width:width -40,
      height: 200,
      marginRight: 20, 
      borderRadius: 10, 
      overflow:"hidden",
      marginLeft: 20,
      elevation:10,
    },

    weather:{
      
    }

})