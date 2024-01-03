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
LogBox.ignoreAllLogs();

const Number_Of_Tries = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

const words = ["hello", "yesno"];

const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

const getDayKey = () => {
  const d = new Date();
  let year = d.getFullYear();
  return `day-${getDayOfTheYear()}-${year}`;
};

const dayOfTheYear = getDayOfTheYear();
const dayKeyCoop = `${getDayKey()}-coop`;

const getWordForDay = (day) => {
  return words[day % words.length];
};

const WordleCoop = () => {
  const navigation = useNavigation();
  const word = getWordForDay(dayOfTheYear);
  const letters = word.split("");

  // Player specific states
  const [player1Rows, setPlayer1Rows] = useState(new Array(Number_Of_Tries).fill(new Array(letters.length).fill("")));
  const [player2Rows, setPlayer2Rows] = useState(new Array(Number_Of_Tries).fill(new Array(letters.length).fill("")));
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const playerTurnText = isPlayer1Turn ? "Player 1's Turn" : "Player 2's Turn";
  const [winner, setWinner] = useState(null);


  // Shared game state
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  useEffect(() => {
    if (loaded) {
      persistState();
    }
  }, [player1Rows, player2Rows, curRow, curCol, gameState]);

  useEffect(() => {
    readState();
  }, []);

  const persistState = async () => {
    const dataForToday = {
      player1Rows,
      player2Rows,
      curCol,
      curRow,
      gameState
    };

    try {
      const existingStateString = await AsyncStorage.getItem("@game_coop");
      let existingState = existingStateString ? JSON.parse(existingStateString) : {};
      existingState[dayKeyCoop] = dataForToday;
      const dataString = JSON.stringify(existingState);
      await AsyncStorage.setItem("@game_coop", dataString);
    } catch (e) {
      console.log("Could not save data to async storage", e);
    }
  };

  const readState = async () => {
    const dataString = await AsyncStorage.getItem("@game_coop");
    try {
      const data = JSON.parse(dataString);
      const day = data[dayKeyCoop];
      if (day) {
        setPlayer1Rows(day.player1Rows);
        setPlayer2Rows(day.player2Rows);
        setCurCol(day.curCol);
        setCurRow(day.curRow);
        setGameState(day.gameState);
      }
    } catch (e) {
      console.log("Could not parse the state");
    }

    setLoaded(true);
  };

  const checkGameState = () => {
    const currentPlayerRows = isPlayer1Turn ? player1Rows : player2Rows;
    const row = currentPlayerRows[curRow - 1];
  
    if (row.every((letter, i) => letter === letters[i])) {
      setGameState('won');
      // New code to identify the winner
      setWinner(isPlayer1Turn ? 'Player 1' : 'Player 2');
    } else if (curRow === Number_Of_Tries) {
      setGameState('lost');
    }
  };

  const onKeyPressed = (key) => {
    if (gameState !== 'playing') {
      return;
    }

    const currentPlayerRows = copyArray(isPlayer1Turn ? player1Rows : player2Rows);
    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        currentPlayerRows[curRow][prevCol] = "";
        updatePlayerRows(currentPlayerRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === letters.length) {
        updatePlayerRows(currentPlayerRows);
        setCurRow(curRow + 1);
        setCurCol(0);
        setIsPlayer1Turn(!isPlayer1Turn);
      }
      return;
    }

    if (curCol < letters.length) {
      currentPlayerRows[curRow][curCol] = key;
      updatePlayerRows(currentPlayerRows);
      setCurCol(curCol + 1);
    }
  };

  const updatePlayerRows = (updatedRows) => {
    if (isPlayer1Turn) {
      setPlayer1Rows(updatedRows);
    } else {
      setPlayer2Rows(updatedRows);
    }
  };

  const getCellBGColor = (row, col) => {
    const currentPlayerRows = isPlayer1Turn ? player1Rows : player2Rows;
    const letter = currentPlayerRows[row][col];
    if (row >= curRow) {
      return COLORS.grey;
    }
    if (letter === letters[col]) {
      return COLORS.primary;
    }
    if (letters.includes(letter)) {
      return COLORS.secondary;
    }
    return COLORS.darkgrey;
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getAllLettersWithColor = (color) => {
    const currentPlayerRows = isPlayer1Turn ? player1Rows : player2Rows;
    return currentPlayerRows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  const greenCaps = getAllLettersWithColor(COLORS.primary);
  const yellowCaps = getAllLettersWithColor(COLORS.secondary);
  const greyCaps = getAllLettersWithColor(COLORS.darkgrey);

  if (!loaded) {
    return <ActivityIndicator />;
  }

  if (gameState !== 'playing') {
    return (
      <EndScreenCoop
        won={gameState === 'won'}
        winner={winner}
        rows={isPlayer1Turn ? player1Rows : player2Rows}
        getCellBGColor={getCellBGColor}
        navigation={navigation}
      />
    );
  }

  return (
    <LinearGradient style={{ flex: 1 }} colors={['#EAEAEA', '#B7F1B5']}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>WORDLE Coop</Text>
                {/* Displaying which player's turn it is */}
                <Text style={styles.playerTurnText}>{playerTurnText}</Text>
        <View style={styles.map}>
          {(isPlayer1Turn ? player1Rows : player2Rows).map((row, i) => (
            <View key={`row-${i}`} style={styles.row}>
              {row.map((letter, j) => (
                <View
                  key={`cell-${i}-${j}`}
                  style={[
                    styles.cell,
                    {
                      borderColor: isCellActive(i, j) ? COLORS.white : COLORS.darkgrey,
                      backgroundColor: getCellBGColor(i, j),
                    },
                  ]}
                >
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
  );
};

export default WordleCoop;

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

    playerTurnText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.darkgrey,
      marginTop: 10,
      
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