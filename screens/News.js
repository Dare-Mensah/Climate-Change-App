import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const News = () => {
  return (
    <View style={styles.container}>
      <Text>News</Text>
    </View>
  )
}

export default News

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#CDFADB',
        paddingHorizontal: 10,
        paddingTop:50
    },
    Title1:{
        fontSize: 24,
        marginTop: 30,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',

    },
})