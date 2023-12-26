import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity } from 'react-native'
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
const {width} = Dimensions.get('screen')



const BlogPostCard = ({ post, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.blogCardContainer}>
      <Image source={{ uri: post.imageURL }} style={styles.blogCardImage} />
      <View style={styles.blogCardContent}>
        <Text style={styles.blogPostTitle}>{post.title}</Text>
        <Text style={styles.blogPostAuthor}>{`By ${post.author}`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const Home = ({route}) => {

  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const postsSnapshot = await firebase.firestore().collection('posts').get();
        const postsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        postsData.sort((a, b) => b.date - a.date);
        setBlogPosts(postsData);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  // Only take the latest 4 blog posts
  const latestBlogPosts = blogPosts.slice(0, 4);

  const filterPostsByTopic = () => {
    if (!selectedTopic) {
      return blogPosts;
    }
    return blogPosts.filter((post) => post.topic === selectedTopic);
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

        <ScrollView showsVerticalScrollIndicator={false}>

        <View>
          <Animatable.Text 
          animation={"fadeInUpBig"}
          style={[styles.Title1, style={paddingHorizontal:20, paddingTop:10}]}>Dashboard </Animatable.Text>
        </View>

        <Text style={styles.sectionTitle}>Wordle</Text>

        
        <View 
        style={{flexDirection: 'row'}}>

        <View style={{flexDirection: 'column'}}>
        <Pressable onPress={() => navigation.navigate("Wordle")}>
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
         Current Streak:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 40,
          marginTop: 17,
          fontWeight: '600'
          }}></Text>


        </Animatable.View>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Wordle")}>
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
          Games Played:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 40,
          marginTop: 17,
          fontWeight: '600'
          }}></Text>


        </Animatable.View>
        </Pressable>
        </View>
        
        <Pressable onPress={() => navigation.navigate("Wordle")}>
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
          Wins:</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 50,
          marginTop: 67,
          fontWeight: '600'
          }}>%</Text>

          <Text 
          style={{
          textAlign: 'center',
          fontSize: 18,
          marginTop: 37,
          fontWeight: '200'
          }}>Your win percentage</Text>


        </Animatable.View>
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

      {/* Display latest 4 blog posts */}
      <Text style={styles.sectionTitle}>Latest Blogs</Text>
      <FlatList
        contentContainerStyle={{ paddingLeft: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={latestBlogPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BlogPostCard
            post={item}
            onPress={() => navigation.navigate('BlogDetails', { postId: item.id })}
          />
        )}
      />



        <Text style={styles.sectionTitle}>Filter by Topic</Text>
        <FlatList
          contentContainerStyle={{ paddingLeft: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Technology', 'Food', 'Transport', 'Finance']} // Add more topics as needed
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.topicButton,
                { backgroundColor: selectedTopic === item ? COLORS.third : COLORS.gray },
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
      onPress={() => navigation.navigate('BlogDetails', { postId: item.id })}
    />
  )}
/>
  
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
    },
  
    noBlogsText: {
      fontSize: 18,
      color: COLORS.black,
      textAlign: 'center',
    },
  
    createBlogLink: {
      fontSize: 18,
      color: COLORS.third,
      textDecorationLine: 'underline',
    },


})