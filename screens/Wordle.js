import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Keyboard from '../src/components/Keyboard'
import colors from '../src/constants'
import * as Animatable from 'react-native-animatable';

const Number_Of_Tries = 6;

const Wordle = () => {

  const word= "hello";
  const letters = word.split('')//returns an array of characters.

  const rows = new Array(Number_Of_Tries).fill(new Array(letters.length).fill('a'))
  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WORDLE</Text>

      <View style={styles.map}>
        {rows.map((row) =>(
          <View style={styles.row}>
            {row.map((cell) => (
              <View style={styles.cell}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}

          </View>
        ))}
      </View>
      <Keyboard/>
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