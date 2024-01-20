import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity,RefreshControl,backgroundImage } from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../data/colors'
import * as Animatable from 'react-native-animatable';
const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to track whether the data is being refreshed

  const fetchNewsArticles = async () => {
    try {
      const url = 'https://newsdata.io/api/1/news';
      const params = {
        country: 'gb',
        category: 'environment',
        apiKey: 'pub_36628886cd9bf05e85630c6f3e42168a0eb32'
      };
      
      const response = await axios.get(url, { params });
      if (response.data && response.data.results) {
        setNewsArticles(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching news articles:', error);
    }
  };


  useEffect(() => {
    fetchNewsArticles();

  }, [refreshing]);

  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
        <View>
          <Animatable.Text 
          animation={"fadeInUpBig"}
          style={[styles.Title1, style={paddingHorizontal:20, paddingTop:10}]}>News </Animatable.Text>
        </View>

        <FlatList
  data={newsArticles}
  keyExtractor={(item, index) => 'news-' + index}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.newsArticleContainer}
      onPress={() => Linking.openURL(item.link)} // Use Linking to open the news article link
    >
      <Text style={styles.newsArticleTitle}>{item.title}</Text>
      <Text style={styles.newsArticleDescription}>{item.description}</Text>
    </TouchableOpacity>
  )}
/>
    </LinearGradient>
  )
}

export default News

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#CDFADB',
        paddingHorizontal: 10,
        paddingTop:50
    },
    Title1:{
        fontSize: 34,
        marginTop: 30,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',

    },

    newsArticleContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    newsArticleTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    newsArticleDescription: {
      fontSize: 14,
      color: 'grey',
    },

})