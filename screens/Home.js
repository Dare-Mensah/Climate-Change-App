import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity,RefreshControl } from 'react-native'
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

const {width} = Dimensions.get('screen')



const BlogPostCard = ({ post, onPress, latestLikes, commentCount }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.blogCardContainer}>
      <Image source={{ uri: post.imageURL }} style={styles.blogCardImage} />
      <View style={styles.blogCardContent}>
        <Text style={styles.blogPostTitle}>{post.title}</Text>
        <Text style={styles.blogPostAuthor}>{`By ${post.author}`}</Text>
        <View style={{flexDirection: 'row'}}>
        <Text style={[styles.blogPostLikes, {paddingRight:75}]}>{`Likes: ${latestLikes}`}   </Text>
        <Text style={styles.blogPostComments}>{`Comments: ${commentCount}`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};




const Home = ({route}) => {

  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('Latest'); // Set the default topic to 'Latest'
  const [refreshing, setRefreshing] = useState(false); // State to track whether the data is being refreshed
  const [carbonFootprintData, setCarbonFootprintData] = useState(null);


  useEffect(() => {
    fetchCarbonFootprintData();
  }, []);
  
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
            <Image style={{height: 40, width:40, paddingTop: 5, marginLeft: 18}} source={require('../assets/circle-user.png')}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => firebase.auth().signOut()}>
            <Image style={{height: 40, width:40, marginTop: 20, marginRight: 20}} source={require('../assets/SignOut.png')}/>
          </TouchableOpacity>

        </View>

        <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }>

        <View>
          <Animatable.Text 
          animation={"fadeInUpBig"}
          style={[styles.Title1, style={paddingHorizontal:20, paddingTop:10}]}>Dashboard </Animatable.Text>
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
          marginTop: 67,
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
            <Text style={styles.inputDetailsLink}>Input Details</Text>
          </TouchableOpacity>
        </View>
  )}



  <Text style={styles.sectionTitle}>Wordle</Text>


  <View style={{flexDirection: 'row'}}>
        <Pressable onPress={() => navigation.navigate("Wordle")}>
        <Animatable.View
        animation={"fadeInUpBig"}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          width:'95%',
          height: 150,
          marginLeft:20,}}>

          <Text 
          style={{
          paddingHorizontal: 10,
          marginTop: 10, 
          fontWeight: 400}}>
         SinglePlayer Wordle:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 40,
          marginTop: 17,
          fontWeight: '600'
          }}>Play</Text>


        </Animatable.View>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("WordleCoop")}>
        <Animatable.View
        animation={"fadeInUpBig"}
        delay={5}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          width:'95%',
          height: 150,
          marginLeft:20,}}>

          <Text 
          style={{
          paddingHorizontal: 10,
          marginTop: 10, 
          fontWeight: 400}}>
          Coop Player Wordle</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 40,
          marginTop: 17,
          fontWeight: '600'
          }}>Play</Text>

        </Animatable.View>
        </Pressable>
        </View>


        <Text style={styles.sectionTitle}>Filter by Topic</Text>
        <FlatList
    contentContainerStyle={{ paddingLeft: 20 }}
    horizontal
    showsHorizontalScrollIndicator={false}
    data={['Latest', 'Wordle','Technology', 'Food', 'Transport', 'Finance']}
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
        <Text style={styles.createBlogLink}>Create one!</Text>
      </TouchableOpacity>
    </View>
  )}
     
        <Text style={styles.sectionTitle}>Blogs</Text>
        <View>

        <Pressable onPress={() => navigation.navigate("BlogScreen")}
        style={{        
          backgroundColor: '#FFFFFF',
          elevation: 4,
          borderRadius: 25,
          width:'90%',
          height: 150,
          marginTop: 20,
          marginLeft:20,}}>

          <Text 
          style={{
          paddingHorizontal: 10,
          marginTop: 10, 
          fontWeight: 400}}>
          Blogs:</Text>

        </Pressable>

        </View>



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
    },
    blogCardImage: {
      height: 120,
      width: '100%',
    },
    blogCardContent: {
      padding: 10,
    },
    blogPostTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    blogPostAuthor: {
      fontSize: 14,
      color: COLORS.darkgrey,
    },

    topicButton: {
      marginRight: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
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
    },
  
    createBlogLink: {
      fontSize: 14,
      paddingHorizontal:7,
      color: COLORS.third,
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
    },
  
    inputDetailsLink: {
      fontSize: 14,
      paddingHorizontal: 7,
      color: COLORS.third,
      textDecorationLine: 'underline',
    },


})