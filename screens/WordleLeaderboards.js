import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../config';
import { BarChart } from 'react-native-chart-kit';


const screenWidth = Dimensions.get('window').width;



const WordleLeaderboards = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [averageDuration, setAverageDuration] = useState(0);
  
    useEffect(() => {
      const fetchLeaderboardData = async () => {
        const db = firebase.firestore();
        const gameResultsRef = db.collection('gameResults');
        const snapshot = await gameResultsRef.orderBy('correctWordsCount', 'desc').get();
  
        const fetchedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
  
        // Calculate average duration
        const totalDuration = fetchedData.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const avgDuration = fetchedData.length > 0 ? totalDuration / fetchedData.length : 0;
  
        console.log("Fetched Data: ", fetchedData); // Debugging line to check fetched data
        setLeaderboardData(fetchedData);
        setAverageDuration(avgDuration); // Update average duration state
      };
  
      fetchLeaderboardData();
    }, []);
    
  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={['#EAEAEA', '#B7F1B5']}>
      <Text style={styles.Title1}>Wordle Leaderboard</Text>
      {/* Display average duration */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {leaderboardData.map((entry, index) => (
          <View key={entry.id} style={styles.leaderboardEntry}>
            <Text style={styles.entryText}>{index + 1}.   {entry.correctWordsCount} Words Guessed Correctly</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  )
}

export default WordleLeaderboards

const styles = StyleSheet.create({
    Title1: {
        fontSize: 34,
        marginTop: 20,
        fontWeight: 'bold',
      },
      leaderboardEntry: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        // Add more styling as needed
      },
      entryText: {
        fontSize: 17,
        // Add more styling as needed
      },
})