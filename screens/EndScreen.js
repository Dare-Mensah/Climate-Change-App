import { StyleSheet, Text, View, SafeAreaView,ScrollView, LogBox, Alert, ActivityIndicator, TouchableOpacity} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../src/constants'
import COLORS from '../data/colors';
import { colorsToEmoji } from '../src/constants';
import * as Clipboard from 'expo-clipboard';
import Keyboard from '../src/components/Keyboard'
import * as Animatable from 'react-native-animatable';
import { CLEAR } from '../src/constants';
import { ENTER } from '../src/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {firebase} from '../config'
import Constants from 'expo-constants';

const EndScreen = ({ won = false, rows, getCellBGColor, navigation }) => {

    const share = () => {
      // Sharing the game result.
      const textMap = rows
        .map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join(''))
        .filter((row) => row)
        .join('\n');
  
      const textToShare = `Your Wordle Result:\n${textMap}`;
      Clipboard.setString(textToShare);
      Alert.alert('Copied Successfully', 'Spread the word on social media');
    };
  

  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>WORDLE</Text>
            <Text style={styles.winMessage}>{won ? 'You Won!' : 'Failed Game Over'}</Text>
          </View>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={share} style={[styles.button, {backgroundColor: COLORS.third}]}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              navigation.navigate("Home")

            }} 
            style={[styles.button, {backgroundColor: COLORS.third, marginLeft: 10}]}>
              <Text style={styles.buttonText}>Return Home</Text>
            </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
        </SafeAreaView>

    </LinearGradient>
  )
}

export default EndScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
    },

    title: {   
      fontSize: 40,
      fontWeight: 'bold',
      letterSpacing: 4,
      marginTop: 20,
      textAlign: 'center',
    },
    winMessage: {
      fontSize: 30,
      fontWeight: '200',
      color: "black",
      marginTop: 20,
      textAlign: 'center',
    },

    box1:{
        backgroundColor: '#EAEAEA',
        elevation: 2,
        borderRadius: 20,
        width: "54%",
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
        marginLeft: 85,
        textAlign: 'center'
      },
      
      text1:{
        alignItems: 'center',
        fontWeight:'bold',
        fontSize: 20,
      
      },

      scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center', // This centers content vertically in the scroll view
      },
      titleContainer: {
        alignItems: 'center', // This centers content horizontally
      },

      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Center buttons horizontally in the container
        marginTop: 20,
      },
      button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.09,
        shadowRadius: 10,
      },
      buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },


})