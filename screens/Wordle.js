import { StyleSheet, Text, View, SafeAreaView,ScrollView } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Keyboard from '../src/components/Keyboard'
import colors from '../src/constants'
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';
import { CLEAR } from '../src/constants';
import { ENTER } from '../src/constants';


const Number_Of_Tries = 6;


const copyArray = (arr) => { // making a copy of this aaray 
  return [...arr.map((rows) => [...rows])];
};

const Wordle = () => {

  const word= "hello";
  const letters = word.split("");//returns an array of characters.

  const [rows, setRows] = useState(
    new Array(Number_Of_Tries).fill(new Array(letters.length).fill("")));

  //const rows = new Array(Number_Of_Tries).fill(new Array(letters.length).fill(''))

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);


  const onKeyPressed = (key) => {
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







  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        {rows.map((row, i) =>(
          <View key={'row-${i}'} style={styles.row}>
            {row.map((cell, j) => (
              <View key ={'cell-${i}-${j}'} style={[styles.cell, {borderColor: isCellActive(i,j) ? COLORS.white : COLORS.darkgrey }]}>
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}

          </View>
        ))}
      </View>
      <Keyboard onKeyPressed={onKeyPressed}/>
    </SafeAreaView>
    </LinearGradient>
  )
}

export default Wordle

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
      alignItems: 'center'
    },

    cellText: {
      color: "black",
      fontSize: 28,
      fontWeight: 'bold'
    },
})