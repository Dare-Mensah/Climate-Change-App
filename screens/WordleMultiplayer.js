import { StyleSheet, Text, View, SafeAreaView,ScrollView, LogBox, Alert, ActivityIndicator, TouchableOpacity, Pressable, Image, TextInput} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
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
import EndScreen from './EndScreen';
import useDailyWord from '../data/useDailyWord';
import { useFocusEffect } from '@react-navigation/native';
LogBox.ignoreAllLogs();
import io  from 'socket.io-client';

const WordleMultiplayer = () => {
    const [dailyWord, setDailyWord] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [gameState, setGameState] = useState('waiting_for_players');
    const [socket, setSocket] = useState(null);
    const [guess, setGuess] = useState(''); // State to store the user's guess
    const [message, setMessage] = useState('');
    const navigation = useNavigation();


    useFocusEffect(
    React.useCallback(() => {
      const hideTabBar = navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });

      return () => navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex', height: 60, ...defaultTabBarStyle } });
    }, [navigation])
  );

  const defaultTabBarStyle = {
    backgroundColor: '#fff',
    height: 60,
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    elevation: 0,
    borderRadius: 15,
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  };

  useEffect(() => {
    const newSocket = io('http://192.168.1.38:2000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join_game', { username: 'PlayerUsername' });
    });

    newSocket.on('game_state', (data) => {
        console.log('Game State:', data.state);
        setGameState(data.state);
        if (data.state === 'waiting_for_word') {
            if (!data.word) {
                fetchDailyWord().then(word => {
                    setDailyWord(word);
                    setIsLoading(false);
                    newSocket.emit('word_generated', { word });
                });
            }
        } else if (data.state === 'ready') {
            setDailyWord(data.word);
            setIsLoading(false);
        }
    });


    newSocket.on('guess_response', (data) => {
        if (data.correct) {
            Alert.alert("Correct!", "Your guess was right!");
        } else {
            Alert.alert("Incorrect", "Try again!");
        }
    });


    newSocket.on('player_dropped', (data) => {
        Alert.alert("Player Left", data.message);
        setIsLoading(false);
    });

    return () => newSocket.close();
}, []);



const handleGuessSubmit = () => {
    if (guess.length === 5) {
        // Emit the guess to the server
        socket.emit('submit_guess', { guess });
        setGuess(''); // Clear the input field after submitting
    } else {
        Alert.alert("Error", "Please enter a 5-letter word.");
    }
};




    
    const fetchDailyWord = async () => {
        try {
            let response = await fetch('http://192.168.1.38:3000/climate-news');
            let data = await response.json();
            let fiveLetterWords = data.top_keywords.filter(word => word.length === 5);
            const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
            return fiveLetterWords[randomIndex];
        } catch (error) {
            console.error('Failed to fetch the daily word:', error);
            return 'error';
        }
    };



    const renderLoadingContent = () => {
        switch (gameState) {
            case 'waiting_for_players':
                return <Text>Waiting for another player to join...</Text>;
            case 'ready':
                return <Text>Getting everything ready...</Text>;
            case 'generating_word':
                return <Text>Generating the word...</Text>;
            default:
                return <Text>Loading...</Text>;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                {renderLoadingContent()}
            </View>
        );
    }

    return (
        <View style={styles.container1}>
            <Text style={styles.title}>Wordle Multiplayer</Text>
            <Text style={styles.word}>{dailyWord}</Text>
            <TextInput
                style={styles.input}
                onChangeText={setGuess}
                value={guess}
                maxLength={5}
                autoCapitalize="characters"
                onSubmitEditing={handleGuessSubmit}
                placeholder="Enter your guess"
            />
            <TouchableOpacity style={styles.button} onPress={handleGuessSubmit}>
                <Text style={styles.buttonText}>Submit Guess</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EndScreen')}>
                <Text style={styles.buttonText}>Finish Game</Text>
            </TouchableOpacity>
        </View>
    );
};


export default WordleMultiplayer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    container1: {
        flex: 1,
        textAlign:'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    word: {
        marginTop: 20,
        fontSize: 20,
        letterSpacing: 3,
        textTransform: 'uppercase'
    },
        input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200,
        textAlign: 'center'
    },
    button: {
        marginTop: 20,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    }
})