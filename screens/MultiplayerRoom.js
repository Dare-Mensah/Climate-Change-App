import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { db } from '../config2';
import { ref, set, push, onValue, update } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const MultiplayerRoom = () => {
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);
  const navigation = useNavigation();

  // Function to create a new game room
  const createGameRoom = async () => {
    const newRoomRef = push(ref(db, 'gameRooms'));
    await set(newRoomRef, {
      roomId: newRoomRef.key,
      players: [],
      isFull: false,
    });
    setRoomId(newRoomRef.key);
    listenForRoomUpdates(newRoomRef.key);
  };

  // Function to join a game room
  const joinGameRoom = async (roomId) => {
    const roomRef = ref(db, `gameRooms/${roomId}`);
    update(roomRef, (currentRoom) => {
      if (!currentRoom.players.includes(/* your player ID */)) {
        currentRoom.players.push(/* your player ID */);
        if (currentRoom.players.length === 2) {
          currentRoom.isFull = true;
        }
      }
      return currentRoom;
    });
  };

  // Listener for room updates
  const listenForRoomUpdates = (roomId) => {
    const roomRef = ref(db, `gameRooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      const roomData = snapshot.val();
      if (roomData) {
        setPlayers(roomData.players);
        if (roomData.isFull) {
          navigation.navigate('WordleMultiplayer', { roomId: roomId });
        }
      }
    });
  };

  useEffect(() => {
    // Example: create a room when the component mounts
    createGameRoom();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Multiplayer Room: {roomId}</Text>

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