import { StyleSheet, Text, View, SafeAreaView,ScrollView, LogBox, Alert, ActivityIndicator, TouchableOpacity, Pressable, Image} from 'react-native'
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

LogBox.ignoreAllLogs();

const Number_Of_Tries = 6;


const copyArray = (arr) => { // making a copy of this aaray 
  return [...arr.map((rows) => [...rows])];
};



const GuestWordleCoop = () => {
  const navigation = useNavigation();
  //AsyncStorage.removeItem("@game_coop2_Guest"); // Resetting async storage for game

  const Number_Of_Tries = 6;

  
    //const rows = new Array(Number_Of_Tries).fill(new Array(letters.length).fill(''))
  
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameSate, setGameState] = useState('playing');
    const [loaded, setloaded] = useState(false)

      // State for storing the words array
  const [words, setWords] = useState([]);
  const [word, setWord] = useState(''); // State for the current word
  const [letters, setLetters] = useState([]); // State for the letters of the current word
  const [rows, setRows] = useState([]); // Initialize rows as an empty array



    // New state variables for player management
    const [playerTurn, setPlayerTurn] = useState(1); // Player 1 starts
    const [player1State, setPlayer1State] = useState({ curRow: 0, curCol: 0, gameSate: 'playing' });
    const [player2State, setPlayer2State] = useState({ curRow: 0, curCol: 0, gameSate: 'playing' });



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
            console.log("Selected word:", randomWord); // Log the selected word to the terminal
          }
        } catch (error) {
          console.error('Error fetching words:', error);
          Alert.alert('Error', 'Failed to fetch words from the API.');
        }
      };
  
      fetchWords();
    }, []);

    console.log("Selected word:", word);
  
    // Update rows based on the fetched word
    useEffect(() => {
      if (letters.length > 0) {
        setRows(new Array(Number_Of_Tries).fill(new Array(letters.length).fill("")));
      }
    }, [letters]);

    useEffect(() => {
      if (word) {
        setLetters(word.split(""));
      }
    }, [word]);


  
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
        const existingStateString = await AsyncStorage.getItem("@game_coop2")
        const existingState = existingStateString ?  JSON.parse(existingStateString) : {};
        if(!existingState) { //then updating the data
          existingState = {}
        }
        existingState[dayKey] =dataForToday
        //writing the data back to async
        const dataString =JSON.stringify(existingState); //parsing from JSON object to string
        console.log("Saving", dataString)
        await AsyncStorage.setItem("@game_coop2", dataString); 
      } catch (e){
        console.log("Could not save data to async storage", e)
      }
  
    }
  
    const readState = async () =>
    {
      const dataString = await AsyncStorage.getItem("@game_coop2")
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
  
  
  
    // New function to check the game state for both players
    const checkGameState = () => {
      const checkPlayerState = (playerState, setPlayerState, playerRows) => {
        if (playerState.gameSate === 'playing') {
          if (checkIfWon(playerRows, playerState.curRow)) {
            setPlayerState({ ...playerState, gameSate: 'won' });
            Alert.alert(`Player ${playerTurn} Wins!`, "Congratulations!", [{
              text: "OK", onPress: () => navigation.navigate('Home')
            }]);
            return;
          }
          if (playerState.curRow === Number_Of_Tries) {
            setPlayerState({ ...playerState, gameSate: 'lost' });
            // Check if this is the last player to lose
            if (playerTurn === 2 && player1State.gameSate === 'lost') {
              Alert.alert("Game Over", "Both players have lost!", [{
                text: "OK", onPress: () => navigation.navigate('Home')
              }]);
            }
            return;
          }
        }

        if (checkIfWon(rows, curRow)) {
          const winningPlayerState = playerTurn === 1 ? player1State : player2State;
          const setWinningPlayerState = playerTurn === 1 ? setPlayer1State : setPlayer2State;
          setWinningPlayerState({ ...winningPlayerState, gameSate: 'won' });
          Alert.alert(`Player ${playerTurn} Wins!`, "Congratulations!", [{
            text: "OK", onPress: () => navigation.navigate('Home')
          }]);
        }
      };
    
      checkPlayerState(player1State, setPlayer1State, rows.slice(0, Number_Of_Tries / 2));
      checkPlayerState(player2State, setPlayer2State, rows.slice(Number_Of_Tries / 2));
    };
    
    const checkIfWon = (playerRows, curRow) => {
      if (curRow > 0) {
        const row = playerRows[curRow - 1];
        if (row) {
          return row.every((letter, i) => letter === letters[i]);
        }
      }
      return false;
    };

    const checkIfLose = () => { //lose state
      return !checkIfWon() && curRow == rows.length;
    }
  
    const onKeyPressed = (key) => {
        let currentState = playerTurn == 1 ? player1State : player2State;
        let setCurrentState = playerTurn == 1 ? setPlayer1State : setPlayer2State;

        if (currentState.gameSate != 'playing') {
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

      if (key === ENTER) {
        // Existing logic to change player turn and update rows...
        checkGameState(); // Check if the current player has won after making a guess
      }
    
  
      if (key == ENTER)
      {
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
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
  
  
  
    const getCellBGColor = (row, col) => {
      const letter = rows[row][col];
      if (row >= curRow) {
        return COLORS.grey;
      }
      if (letter === letters[col]) {
        return COLORS.primary; // Green for correct letter in correct position
      }
      if (letters.includes(letter)) {
        return COLORS.secondary; // Yellow for correct letter in wrong position
      }
      return COLORS.darkgrey; // Grey for absent letter
    };



  
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

          // Ensure words and rows are loaded
  if (words.length === 0 || rows.length === 0) {
    return <ActivityIndicator />;
  }

  
  
    return (
      <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
      <SafeAreaView style={styles.container}>
            <Text style={styles.title}>WORDLE Coop</Text>

        <View style={{flexDirection:'row'}}>
          <Text style={styles.currentPlayerText}>
              Player {playerTurn}'s Turn
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("GuestHome")}>
          <Text style={{fontSize:20, fontWeight:'bold'}}>    Go Home</Text>
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

export default GuestWordleCoop

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
    currentPlayerText:{
      fontSize:20,
      fontWeight:'500'
    },
    inputDetailsLink: {
      fontSize: 14,
      paddingHorizontal: 7,
      color: COLORS.third,
      textDecorationLine: 'underline',
    },
})