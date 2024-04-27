import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDailyWord = () => {
  const [dailyWord, setDailyWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSaveWords = useCallback(async () => {
    setIsLoading(true);
    try {
      // Attempt to fetch the list of words from the Flask server
      let response = await fetch('http://192.168.1.38:3000/climate-news');
      let data = await response.json();
      let fiveLetterWords = data.top_keywords.filter(word => word.length === 5);

      // If the fetch operation is successful, update AsyncStorage with the new words
      await AsyncStorage.setItem('@FiveLetterWords', JSON.stringify(fiveLetterWords));

      // Select a random word from the fetched list
      const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
      const wordForToday = fiveLetterWords[randomIndex];
      setDailyWord(wordForToday);
    } catch (error) {
      console.error('Failed to fetch from server, loading from AsyncStorage', error); // error message if words could not be saved to async storage

      // If fetching from the Flask server fails, try to load the words from AsyncStorage
      const storedWords = await AsyncStorage.getItem('@FiveLetterWords');
      let fiveLetterWords = storedWords ? JSON.parse(storedWords) : [];

      if (fiveLetterWords.length > 0) {
        // Select a random word from the stored list
        const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
        const wordForToday = fiveLetterWords[randomIndex];
        setDailyWord(wordForToday);
      } else {
        console.error('No 5-letter words found in AsyncStorage'); // error message if no words are found
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSaveWords();
  }, [fetchAndSaveWords]);

  return { dailyWord, isLoading };
};

export default useDailyWord;
