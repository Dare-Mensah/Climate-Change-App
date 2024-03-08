import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDailyWord = () => {
  const [word, setWord] = useState('');

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
      const storedData = await AsyncStorage.getItem('wordOfTheDay');
      let storedWord = storedData ? JSON.parse(storedData) : null;

      // Check if the stored word is for today, if so use it
      if (storedWord && storedWord.date === today) {
        setWord(storedWord.word);
      } else {
        // Fetch a new word and store it
        try {
          const response = await fetch('https://random-word-api.vercel.app/api?words=500&length=5');
          const newWord = await response.json();
          if (newWord.length > 0) {
            setWord(newWord[0]);
            await AsyncStorage.setItem('wordOfTheDay', JSON.stringify({ word: newWord[0], date: today }));
          }
        } catch (error) {
          console.error('Error fetching new word:', error);
        }
      }
    };

    fetchWordOfTheDay();
  }, []);

  return word;
};

export default useDailyWord;
