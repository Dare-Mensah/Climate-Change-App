import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput, FlatList, ScrollView } from 'react-native';
import { firebase } from '../config';
import COLORS from '../data/colors';
import { LinearGradient } from 'expo-linear-gradient';

const BlogDetails = ({ route, navigation }) => {
  const { postId, selectedTopic } = route.params;
  const [blogDetails, setBlogDetails] = useState(null);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [hasLiked, setHasLiked] = useState(false);

  const heartIcon = require("../assets/heartNotFill.png");
  const heartFilledIcon = require("../assets/heart.png");

  const currentUser = firebase.auth().currentUser;

  const fetchComments = async () => {
    try {
      const commentsSnapshot = await firebase.firestore()
        .collection('comments')
        .where('postId', '==', postId)
        .orderBy('timestamp', 'desc')
        .get();

      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        user: {}
      }));

      for (const comment of commentsData) {
        const userDoc = await firebase.firestore().collection('users').doc(comment.userId).get();
        comment.user = userDoc.exists ? userDoc.data() : { username: 'Unknown User' };
      }

      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    // Check if the user has liked the post and fetch blog details
    const fetchBlogAndLikeDetails = async () => {
      // Fetch blog details
      const postDoc = await firebase.firestore().collection('posts').doc(postId).get();
      if (postDoc.exists) {
        const postData = postDoc.data();
        setBlogDetails(postData);
        setLikes(postData.likes || 0);
        setIsCurrentUserAuthor(currentUser && currentUser.uid === postData.userId);
      } else {
        console.log('Blog post not found.');
      }

      // Check if the user has liked the post
      if (currentUser) {
        const likeDoc = await firebase.firestore().collection('likes').doc(`${currentUser.uid}_${postId}`).get();
        setHasLiked(likeDoc.exists);
      }
    };

    fetchBlogAndLikeDetails();
  }, [postId, currentUser]);

  const handleLikePress = async () => {
    if (!currentUser || hasLiked) return;
    try {
      await firebase.firestore().collection('posts').doc(postId).update({
        likes: firebase.firestore.FieldValue.increment(1),
      });
      await firebase.firestore().collection('likes').doc(`${currentUser.uid}_${postId}`).set({
        userId: currentUser.uid,
        postId,
      });
      setLikes(likes + 1);
      setHasLiked(true);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) return;
    try {
      await firebase.firestore().collection('comments').add({
        userId: currentUser.uid,
        postId,
        content: newComment,
        timestamp: new Date(),
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await firebase.firestore().collection('comments').doc(commentId).delete();
      Alert.alert('Comment Deleted', 'Your comment has been successfully deleted.');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      Alert.alert('Error', 'An error occurred while deleting the comment.');
    }
  };

  const handleEditPress = () => {
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
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
    <View style={styles.container}>
      <Text style={styles.title}>{blogDetails.title}</Text>
      <Text style={styles.author}>{`By ${blogDetails.author}`}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.topic}>Selected Topic: {selectedTopic}</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.content}>{blogDetails.content}</Text>
      </ScrollView>

      <View style={styles.likesAndEditContainer}>
        {/* Likes section */}
        <View style={styles.likesContainer}>
          <Text style={styles.likesText}>{likes}</Text>
          <TouchableOpacity onPress={handleLikePress}>
            <Image
              source={hasLiked ? heartFilledIcon : heartIcon}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Edit button (only if current user is the author) */}
        {isCurrentUserAuthor && (
          <TouchableOpacity onPress={handleEditPress} style={[styles.editButton]}>
            <Text style={styles.buttonText}>Edit Blog</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.heading}>Comments</Text>
      <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.commentContent}>{item.content}</Text>
              <Text style={styles.commentAuthor}>{`By ${item.user.username}`}</Text>
              {item.userId === currentUser?.uid && (
                <TouchableOpacity
                  onPress={() => handleDeleteComment(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

      <Text style={styles.heading}>Add Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your comment here"
        value={newComment}
        onChangeText={(text) => setNewComment(text)}
      />
      <TouchableOpacity onPress={handleAddComment} style={styles.commentButton}>
        <Text style={styles.buttonText}>Add Comment</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 44,
    marginTop: 5,
    //fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  author: {
    fontSize: 16,
    color: COLORS.darkgrey,
    marginBottom: 16,
  },
  topic: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.black,
  },
  content: {
    fontSize: 16,
    color: COLORS.darkgrey,
    marginBottom: 20,
  },

  
  likesAndEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space out likes and edit button
    marginBottom: 20,
    marginTop:20,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  likesText: {
    fontSize: 16,
    color: COLORS.black,
    marginRight: 10,
  },
  likeButton: {
    backgroundColor: COLORS.third,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 0,
    
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  commentContainer: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentContent: {
    fontSize: 14,
    color: COLORS.darkgrey,
  },
  commentAuthor: {
    fontSize: 12,
    color: COLORS.darkgrey,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.darkgrey,
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  heartIcon: {
    width: 20,
    height: 20,
  },
    deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default BlogDetails