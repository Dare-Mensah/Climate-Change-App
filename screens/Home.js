import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity,RefreshControl,backgroundImage, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import COLORS from '../data/colors'
import DATA from '../data/data1'
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'
import Profile from './Profile';
import { Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

const {width} = Dimensions.get('screen')

const topicBackgroundImages = {
  Technology: require('../assets/TechImage3.jpg'),
  Food: require('../assets/Food4Image.jpg'),
  Transport: require('../assets/TransportImage2.jpg'),
  Finance: require('../assets/FinanceImage2.jpg'),
  Wordle: require('../assets/Worlde.png'),
  General: require('../assets/General.jpg'),
  // Add more mappings for other topics
};


const BlogPostCard = ({ post, onPress, latestLikes, commentCount }) => {
  const backgroundImage = topicBackgroundImages[post.topic];

  return (
    <TouchableOpacity onPress={onPress} style={styles.blogCardContainer}>
      <ImageBackground source={backgroundImage} style={styles.blogCardImage}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={styles.blogCardDetailBox}>
            {/* Topic and Likes on the top row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom:15 }}>
              <Text style={styles.blogPostTopic}>{post.topic}</Text>
              <View style={{flexDirection:'row'}}>
              <Text style={styles.blogPostLikes}>{`${latestLikes}`}</Text>
              <Image style={{height: 20, width:20,marginLeft: 4}} source={require('../assets/heart.png')}/>
              </View>
            </View>

            {/* Title and Author with Divider */}
            <Text style={styles.blogPostTitle}>{post.title}</Text>
            <Divider style={styles.divider} />
            <Text style={styles.blogPostAuthor}>{`By ${post.author}`}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const fetchLeastCarbonFootprintData = async () => {
  try {
    const snapshot = await firebase.firestore().collection('carbon_footprints')
      .orderBy('totalCarbonFootprint', 'asc') // Order by the total carbon footprint in ascending order
      .limit(1) // Get only the first document (user with least carbon footprint)
      .get();

    if (!snapshot.empty) {
      const leastFootprintData = snapshot.docs[0].data();
      return leastFootprintData; // Return the least carbon footprint data
    }
  } catch (error) {
    console.error('Error fetching least carbon footprint data:', error);
  }
};




const Home = ({route}) => {

  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('Latest'); // Set the default topic to 'Latest'
  const [refreshing, setRefreshing] = useState(false); // State to track whether the data is being refreshed
  const [carbonFootprintData, setCarbonFootprintData] = useState(null);
  const [leastCarbonFootprintData, setLeastCarbonFootprintData] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [username, setUsername] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
      const user = firebase.auth().currentUser;
      if (user !== null) {
          // The displayName property might not be immediately available if it was recently updated.
          // Ensure your app handles this gracefully.
          const name = user.displayName ? user.displayName : 'User'; // Fallback to 'User' if displayName is null
          setUsername(name);
      }
  }, []);



  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
  
    // Listen for new likes on the user's blog posts
    const unsubscribe = firebase.firestore()
      .collection('likes')
      .where('userId', '==', userId) // Adjust this condition based on your data model
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            sendLikeNotification(change.doc.data());
          }
        });
      });
  
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);


  const toggleNotifications = async () => {
    const newSetting = !notificationsEnabled;
    setNotificationsEnabled(newSetting);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newSetting));
    
    // Log the new setting to the console
    console.log(`Notifications are now ${newSetting ? "enabled" : "disabled"}.`);
    
    // Show an alert to the user
    Alert.alert(
      "Notifications " + (newSetting ? "Enabled" : "Disabled"),
      "You have " + (newSetting ? "enabled" : "disabled") + " notifications.",
      [
        { text: "OK" }
      ]
    );
  };

  useEffect(() => {
    const loadPreferences = async () => {
      const notifEnabled = await AsyncStorage.getItem('notificationsEnabled');
      if (notifEnabled !== null) {
        setNotificationsEnabled(JSON.parse(notifEnabled));
      }
    };
  
    loadPreferences();
  }, []);


  
  
  // Function to send a notification when the user's blog post is liked
  const sendLikeNotification = async (likeData) => {
    if (!notificationsEnabled) return;
    const message = `Your blog post "${likeData.postTitle}" got a new like!`;
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Like!",
        body: message,
      },
      trigger: { seconds: 1 },
    });
  };

  

  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    scheduleDailyNotification(userId);
  }, []);


  
  const scheduleDailyNotification = async (userId) => {
    if (!notificationsEnabled) return;

    try {
      // Fetch total likes
      const likesSnapshot = await firebase.firestore().collection('likes')
        .where('userId', '==', userId)
        .get();
      const totalLikes = likesSnapshot.size;
  
      // Fetch total comments
      const commentsSnapshot = await firebase.firestore().collection('comments')
        .where('blogOwnerId', '==', userId)
        .get();
      const totalComments = commentsSnapshot.size;
  
      // Prepare the notification message
      const message = `You have ${totalLikes} likes and ${totalComments} comments on your blogs.`;
  
      // Schedule the notification
      await Notifications.cancelAllScheduledNotificationsAsync(); // Cancel existing notifications
  
      const trigger = new Date();
      trigger.setHours(9, 0, 0); // Set the time to 9:00 AM
      if (trigger <= new Date()) {
        // If the time is in the past for today, schedule for the next day
        trigger.setDate(trigger.getDate() + 1);
      }
  
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Morning!",
          body: message,
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    } catch (error) {
      console.error('Error scheduling daily notification:', error);
    }
  };
  


  const fetchNewsArticles = async () => {
    try {
      const url = 'https://newsdata.io/api/1/news';
      const params = {
        country: 'gb',
        category: 'environment',
        apiKey: 'pub_36628886cd9bf05e85630c6f3e42168a0eb32',
      };
      
      const response = await axios.get(url, { params });
      if (response.data && response.data.results) {
        setNewsArticles(response.data.results.slice(0, 4)); // Get only the first four articles
      }
    } catch (error) {
      console.error('Error fetching news articles:', error);
    }
  };


  const NewsArticleCard = ({ article }) => {
    // Function to truncate the description
    const truncateDescription = (description, maxLength = 100) => {
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
      }
      return description;
    };

    // Function to truncate text
    const truncateText = (text, maxLength = 100) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

    
  
  return (
    <TouchableOpacity onPress={() => Linking.openURL(article.link)} style={styles.newsArticleCardContainer}>
      <View style={styles.newsArticleCardDetailBox}>
        <Text style={styles.newsArticleTitle}>
          {truncateText(article.title, 80)} {/* Truncate title with a max length of 50 */}
        </Text>
        <Text style={styles.newsArticleDescription}>
          {truncateDescription(article.description, 150)} {/* Truncate description with a max length of 100 */}
        </Text>
      </View>
    </TouchableOpacity>
  );
  };
  
  

  useEffect(() => {
    fetchNewsArticles();
    fetchCarbonFootprintData();
    fetchLeastCarbonFootprintData().then(leastFootprintData => {
      setLeastCarbonFootprintData(leastFootprintData);
    });
  }, [refreshing]);





  
  const fetchCarbonFootprintData = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
  
      const snapshot = await firebase
        .firestore()
        .collection('carbon_footprints')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
  
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCarbonFootprintData(data);
  
        // Additional data for electricity, transportation, and gas usage
        console.log('Electricity Usage:', data.electricityUsage);
        console.log('Transportation Usage:', data.transportationUsage);
        console.log('Gas Usage:', data.gasUsage);
      }
      else {
        // No carbon footprint data found, you can guide the user to input their details
        console.log('No carbon footprint data found. Please input your details.');
      }
    } catch (error) {
      console.error('Error fetching carbon footprint data:', error);
    }
  };





  useEffect(() => {
    // Assuming you store user details under a 'users' collection in Firebase Firestore
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users')
      .doc(userId).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          setName(userData.username); // Set the username in state
        } else {
          console.log('User does not exist');
        }
      }).catch(error => {
        console.error("Error fetching user data: ", error);
      });
  }, []);



  useEffect(() => {
    fetchCarbonFootprintData();
    fetchBlogPosts();
  }, [refreshing]); // Add refreshing to the dependency array

  const fetchBlogPosts = async () => {
    try {
      const postsSnapshot = await firebase.firestore().collection('posts').get();
      const postsData = postsSnapshot.docs.map(async (doc) => {
        const postData = doc.data();
  
        // Fetch latest likes
        const likesSnapshot = await firebase.firestore().collection('likes').where('postId', '==', doc.id).get();
        const latestLikes = likesSnapshot.size;
  
        // Fetch comment count
        const commentsSnapshot = await firebase.firestore().collection('comments').where('postId', '==', doc.id).get();
        const commentCount = commentsSnapshot.size;
  
        return {
          id: doc.id,
          ...postData,
          latestLikes,
          commentCount,
        };
      });
  
      // Use Promise.all to wait for all the asynchronous operations to complete
      const postsWithData = await Promise.all(postsData);
      postsWithData.sort((a, b) => b.date - a.date);
      setBlogPosts(postsWithData);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setRefreshing(false);
    }
  };


  

  const handleRefresh = () => {
    setRefreshing(true); // Set refreshing to true when the user triggers the refresh
  };
  


  const prepareGraphData = () => {
    const labels = ['My Footprint', 'Least Footprint'];
    const datasets = [{
      data: [
        carbonFootprintData?.totalCarbonFootprint || 0,
        leastCarbonFootprintData?.totalCarbonFootprint || 0
      ],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }];
  
    return { labels, datasets };
  };





  const filterPostsByTopic = () => {
    if (!selectedTopic || selectedTopic === 'All') {
      // Show all posts or latest posts if 'All' is selected
      return blogPosts.slice().sort((a, b) => b.date - a.date);
    } else if (selectedTopic === 'Latest') {
      // Show only the top 4 latest posts
      return blogPosts.slice().sort((a, b) => b.date - a.date).slice(0, 4);
    } else {
      // Show posts filtered by selected topic
      return blogPosts.filter((post) => post.topic === selectedTopic);
    }
  };


  const wordleOptions = [
    { id: '1', title: 'SinglePlayer Mode', navigateTo: 'Wordle', bgImage: require('../assets/pic1.jpg'), iconImage: require('../assets/single-player.png') },
    { id: '2', title: 'Co-op Mode', navigateTo: 'CoopWordleInfo', bgImage: require('../assets/pic2.jpg'), iconImage: require('../assets/coop.png') },
    { id: '3', title: 'Endless Mode', navigateTo: 'EndlessWordleInfo', bgImage: require('../assets/pic4.jpg'), iconImage: require('../assets/puzzle-game.png') },
  ];




  const WordleOption = ({ item }) => {
    return (
      <Pressable onPress={() => navigation.navigate(item.navigateTo)} style={styles.wordleOption}>
        <ImageBackground source={item.bgImage} style={styles.wordleOptionBackground}>
          <View style={styles.wordleOptionView}>
            <Image source={item.iconImage} style={styles.wordleOptionIcon} />
            <Text style={styles.wordleOptionText}>{item.title}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    );
  };


  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
  };

  const createBlogButtonPressed = () => {
    // Navigate to the BlogScreen for creating a new blog
    navigation.navigate('BlogScreen');
  };


    const navigation = useNavigation();

    const {currentStreak, winPercentage, playedState }= route.params || {}
    const [statsSaved, setStatsSaved] = useState(false);

    const [name, setName] = useState('');

    const [email] = useState('');




    useEffect(() => {
      firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists){
          setName(snapshot.data())
        }
        else {
          console.log('User does not exists')
        }
      })
    }, [])
  

    const Card =({Tips}) => {
      return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Tips", Tips)}>
      <ImageBackground style={styles.cardImage} source={Tips.image}>
        <Image style={{height: 30, width:30, }} source={Tips.icon}/>
        <Text style={{color: COLORS.white, fontSize: 15, fontWeight:'800', marginTop: 40}}>{Tips.name}</Text>
      </ImageBackground>
      </TouchableOpacity>
      )
    }
  
    return (
  
      <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
        <StatusBar translucent={false} style={"light"} color = "white"/>

        <View style={styles.header}>

        <View style={{marginTop: 20, flexDirection:'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", {username: name.username, email})}>
            <Image style={{height: 35, width:35, paddingTop: 5, marginLeft: 18}} source={require('../assets/circle-user.png')}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleNotifications}>
          <Image
            style={{ height: 40, width: 40, marginTop: 20, marginRight: 20 }}
            source={notificationsEnabled ? require('../assets/notification.png') : require('../assets/notification_disable.png')}
          />
        </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }>

        <View>
          <Animatable.Text 
          animation={"fadeInUpBig"}
          style={[styles.Title1, style={paddingHorizontal:20, paddingTop:10}]}>Dashboard</Animatable.Text>
        </View>
        <View>
            <Text style={[styles.Title2, style={paddingHorizontal:20}]}>Welcome, {username}</Text>
        </View>



        <Text style={styles.sectionTitle}>Carbon Footprint</Text>


  {carbonFootprintData ? (
    <>
      <View style={{flexDirection: 'row'}}>
      <View style={{flexDirection: 'column'}}>
        <Pressable onPress={() => navigation.navigate("CarbonFootPrintCalc")}>
        <Animatable.View
        animation={"fadeInUpBig"}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          width:'95%',
          height: 150,
          marginTop: 5,
          marginLeft:20,}}>

          <Text 
          style={{
          paddingHorizontal: 10,
          marginTop: 10, 
          fontWeight: 400}}>
         Electricity Use:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 40,
          marginTop: 17,
          fontWeight: '600'
          }}>{carbonFootprintData.electricityUsage}</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 18,
          marginTop: 15,
          fontWeight: '200'
          }}>kWh</Text>


        </Animatable.View>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("CarbonFootPrintCalc")}>
        <Animatable.View
        animation={"fadeInUpBig"}
        delay={5}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          width:'95%',
          height: 150,
          marginTop: 20,
          marginLeft:20,}}>

          <Text 
          style={{
          paddingHorizontal: 10,
          marginTop: 10, 
          fontWeight: 400}}>
          Gas Usage:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 40,
          marginTop: 17,
          fontWeight: '600'
          }}>{carbonFootprintData.gasUsage}</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 18,
          marginTop: 15,
          fontWeight: '200'
          }}>gallons</Text>


        </Animatable.View>
        </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate("CarbonFootPrintCalc")}>
        <Animatable.View
        animation={"fadeInUpBig"}
        delay={9}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          width:'72%',
          height: 319,
          marginTop: 5,
          marginLeft:55,}}>

          <Text 
          style={{
          paddingHorizontal: 10,
          marginTop: 10, 
          fontWeight: 400}}>
          Total CarbonFootprint:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 50,
          marginTop: 37,
          fontWeight: '600'
          }}>{carbonFootprintData.totalCarbonFootprint}</Text>


          <Text 
          style={{
          textAlign: 'center',
          fontSize: 24,
          marginTop: 12,
          fontWeight: '200'
          }}>CO2e</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 18,
          marginTop: 37,
          fontWeight: '200'
          }}>{carbonFootprintData.timestamp.toDate().toLocaleDateString()}</Text>


        </Animatable.View>
        </Pressable>

      </View>
    </>
  ) : (
    <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No carbon footprint data found. Please input your details.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("CarbonFootPrintCalc")}>
            <Text style={[styles.inputDetailsLink, {fontWeight:'bold'}]}>Input Details</Text>
          </TouchableOpacity>
        </View>
  )}


    <View style={{flexDirection:'row'}}>
    <Text style={[styles.sectionTitle, {marginTop:50}]}>Filter Blogs by Topic</Text>
    <TouchableOpacity onPress={() => navigation.navigate("BlogScreen")}>
        <Text style={[styles.createBlogLink, {marginTop:55, fontWeight:'bold'}]}>Create One!</Text>
    </TouchableOpacity>
    </View>

    <FlatList
    contentContainerStyle={{ paddingLeft: 20 }}
    horizontal
    showsHorizontalScrollIndicator={false}
    data={['Latest', 'General','Wordle','Technology', 'Food', 'Transport', 'Finance']}
    keyExtractor={(item) => item}
    renderItem={({ item }) => (
      <Pressable
        style={[
          styles.topicButton,
          {
            backgroundColor:
              selectedTopic === item ? COLORS.third : item === 'Latest' ? COLORS.third : COLORS.gray,
          },
        ]}
        onPress={() => handleTopicChange(item)}
      >
        <Text style={{ color: COLORS.black }}>{item}</Text>
      </Pressable>
    )}
  />

<FlatList
  contentContainerStyle={{ paddingLeft: 20 }}
  horizontal
  showsHorizontalScrollIndicator={false}
  data={filterPostsByTopic()}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <BlogPostCard
      post={item}
      latestLikes={item.latestLikes}
      commentCount={item.commentCount}
      onPress={() => navigation.navigate('BlogDetails', { postId: item.id, selectedTopic })}
    />
  )}
/>


  {/* Conditional rendering for no blogs in the selected category */}
  {filterPostsByTopic().length === 0 && (
    <View style={styles.noBlogsContainer}>
      <Text style={styles.noBlogsText}>
        There are no blogs in this category.
      </Text>
      <TouchableOpacity onPress={createBlogButtonPressed}>
        <Text style={[styles.createBlogLink, {fontWeight:'bold'}]}>Create one!</Text>
      </TouchableOpacity>
    </View>
  )}


  <Text style={styles.sectionTitle}>Wordle</Text>

<FlatList
  contentContainerStyle={{ paddingLeft: 20 }}
  horizontal
  showsHorizontalScrollIndicator={false}
  data={wordleOptions}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <WordleOption item={item} />}

/>



    <View style={{flexDirection:'row'}}>
    <Text style={[styles.sectionTitle, {marginTop:50}]}>Environment News</Text>
    <TouchableOpacity onPress={() => navigation.navigate("News")}>
        <Text style={[styles.createBlogLink, {marginTop:55, fontWeight:'bold'}]}>See More!</Text>
    </TouchableOpacity>
    </View>

    <FlatList
  contentContainerStyle={{ paddingLeft: 20 }}
  horizontal
  showsHorizontalScrollIndicator={false}
  data={newsArticles}
  keyExtractor={(item, index) => 'news-' + index}
  renderItem={({ item }) => <NewsArticleCard article={item} />}
/>

      <Text style={styles.sectionTitle}>Tips</Text>
      
        <View>
          <FlatList 
          contentContainerStyle={{paddingLeft:20}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          renderItem={({item}) => <Card Tips={item}/>}
          />
        </View>

        </ScrollView>
      </LinearGradient>
    )
}

export default Home

const styles = StyleSheet.create({
    Title1:{
        fontSize: 34,
        marginTop: 20,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',

    },

    Title2:{
      fontSize: 19,
      //fontFamily: 'Montserrat',
      fontWeight: '200',

  },
    blogPostTopic: {
      fontSize:15,
      fontWeight:'500'
    },

    blogCardImage: {
      height: 240,
      width: '100%',
      flex: 1, // Add this line
      marginBottom:10
    },

  blogCardDetailBox: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 17, // Increase padding
    borderRadius: 10,
    margin: 10,
    marginBottom:10
    // Increase the size of the detail box as needed
  },
  blogPostTitle: {
    fontSize: 28, // Adjust as needed
    fontWeight: 'bold',
    color: COLORS.black,
    
    // other styles...
  },
  blogPostAuthor: {
    fontSize: 14,
    color: COLORS.darkgrey,
    // other styles...
  },
  divider: {
    marginVertical: 10, // Adjust space around the divider
    backgroundColor: COLORS.darkgrey, // Choose a color for the divider
  },
    blogPostLikes: {
      fontSize: 14,
      // other styles...
    },



    createBlogButton: {
      backgroundColor: '#FFFFFF',
      elevation: 4,
      borderRadius: 25,
      width: '90%',
      height: 150,
      marginTop: 20,
      marginLeft: 20,
      justifyContent: 'center', // Align the text in the center vertically
      alignItems: 'center', // Align the text in the center horizontally
    },
    
    createBlogButtonImage: {
      borderRadius: 25, // Match the borderRadius of the button
      resizeMode: 'cover', // or 'contain' based on your preference
    },
    
    createBlogButtonText: {
      paddingHorizontal: 10,
      marginTop: 10,
      fontWeight: 400,
      color: '#fff', // Assuming you want white text, change as needed
      fontSize: 18, // Adjust the font size as needed
    },


    wordleOption: {
      height: 160,
      width: width / 2.4,
      marginRight: 20,
      padding: 20,
      overflow: "hidden",
      borderRadius: 40,
      backgroundColor: '#FFFFFF', // or any other color you prefer
      elevation: 10,
      marginBottom:20,
    },


    wordleOptionView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    wordleOptionText: {
      color: '#FFFFFF', // Changed to black for better visibility
      fontSize: 18,
      fontWeight: '800',
      textAlign:'center',
    },
    

    header:{
      //paddingVertical: 21,
      //paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomLeftRadius:30,
      borderEndEndRadius:20
    },
  
    headerTitle:{
      color: COLORS.white,
      fontSize: 23,
      fontWeight: '400',
    },
  
    inputContainer:{
      height: 60,
      width:'100%',
      backgroundColor: COLORS.white,
      borderRadius:10,
      position: 'absolute',
      top: 90,
      flexDirection: 'row',
      paddingHorizontal: 20,
      alignItems:'center',
      elevation: 12,
  
    },
  
    sectionTitle:{
      marginHorizontal: 20,
      marginVertical:25,
      fontSize: 20,
      fontWeight:'300'
    },
  
    cardImage:{
      height: 160,
      width: width /2.9,
      marginRight: 20,
      padding: 20,
      overflow:"hidden",
      borderRadius: 40,
      
    },
    othercards:{
      width:width -40,
      height: 200,
      marginRight: 20, 
      borderRadius: 10, 
      overflow:"hidden",
      marginLeft: 20,
      elevation:10,
    },

    blogCardContainer: {
      backgroundColor: COLORS.white,
      elevation: 4,
      borderRadius: 20,
      width: 250,
      marginRight: 20,
      overflow: 'hidden',
      marginBottom:10
    },
    blogCardImage: {
      height: 290,
      width: '100%',
      
    },



    topicButton: {
      marginRight: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: COLORS.darkgrey,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20
    },
  
    noBlogsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 40,
      flexDirection:'row',
    },
  
    noBlogsText: {
      fontSize: 14,
      color: COLORS.black,
      textAlign: 'center',
      fontWeight:'200',
    },
  
    createBlogLink: {
      fontSize: 14,
      paddingHorizontal:7,
      color: COLORS.third,
      textDecorationLine: 'underline',
    },


    environmentLink: {
      fontSize: 14,
      color: COLORS.primary,
      textDecorationLine: 'underline',
    },

    noDataContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
  
    noDataText: {
      fontSize: 14,
      color: COLORS.black,
      textAlign: 'center',
      paddingHorizontal:20,
      fontWeight:'200'
    },
  
    inputDetailsLink: {
      fontSize: 14,
      paddingHorizontal: 7,
      color: COLORS.third,
      textDecorationLine: 'underline',
    },

    addImageButtonContainer: {
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
      marginTop: 30, // Add some top margin
      marginBottom: 20, // Add some bottom margin
    },
    addImage: {
      height: 40,
      width: 40,
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
      fontWeight: 300,
    },



    newsArticleCardContainer: {
      backgroundColor: COLORS.white,
      elevation: 4,
      borderRadius: 20,
      width: 250,
      marginRight: 20,
      overflow: 'hidden',
      marginBottom: 10,
    },
    
    newsArticleCardDetailBox: {
      padding: 17,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    
    newsArticleTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.black,
      marginBottom: 10,
    },
    
    newsArticleDescription: {
      fontSize: 14,
      color: COLORS.darkgrey,
    },

    wordleOption: {
      height: 160,
      width: width / 2.4,
      marginRight: 20,
      borderRadius: 40,
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
      elevation: 10,
      marginBottom: 20,
    },
  
    wordleOptionBackground: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    wordleOptionIcon: {
      height: 40,
      width: 40,
      marginBottom: 10, // Adjust as needed
    },
  
    wordleOptionView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    wordleOptionText: {
      color: COLORS.black,
      fontSize: 18,
      fontWeight: '800',
      textAlign: 'center',
    },

})