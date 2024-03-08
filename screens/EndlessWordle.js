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
import EndScreenCoop from './EndScreenCoop';
import EndlessEndScreen from './EndlessEndScreen';
LogBox.ignoreAllLogs();

const Number_Of_Tries = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};



const EndlessWordle = () => {
  const navigation = useNavigation();

  const [difficulty, setDifficulty] = useState('easy'); // New state for difficulty
  const [wordIndex, setWordIndex] = useState(0); // Existing state
  const [correctWordsCount, setCorrectWordsCount] = useState(0);
  const [timer, setTimer] = useState(250); // Initialize timer with 60 seconds
  const [words, setWords] = useState([]); // State for storing the fetched words
  const [word, setWord] = useState(''); // State for the current word
  // Define 'word' after state initialization
  const letters = word.split(""); // Now 'word' is defined before use

  // Initialize 'rows' state with correct length based on 'letters'
  const [rows, setRows] = useState(
    new Array(Number_Of_Tries).fill(new Array(letters.length).fill(""))
  );


  
    //const rows = new Array(Number_Of_Tries).fill(new Array(letters.length).fill(''))
  
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameSate, setGameState] = useState('playing');
    const [loaded, setloaded] = useState(false)


    const [startTime, setStartTime] = useState(null);
    const [guessDurations, setGuessDurations] = useState([]);


    useEffect(() => {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
      if(timer <= 0) {
        setGameState('lost'); // Change the game state to 'lost' when timer reaches 0
      }
    }, [timer]);
  
    useEffect(() => {
      if(curRow > 0)
      {
        checkGameState();
      }
    }, [curRow])



    useEffect(() => {
        if (checkIfWon()) {
            setCorrectWordsCount(correctWordsCount + 1);
            setGameState('won');
            resetGameForNextWord();
        } else if (timer <= 0) {
            setGameState('lost');
        }
    }, [timer, curRow]);



    useEffect(() => {
      const fetchWords = async () => {
        try {
          const response = await fetch('https://random-word-api.vercel.app/api?words=500&length=4');
          const fetchedWords = await response.json();
          setWords(fetchedWords);
          if (fetchedWords.length > 0) {
            const randomWord = fetchedWords[Math.floor(Math.random() * fetchedWords.length)];
            setWord(randomWord);
            setRows(new Array(Number_Of_Tries).fill(new Array(randomWord.length).fill("")));
          }
        } catch (error) {
          console.error('Error fetching words:', error);
        }
      };
  
      fetchWords();
    }, []);


      // Existing useEffect for updating the word and rows states
  useEffect(() => {
    if (word) {
      console.log("Current word:", word); // Log the current word to the console
      setRows(new Array(Number_Of_Tries).fill(new Array(word.length).fill("")));
    }
  }, [word]);


  
  // Update the word and rows states when a new word is set
  useEffect(() => {
    if (word) {
      setRows(new Array(Number_Of_Tries).fill(new Array(word.length).fill("")));
    }
  }, [word]);

  const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
  };

  // Modified resetGameForNextWord function
  const resetGameForNextWord = () => {
    const nextWord = getRandomWord();
    setWord(nextWord);
    setRows(new Array(Number_Of_Tries).fill(new Array(nextWord.length).fill("")));
    setCurRow(0);
    setCurCol(0);
    setGameState('playing');
    setTimer(250); // Reset timer to initial value (or whatever value you prefer)
  };
  
  
  
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
        const existingStateString = await AsyncStorage.getItem("@game_endless")
        const existingState = existingStateString ?  JSON.parse(existingStateString) : {};
        if(!existingState) { //then updating the data
          existingState = {}
        }
        existingState[dayKey] =dataForToday
        //writing the data back to async
        const dataString =JSON.stringify(existingState); //parsing from JSON object to string
        console.log("Saving", dataString)
        await AsyncStorage.setItem("@game_endless", dataString); 
      } catch (e){
        console.log("Could not save data to async storage", e)
      }
  
    }
  
    const readState = async () =>
    {
      const dataString = await AsyncStorage.getItem("@game_endless")
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
  
  
  
    // Existing checkGameState function with modification to reset timer
    const checkGameState = () => {
        if(checkIfWon() && gameSate != 'won') {
          setGameState('won');
          setTimer(60); // Reset timer to 60 seconds upon correct guess
        } else if(checkIfLose() && gameSate != 'lost') {
          setGameState('lost');
        }
      };
  
  
  
      const checkIfWon = () => {
        // Check if the current row is valid
        if (curRow > 0) {
          const row = rows[curRow - 1];
          return row.every((letter, i) => letter === letters[i]);
        }
        return false; // Return false if the current row is not valid
      }
  
    const checkIfLose = () => { //lose state
      return !checkIfWon() && curRow == rows.length;
    }


    const calculateAverageDuration = () => {
      if (guessDurations.length === 0) return 0;
      const total = guessDurations.reduce((acc, duration) => acc + duration, 0);
      return (total / guessDurations.length).toFixed(2);
    };



  
    const onKeyPressed = (key) => {
      if(gameSate != 'playing')
      {
        return;
      }

        // Start timer for a new guess
      if (curCol === 0 && curRow < rows.length && gameSate === 'playing' && !startTime) {
        setStartTime(new Date());
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
  
  
    
  
      if (key === ENTER) {
        if (curCol === rows[0].length) {
          const endTime = new Date();
          const duration = (endTime - startTime) / 1000; // duration in seconds
          setGuessDurations([...guessDurations, duration]);
          setCurRow(curRow + 1);
          setCurCol(0);
          setStartTime(null); // Reset start time for the next guess
        }
        return;
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


    if (words.length === 0) {
      return <ActivityIndicator />;
    }
  
  
    if (gameSate != 'playing') {
      const averageDuration = calculateAverageDuration();
      return (<EndlessEndScreen won={gameSate == 'won'} correctWordsCount={correctWordsCount} rows={rows} getCellBGColor={getCellBGColor} navigation={navigation} averageDuration={averageDuration}/>)
    }


  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WORDLE Endless</Text>
      <View style={{flexDirection:'row'}}>
      <Text style={{fontWeight:'500', fontSize:20}}>
          Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={{fontSize:20, fontWeight:'bold'}}>  Go Home</Text>
        </TouchableOpacity>
      </View>
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


export default EndlessWordle

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