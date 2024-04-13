import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const MultiplayerEndscreen = ({ route }) => {
  // Retrieve the game result passed via route parameters
  const { gameResult } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over!</Text>
      <Text style={styles.resultText}>
        {gameResult ? 'Congratulations! You guessed the word correctly.' : 'Sorry! Better luck next time.'}
      </Text>
    </View>
  );
};

export default MultiplayerEndscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 18,
    marginTop: 20,
  },
});
