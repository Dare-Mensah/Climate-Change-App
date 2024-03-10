import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useDailyWord = () => {
  const [dailyWord, setDailyWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('http://192.168.1.38:3000/climate-news');
        const data = await response.json();
        // Filter for 5-letter words
        const fiveLetterWords = data.top_keywords.filter(word => word.length === 5);
        // Select a random word for the day
        if (fiveLetterWords.length > 0) {
          const storedDate = await AsyncStorage.getItem('wordleDate');
          const currentDate = new Date().toISOString().split('T')[0];
          if (storedDate === currentDate) {
            // If the stored date is today, fetch the stored word
            const storedWord = await AsyncStorage.getItem('dailyWord');
            setDailyWord(storedWord);
          } else {
            // Otherwise, select a new word and update AsyncStorage
            const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
            const wordForToday = fiveLetterWords[randomIndex];
            await AsyncStorage.setItem('wordleDate', currentDate);
            await AsyncStorage.setItem('dailyWord', wordForToday);
            setDailyWord(wordForToday);
          }
        } else {
          console.error('No 5-letter words found');
        }
      } catch (error) {
        console.error('Failed to fetch words from server', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  return { dailyWord, isLoading };
};

export default useDailyWord;
