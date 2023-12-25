import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button,TouchableOpacity,Image } from 'react-native';
import { firebase } from '../config';
import COLORS from '../data/colors';

const BlogDetails = ({ route, navigation }) => {
  const localImage = require("../assets/loading.gif")
  const { postId } = route.params;
  const [blogDetails, setBlogDetails] = useState(null);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const postDoc = await firebase.firestore().collection('posts').doc(postId).get();

        if (postDoc.exists) {
          const postData = postDoc.data();
          setBlogDetails(postData);

          // Check if the current user is the author of the blog post
          const currentUser = firebase.auth().currentUser;
          if (currentUser && currentUser.uid === postData.userId) {
            setIsCurrentUserAuthor(true);
          }
        } else {
          console.log('Blog post not found.');
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      }
    };

    fetchBlogDetails();
  }, [postId]);

  const handleEditPress = () => {
    // Navigate to the EditBlog screen with the postId
    navigation.navigate('EditBlog', { postId });
  };

  if (!blogDetails) {
    return (
      <View style={styles.container1}>
      <Text style={{fontSize:40, textAlign:'center', justifyContent:'center', fontWeight: 200}}>Loading.....</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{blogDetails.title}</Text>
      <Text style={styles.author}>{`By ${blogDetails.author}`}</Text>
      <Text style={styles.content}>{blogDetails.content}</Text>

      {isCurrentUserAuthor && (
        <TouchableOpacity onPress={handleEditPress} 
            style={[styles.box1, { marginTop: 50, backgroundColor: COLORS.third }]}
        >
            <Text style={[styles.text1, { color: COLORS.white }]}>Edit Blog</Text>
        </TouchableOpacity>
    
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },

  container1: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  content: {
    fontSize: 18,
  },
  box1:{
    backgroundColor: '#EAEAEA',
    elevation: 2,
    borderRadius: 20,
    width: "59%",
    height: 60,
    shadowColor: '#000000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 65,
    textAlign: 'center'
  },
  text1:{
    alignItems: 'center',
    fontWeight:'bold',
    fontSize: 20,
  
  },
});

export default BlogDetails