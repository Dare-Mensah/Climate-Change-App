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
        // Select a random word
        if (fiveLetterWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
          const wordForToday = fiveLetterWords[randomIndex];
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

    fetchWords();
  }, []); // The empty dependency array ensures this effect runs once after the component mounts

  return { dailyWord, isLoading };
};

export default useDailyWord;
