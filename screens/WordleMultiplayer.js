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
import MultiplayerEndscreen from './MultiplayerEndscreen';
import useDailyWord from '../data/useDailyWord';
import { useFocusEffect } from '@react-navigation/native';
import {firebase} from '../config'
LogBox.ignoreAllLogs();
import io  from 'socket.io-client';

const WordleMultiplayer = () => {
    const [dailyWord, setDailyWord] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [gameState, setGameState] = useState('waiting_for_players');
    const [socket, setSocket] = useState(null);
    const [guess, setGuess] = useState(''); // State to store the user's guess
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [connectedUsers, setConnectedUsers] = useState([]); // State to store connected users
    const [timer, setTimer] = useState(180); 
    const [gameResult, setGameResult] = useState(null);
    const [gameEnded, setGameEnded] = useState(false);
    const [isOtherPlayerTyping, setIsOtherPlayerTyping] = useState(false);


    const navigation = useNavigation();


    useFocusEffect(
    React.useCallback(() => {
      const hideTabBar = navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }); //hiding tab bar during gameplay 

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
    const newSocket = io('http://192.168.1.38:2000'); // server host url
    setSocket(newSocket);

    newSocket.on('connect', () => {// new socket when a player joins a session
        console.log('Connected to server');
        newSocket.emit('join_game', { username: 'PlayerUsername' });
    });

    newSocket.on('game_state', (data) => {
        console.log('Game State:', data.state);
        setGameState(data.state);
        if (data.state === 'waiting_for_word') { //waiting for word to be generated 
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
            // Start the timer here when the game state is 'ready'
            const timerInterval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(timerInterval);
                        newSocket.emit('timer_finished');
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
    });


    newSocket.on('game_state', (data) => {
        console.log('Game State:', data);
        if (data.state === 'ended') {
            setGameResult(data.message);
            setGameEnded(true);
            setIsLoading(false);
        }
    });
    

    newSocket.on('guess_response', (data) => { //handles if player guesses correctly or not
        if (data.correct) {
            Alert.alert("Correct!", "Your guess was right!");
        } else {
            Alert.alert("Incorrect", "Try again!");
        }
    });

    newSocket.on('player_dropped', (data) => { //creates new socket letting server know a player has dropped 
        Alert.alert("Player Left", data.message);
        setIsLoading(false);
    });

    newSocket.on('time_up', () => { // creates a new socket if player run out of time, the gaem will end 
        setGameResult("Time's up! You did not guess the word in time.");
        setGameEnded(true);
        setIsLoading(false);
    });

    return () => {
        newSocket.close();
    };

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

useEffect(() => {
    if (socket) {
        socket.on('player_typing', (data) => { //socket on letting the python server know player is typing
            setIsOtherPlayerTyping(data.isTyping);
        });

        socket.on('game_state', (data) => {
            console.log('Game State:', data);
        });

        socket.on('guess_response', (data) => { //shows alerts if user guesses corrent or not 
            if (data.correct) {
                Alert.alert("Correct!", "Your guess was right!");
            } else {
                Alert.alert("Incorrect", "Try again!");
            }
        });

        return () => {
            socket.off('player_typing');
            socket.off('game_state');
            socket.off('guess_response');
        };
    }
}, [socket]);

const handleInputChange = (text) => {
    setGuess(text);
    // Emit typing event whenever the user types
    socket.emit('typing', { isTyping: text.length > 0 });
};

// Include typing indication in the UI
const renderTypingIndicator = () => {
    if (isOtherPlayerTyping) {
        return <Text style={styles.typingText}>Another player is typing...</Text>;
    }
    return null;
};




    
const fetchDailyWord = async () => {
    try {
        // Attempt to fetch the word from the server first
        let response = await fetch('http://192.168.1.38:3000/climate-news');
        let data = await response.json();
        let fiveLetterWords = data.top_keywords.filter(word => word.length == 5);
        if (fiveLetterWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
            return fiveLetterWords[randomIndex];
        } else {
            throw new Error("No five-letter words available");
        }
    } catch (error) {
        console.error('Failed to fetch the daily word from the server:', error);
        // If the server fetch fails, try fetching from AsyncStorage
        try {
            const storedWordsJSON = await AsyncStorage.getItem('@FiveLetterWords');
            const storedWords = storedWordsJSON ? JSON.parse(storedWordsJSON) : [];
            if (storedWords.length > 0) {
                const randomIndex = Math.floor(Math.random() * storedWords.length);
                return storedWords[randomIndex];
            } else {
                throw new Error("No words available in storage");
            }
        } catch (storageError) {
            console.error('Failed to fetch the daily word from AsyncStorage:', storageError);
            return 'error'; 
        }
    }
};




    const renderLoadingContent = () => { //multiple rednering depending on the gameState 
        switch (gameState) {
            case 'waiting_for_players':
                return <Text style={styles.loadingText}>Waiting for another player to join...</Text>;
            case 'ready':
                return <Text style={styles.loadingText}>Getting everything ready...</Text>;
            case 'generating_word':
                return <Text style={styles.loadingText}>Generating the word...</Text>;
            default:
                return <Text style={styles.loadingText}>Starting Game...</Text>;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                {renderLoadingContent()}
            </View>
        );
    }


    return (
        <LinearGradient style={styles.container} colors={['#EAEAEA', '#B7F1B5']}>
            <View style={styles.container}>
                <Text style={styles.title}>Wordle Multiplayer</Text>
                {gameEnded ? (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>{gameResult}</Text>
                        <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.third, marginLeft: 10}]} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.buttonText}>Go Home</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text>Time Remaining: {Math.floor(timer / 60)}:{('0' + timer % 60).slice(-2)}</Text>
                        <View style={styles.wordContainer}>
                            <Text style={styles.hint}>Hint: </Text>
                            <Text style={styles.word}>
                                {dailyWord.length > 1 ? `${dailyWord[0]}${'_'.repeat(dailyWord.length - 2)}${dailyWord[dailyWord.length - 1]}` : "Loading word..."}
                            </Text>
                        </View>
                        {isOtherPlayerTyping && <Text>Another player is typing...</Text>}
                        <TextInput
                        style={styles.input}
                        onChangeText={handleInputChange}
                        value={guess}
                        maxLength={5}
                        autoCapitalize="characters"
                        placeholder="Enter your guess"
                        />
                        <TouchableOpacity style={[styles.button, {backgroundColor: COLORS.third, marginLeft: 10}]} onPress={handleGuessSubmit}>
                            <Text style={styles.buttonText}>Submit Guess</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </LinearGradient>
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
        fontSize: 34,
        fontWeight: 'bold',
        letterSpacing: 5,
        textAlign:'center'
    },
    wordContainer: {
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    word: {
        fontSize: 25,
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        width: 200,
        marginVertical: 30,
        textAlign: 'center',  // Centers the text inside the TextInput
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.09,
        shadowRadius: 10,
      },
      buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    hint: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timer: {
        fontSize: 16,
        color: 'red',
        margin: 10,
    },
    resultContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultText: {
        fontSize: 20,
        color: 'black',
        marginBottom: 20,
        fontWeight:'300',
        textAlign:'center',
    },
    loadingText: {
        marginTop: 23,
        fontSize: 18,
        color: COLORS.darkgrey,
        fontWeight:'700',
    },
})