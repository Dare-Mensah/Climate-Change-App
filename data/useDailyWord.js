import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDailyWord = () => {
  const [dailyWord, setDailyWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const getDailyWordKey = () => {
    const today = new Date();
    return `@DailyWord:${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  const fetchAndSaveWord = async () => {
    try {
      const response = await fetch('http://192.168.1.38:3000/climate-news');
      const data = await response.json();
      console.log('Fetched data:', data); // Log fetched data for debugging
      
      // Filter for 5-letter words
      const fiveLetterWords = data.top_keywords.filter(word => word.length === 5);
      console.log('Filtered 5-letter words:', fiveLetterWords); // Log filtered words

      // Select a random word
      if (fiveLetterWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
        const wordForToday = fiveLetterWords[randomIndex];
        // Save to AsyncStorage
        await AsyncStorage.setItem(getDailyWordKey(), wordForToday);
        console.log('Saved word to AsyncStorage:', wordForToday); // Log the saved word
        setDailyWord(wordForToday);
      } else {
        console.error('No 5-letter words found');
      }
    } catch (error) {
      console.error('Failed to fetch words from server', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadWord = async () => {
      const storedWord = await AsyncStorage.getItem(getDailyWordKey());
      if (storedWord) {
        console.log('Loaded word from AsyncStorage:', storedWord); // Log the loaded word
        // Word already fetched and stored for today
        setDailyWord(storedWord);
        setIsLoading(false);
      } else {
        // Fetch a new word and save it
        fetchAndSaveWord();
      }
    };

    loadWord();
  }, []); // The empty dependency array ensures this effect runs once after the component mounts

  return { dailyWord, isLoading };
};


export default useDailyWord;
