import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EndlessWordleMedData = () => {
  const [dailyWords, setDailyWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  useEffect(() => {
    const fetchAndStoreWords = async () => {
      const todayString = getTodayDateString();
      try {
        // First try to load the words from AsyncStorage
        const storedWordsJson = await AsyncStorage.getItem(`@dailyWords:${todayString}`);
        if (storedWordsJson) {
          setDailyWords(JSON.parse(storedWordsJson));
        } else {
          // If there are no words stored for today, fetch new words and store them
          const response = await fetch('http://192.168.1.38:3000/climate-news');
          const data = await response.json();
          // Filter for 5-letter words and limit the selection, for example to 10
          const fiveLetterWords = data.top_keywords.filter(word => word.length === 5).slice(0, 10);
          if (fiveLetterWords.length > 0) {
            await AsyncStorage.setItem(`@dailyWords:${todayString}`, JSON.stringify(fiveLetterWords));
            setDailyWords(fiveLetterWords);
          } else {
            console.error('No 5-letter words found');
          }
        }
      } catch (error) {
        console.error('Failed to fetch words or store them in AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndStoreWords();
  }, []); // The empty dependency array ensures this effect runs once after the component mounts

  return { dailyWords, isLoading };
};

export default EndlessWordleMedData;
