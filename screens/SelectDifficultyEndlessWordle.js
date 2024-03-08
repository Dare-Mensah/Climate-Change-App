import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity,RefreshControl,backgroundImage } from 'react-native'
import React, {useState, useEffect} from 'react'
import COLORS from '../data/colors'
import DATA from '../data/data1'
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'
import { Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

const {width} = Dimensions.get('screen')


const SelectDifficultyEndlessWordle = () => {

  const navigation = useNavigation(); 
  const [showEasyDescription, setShowEasyDescription] = useState(false);

  const toggleDescriptionVisibility = () => {
    setShowEasyDescription(!showEasyDescription);
  };

  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
      <View>
        <Animatable.Text 
          animation={"fadeInUpBig"}
          style={[styles.Title1, {paddingHorizontal:20, paddingTop:10, marginBottom: 30}]}>
          Select Difficulty
        </Animatable.Text>
      </View>

      <View style={styles.achievementBox}>
        <TouchableOpacity  onPress={() => navigation.navigate("EndlessWordle")}>
          <View style={styles.achievementContainer}>
            <Image
              source={require('../assets/ranking1.png')}
              style={styles.achievementImage}
            />
            <Text style={styles.achievementText}>
              Easy Mode
            </Text>
          </View>
            <Text style={styles.descriptionText}>
              In this mode you will have 2 minutes and 30 seconds to guess each word, words will have a length of 4 letters!
            </Text>
        </TouchableOpacity>
      </View>


      <View style={styles.achievementBox}>
        <TouchableOpacity  onPress={() => navigation.navigate("EndlessWordleMedium")}>
          <View style={styles.achievementContainer}>
            <Image
              source={require('../assets/ranking2.png')}
              style={styles.achievementImage}
            />
            <Text style={styles.achievementText}>
              Medium Mode
            </Text>
          </View>
            <Text style={styles.descriptionText}>
              In this mode you will have 2 minutes to guess each word, words will have a length of 5 letters!
            </Text>
        </TouchableOpacity>
      </View>



      <View style={styles.achievementBox}>
        <TouchableOpacity  onPress={() => navigation.navigate("EndlessWordleHard")}>
          <View style={styles.achievementContainer}>
            <Image
              source={require('../assets/ranking3.png')}
              style={styles.achievementImage}
            />
            <Text style={styles.achievementText}>
              Hard Mode
            </Text>
          </View>
            <Text style={styles.descriptionText}>
              In this mode you will have 1 minute and 30 seconds to guess each word, words will have a maximum length of 6 letters!
            </Text>
        </TouchableOpacity>
      </View>



    </LinearGradient>
  );
};

export default SelectDifficultyEndlessWordle

const styles = StyleSheet.create({
    Title1:{
        fontSize: 34,
        marginTop: 20,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',

    },

    achievementContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        flexDirection:'row'
      },
      achievementImage: {
        width: 40,
        height: 40,
        marginBottom: 10,
      },
      descriptionText: {
        fontSize: 14,
        padding: 10,
        color: 'gray',
        textAlign:'center',
        marginBottom:10
      },


      achievementText:{
        paddingHorizontal: 20,

      },
       
      arrowImage: {
        width: 20,
        height: 20,
        },
      
        achievementBox: {
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          padding: 10,
          marginVertical: 10,
          width: '90%',
          alignSelf: 'center',
          marginTop: 20,
        },
})