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
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

const Number = ({number, label}) => (
    <View style ={{alignItems: 'center', margin: 10}}>
        <Text style={{fontSize: 35, fontWeight: 'bold'}}>{number}</Text>
        <Text style={{fontSize: 20, fontWeight: 200}}>{label}</Text>
    </View>
)


const GuessDistribution = ({ distribution }) => {
  if (!distribution) {
    return null;
  }
  const sum = distribution.reduce((total, dist) => dist + total, 0);
  return (
    <View style={{ width: '100%', padding: 20, justifyContent: 'flex-start' }}>
      {distribution.map((dist, index) => (
        <GuessDistributionLine key={index} position={index + 1} amount={dist} percentage={sum !== 0 ? (100 * dist) / sum : 0} />
      ))}
    </View>
  );
};

const GuessDistributionLine = ({ position, amount, percentage }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'flex-start' }}>
      <Text style={{ fontSize: 17 }}>{position}</Text>
      <View style={{ backgroundColor: COLORS.grey, margin: 5, padding: 5, width: `${percentage}%`, minWidth: 20, maxWidth: 290 }}>
        <Text style={{ fontSize: 17 }}>{amount}</Text>
      </View>
    </View>
  );
};


const EndScreenCoop = ({ won, winner, rows, getCellBGColor, navigation }) => {

    const [secondsTillTmr, setSecondsTillTmr] = useState(0);
    const [played, setPlayed] = useState(0);
    const [winRate, setWinRate] = useState(0);
    const [curStreak, setCurStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [distribution, setDistribution] = useState(null)


    const saveStatsToAsyncStorage = async () => {
        const statsData = {
            curStreak,
            winRate,
            played,
            distribution,
        };

        // Save to AsyncStorage with a different key
        const statsString = JSON.stringify(statsData);
        await AsyncStorage.setItem('@game_stats_coop', statsString);
    };



    useEffect(() => {
      readState();
      saveStatsToAsyncStorage(); // Save stats to AsyncStorage
    }, []);
  
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
  
    useEffect(() => {
      const updateTime = () => {
        // Calculating the amount of time before the next game.
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
        setSecondsTillTmr(Math.floor((tomorrow - now) / 1000));
      };
  
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }, []);
  
    const readState = async () => {
      const dataString = await AsyncStorage.getItem('@game_coop');
      let data;
      try {
        data = JSON.parse(dataString);
      } catch (e) {
        console.log('Could not parse the state');
      }
  
      const keys = Object.keys(data);
      const values = Object.values(data);
  
      setPlayed(keys.length);
      const numberOfWins = values.filter((game) => game.gameSate === 'won').length;
  
      setWinRate(Math.floor((100 * numberOfWins) / keys.length));
  
      let _curStreak = 0;
      let prevDay = 0;
      let _maxStreak = 0;
  
      keys.forEach((key) => {
        const day = parseInt(key.split('-')[1]);
  
        if (data[key].gameSate === 'won' && (_curStreak === 0 || prevDay + 1 === day)) {
          _curStreak += 1;
        } else {
          if (_curStreak > _maxStreak) {
            _maxStreak = _curStreak;
          }
  
          _curStreak = data[key].gameSate === 'won' ? 1 : 0;
        }
  
        prevDay = day;
      });
  
      if (_curStreak > _maxStreak) {
        _maxStreak = _curStreak;
      }
  
      setCurStreak(_curStreak);
      setMaxStreak(_maxStreak);

      const dist =[0,0,0,0,0,0]

      values.map((game) => {
        if(game.gameSate == 'won') {
            const tries = game.rows.filter((row) => row[0]).length;
            dist[tries] = dist[tries] + 1
        }
      })

      setDistribution(dist)
    };
  

    //const formatSeconds = () => {
        //const hours = Math.floor(setSecondsTillTmr / 3600);
       //const minutes = Math.floor((setSecondsTillTmr % 3600) / 60);
        //const seconds = Math.floor(setSecondsTillTmr % 60);
      
        //return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      //};


    const calculateTimeTillNextGame = () => {
      const hours = Math.floor(secondsTillTmr / 3600);
      const minutes = Math.floor((secondsTillTmr % 3600) / 60);
      const seconds = secondsTillTmr % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    };

  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{width:'100%', alignContent:'center'}}>
        <View>
            <Text style={styles.title}>WORDLE Coop</Text>
            <Text style={{ fontSize: 30, color: "black", fontWeight: 400, textAlign: 'center' }}>
              {won ? `${winner} Won!` : 'Try again tomorrow'}
            </Text>
        </View>

        <Text style ={{fontSize: 30, color:"black", fontWeight: 200, marginVertical: 20, textAlign: 'center',}}>Your Statisitics</Text>
        <View>
            <Number number={played} label ={"Played"}/>
        </View>

        <View>
            
            <View>
                <Text style ={{fontSize: 30, color:"black", fontWeight: 200, marginTop:20, textAlign: 'center',}}>Next Game</Text>
                <Text style ={{fontSize: 30, color:"black", fontWeight: 'bold',marginTop:10, textAlign: 'center',}}>{calculateTimeTillNextGame()}</Text>
            </View>


            
      <View style={styles.buttonsContainer}>


      <TouchableOpacity style={styles.button} onPress={share}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        {/* Home Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>

        </View>

        </SafeAreaView>
        </ScrollView>

    </LinearGradient>
  )
}

export default EndScreenCoop

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

      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.09,
        shadowRadius: 10,
        marginTop:50
        

        // You can adjust padding, margin, etc. as needed
      },


      button: {
        backgroundColor: '#4CAF50', // Example color
        padding: 15, // Increased padding
        borderRadius: 8, // Slightly larger border radius
        // Optional: define width and height if you want fixed size buttons
        width: 120, // Example fixed width
        height: 50,  // Example fixed height
        justifyContent: 'center', // Centers text vertically
        alignItems: 'center', // Centers text horizontally
        margin: 5, // Add margin if buttons are too close to each other
        // other styling for the button
      },
      buttonText: {
        color: '#fff',
        fontSize: 20, // Larger font size
        fontWeight: 'bold', // Optional: make text bold
        // other text styling
      },
})