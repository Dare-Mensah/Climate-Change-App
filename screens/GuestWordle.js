import { StyleSheet, Text, View, SafeAreaView,ScrollView, LogBox, Alert, ActivityIndicator, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Keyboard from '../src/components/Keyboard'
import colors from '../src/constants'
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';
import { CLEAR } from '../src/constants';
import { ENTER } from '../src/constants';
import { colorsToEmoji } from '../src/constants';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import EndScreen from './EndScreen';
LogBox.ignoreAllLogs();

const Number_Of_Tries = 6;


const copyArray = (arr) => { // making a copy of this aaray 
  return [...arr.map((rows) => [...rows])];
};

const words = ["hello","yesno"]
  
const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
}

const getDayKey = () => {
  const d = new Date();
  let year = d.getFullYear();
  return `day-${getDayOfTheYear()}-${year}`;
}

const dayOfTheYear = getDayOfTheYear(); //add +2 to test for next day
const dayKey = getDayKey();

const  getWordForDay =(day)=>  {
  return words[day % words.length];
}

const GuestWordle = () => {
    const navigation = useNavigation();
    //AsyncStorage.removeItem("@game_Guest") //resetting async storage for game
    const word = getWordForDay(dayOfTheYear);
  
  
    const letters = word.split("");//returns an array of characters.
  
    const [rows, setRows] = useState(
      new Array(Number_Of_Tries).fill(new Array(letters.length).fill("")));
  
    //const rows = new Array(Number_Of_Tries).fill(new Array(letters.length).fill(''))
  
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameSate, setGameState] = useState('playing');
    const [loaded, setloaded] = useState(false)
  
    useEffect(() => {
      if(curRow > 0)
      {
        checkGameState();
      }
    }, [curRow])
  
  
  
    useEffect(() => {
      if(loaded) {
        persistState()
      }
    }, [rows,curRow,curCol, gameSate])
  
  
    useEffect(() => {
      readState()
    },[])
  
    const persistState = async () => {
      //saving all the game state varibales in async storage
      
      const dataForToday = {
        rows, curCol,curRow, gameSate
      };
  
      try{
        //firstly reading the data
        const existingStateString = await AsyncStorage.getItem("@game_Guest")
        const existingState = existingStateString ?  JSON.parse(existingStateString) : {};
        if(!existingState) { //then updating the data
          existingState = {}
        }
        existingState[dayKey] =dataForToday
        //writing the data back to async
        const dataString =JSON.stringify(existingState); //parsing from JSON object to string
        console.log("Saving", dataString)
        await AsyncStorage.setItem("@game_Guest", dataString); 
      } catch (e){
        console.log("Could not save data to async storage", e)
      }
  
    }
  
    const readState = async () =>
    {
      const dataString = await AsyncStorage.getItem("@game_Guest")
      try{
        const data = JSON.parse(dataString)
        const day = data[dayKey]
        setRows(day.rows)
        setCurCol(day.curCol)
        setCurRow(day.curRow)
        setGameState(day.gameSate)
      } catch(e){
        console.log("Could not parse the state")
      }
      //console.log(dataString) //debugging
  
      setloaded(true)
    }
  
  
  
    const checkGameState = () => {
      if(checkIfWon() && gameSate != 'won')
      {
        setGameState('won');
      }
      else if(checkIfLose() && gameSate != 'lost')
      {
        setGameState('lost');
      }
    };
  
  
  
    const checkIfWon = () => { // winning state
      const row = rows[curRow-1];
  
      return row.every((letter, i) => letter == letters[i]) //if every letter from a row is equalt to the letter we want to guess then we won
    }
  
    const checkIfLose = () => { //lose state
      return !checkIfWon() && curRow == rows.length;
    }
  
    const onKeyPressed = (key) => {
      if(gameSate != 'playing')
      {
        return;
      }
  
      const updatedRows = copyArray(rows);
  
      if(key == CLEAR){
        const prevCol = curCol -1; //check if the current col is not less than 0
        if (prevCol >= 0)
        {
          updatedRows[curRow][prevCol] = ""; //remove the word in the currnet row
          setRows(updatedRows);
          setCurCol(prevCol);
  
        }
        return;
      }
  
  
    
  
      if (key == ENTER)
      {
        if(curCol == rows[0].length)
        {
          setCurRow(curRow+1);
          setCurCol(0);
        }
        return
      } 
  
      if(curCol < rows[0].length) { //Checking if the current collumn doesnt extend past the lenght of the word
        updatedRows[curRow][curCol] = key;
        setRows(updatedRows) // set it back in state 
        setCurCol(curCol + 1); //incrementing the collumn after placing a letter in a box
      }
  
    };
  
    const isCellActive =(row, col) => {
      return row == curRow && col == curCol;
    }
  
  
  
    const getCellBGColor= (row, col) =>
    {
      const letter = rows[row][col];
      if (row >= curRow) {
        return COLORS.grey
      }
      if(letter  == letters[col])
      {
        return COLORS.primary; // checking if the letter is in the correct collumn change it to green
      }
      if (letters.includes(letter))
      {
        return COLORS.secondary; //if the letter is included in the word change it to yellow
      }
      return COLORS.darkgrey;
    }
  
    const getAllLettersWithColor = (color) => {
      return rows.flatMap((row, i) =>
        row.filter((cell, j) => getCellBGColor(i,j) == color) 
      );
    }
  
    const greenCaps = getAllLettersWithColor(COLORS.primary)
    const yellowCaps = getAllLettersWithColor(COLORS.secondary)
    const greyCaps = getAllLettersWithColor(COLORS.darkgrey)
   //for each of the keyboards caps on the virtual keyboard
    
  
    if(!loaded) {
      return (<ActivityIndicator/>)
    }
  
  
    if (gameSate != 'playing') {
      return (<EndScreen won={gameSate == 'won'} rows={rows} getCellBGColor={getCellBGColor} navigation={navigation}/>)
    }
  
  
  
    return (
      <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>WORDLE</Text>
  
        <View style={[styles.map]}>
          {rows.map((row, i) =>(
            <View key={'row-${i}'} style={styles.row}>
              {row.map((letter, j) => (
                <View key ={'cell-${i}-${j}'} style={[styles.cell, 
                {borderColor: isCellActive(i,j) ? COLORS.white : COLORS.darkgrey,
                backgroundColor: getCellBGColor(i, j),
                 }]}>
                  <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                </View>
              ))}
  
            </View>
          ))}
        </View>
        
        <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
        />
        
      </SafeAreaView>
      </LinearGradient>
    )
}

export default GuestWordle

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',

    },
    title: {  
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginTop: 20
    },
    map: {
      //backgroundColor: "red",
      alignSelf: 'stretch',
      height: 100,

    },
    
    row: {
      //backgroundColor: "blue",
      alignSelf: "stretch",
      height: 50,
      flexDirection: "row",
      marginTop: 30,
      justifyContent: "center"
    },

    cell: {
      borderWidth: 3,
      borderColor: "#818384",
      width: 30,
      flex: 1,
      height: 30,
      aspectRatio: 1,
      margin: 3,
      maxWidth: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },

    cellText: {
      color: "black",
      fontSize: 28,
      fontWeight: 'bold'
    },

    multiplayerButton: {
      marginTop: 4,
      backgroundColor: COLORS.primary,
      padding: 10,
      borderRadius: 8,
    },
  
    multiplayerButtonText: {
      color: COLORS.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
})