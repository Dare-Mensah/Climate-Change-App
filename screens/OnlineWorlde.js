import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OnlineWorlde = () => {
  return (
    <View>
      <Text>OnlineWorlde</Text>
    </View>
  )
}

export default OnlineWorlde

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