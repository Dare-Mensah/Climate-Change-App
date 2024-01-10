import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { db } from '../config2';
import { ref, set, push, onValue, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const MultiplayerRoom = () => {
  const [players, setPlayers] = useState([]);
  const navigation = useNavigation();
  const roomRef = ref(db, 'multiplayerRoom/');

  useEffect(() => {
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Firebase Data:", data); // Log to check the data structure
      if (data) {
        setPlayers(Object.values(data));
      } else {
        setPlayers([]);
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("Players State Updated:", players); // Log to check the updated state
  }, [players]);

  const joinRoom = () => {
    const newPlayerRef = push(roomRef);
    set(newPlayerRef, { player: 'Player' + (players.length + 1) });

    if (players.length === 1) {
      navigation.navigate('MultiplayerWordle'); // Replace 'MultiplayerWordle' with your multiplayer Wordle screen name
    }
  };

  return (
    <View style={styles.container}>
      <Text>Multiplayer Room: </Text>
      <Button title="Join Room" onPress={joinRoom} />
      {players.map((player, index) => (
        <Text key={index}>{player.player}</Text>
      ))}
    </View>
  );
};

export default MultiplayerRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add more styles as needed
});