import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button,TouchableOpacity,Image, Alert,TextInput, FlatList } from 'react-native';
import { firebase } from '../config';
import COLORS from '../data/colors';

const BlogDetails = ({ route, navigation }) => {
  const localImage = require("../assets/loading.gif")
  const { postId, selectedTopic  } = route.params;
  const [blogDetails, setBlogDetails] = useState(null);
  const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
  const [likes, setLikes] = useState(0); // Local state to track likes count

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsSnapshot = await firebase.firestore()
          .collection('comments')
          .where('postId', '==', postId)
          .orderBy('timestamp', 'desc')
          .get();

        const commentsData = [];

        // Loop through each comment
        for (const commentDoc of commentsSnapshot.docs) {
          const comment = commentDoc.data();

          // Fetch user details from the 'users' collection
          const userDoc = await firebase.firestore().collection('users').doc(comment.userId).get();
          const userData = userDoc.data();

          // Add a new comment object with user details
          commentsData.push({
            ...comment,
            user: {
              userId: comment.userId,
              username: userData ? userData.username : 'Unknown User',
            },
          });
        }

        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    try {
      const currentUser = firebase.auth().currentUser;

      // Add the new comment to the 'comments' collection
      await firebase.firestore().collection('comments').add({
        userId: currentUser.uid,
        postId,
        content: newComment,
        timestamp: new Date(),
      });

      // Clear the comment input field after successful submission
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const postDoc = await firebase.firestore().collection('posts').doc(postId).get();

        if (postDoc.exists) {
          const postData = postDoc.data();
          setBlogDetails(postData);
          setLikes(postData.likes || 0); // Set initial likes count

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

const handleLikePress = async () => {
  try {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      // Handle the case where the user is not authenticated
      return;
    }

    // Check if the user has already liked the post
    const likeDoc = await firebase.firestore().collection('likes').doc(`${currentUser.uid}_${postId}`).get();

    if (!likeDoc.exists) {
      // User has not liked the post, proceed with liking
      setLikes((prevLikes) => prevLikes + 1);

      // Update likes count in Firebase
      await firebase.firestore().collection('posts').doc(postId).update({
        likes: firebase.firestore.FieldValue.increment(1),
      });

      // Add like document to the 'likes' collection
      await firebase.firestore().collection('likes').doc(`${currentUser.uid}_${postId}`).set({
        userId: currentUser.uid,
        postId,
      });
    } else {
      // User has already liked the post
      Alert.alert('You have already liked this post.');
    }
  } catch (error) {
    console.error('Error updating likes:', error);
    // Handle error, show alert, etc.
  }
};

const handleEditCommentPress = (comment) => {
  // Navigate to the EditComment screen with the comment details
  navigation.navigate('EditComment', { comment });
};


const handleDeletePress = async (comment) => {
  if (!comment || !comment.id) {
    console.error('Invalid comment object:', comment);
    return;
  }

  console.log('Comment to delete:', comment);

  // Extract the comment ID
  const commentId = comment.id;

  try {
    // Delete the comment from the 'comments' collection
    await firebase.firestore().collection('comments').doc(commentId).delete();

    // Update the local comments state by removing the deleted comment
    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== commentId)
    );

    // Optionally, you may want to update the UI or show a success message
  } catch (error) {
    console.error('Error deleting comment:', error);
    // Handle error, show alert, etc.
  }
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
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
        Selected Topic: {selectedTopic}
      </Text>
      <Text style={styles.content}>{blogDetails.content}</Text>

      <View style={styles.likesContainer}>
        <Text style={styles.likesText}>{likes} Likes</Text>
        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
          <Text style={styles.likeButtonText}>Like</Text>
        </TouchableOpacity>
      </View>

      {isCurrentUserAuthor && (
        <TouchableOpacity
          onPress={handleEditPress}
          style={[styles.box1, { marginTop: 20, backgroundColor: COLORS.third }]}
        >
          <Text style={[styles.text1, { color: COLORS.white }]}>Edit Blog</Text>
        </TouchableOpacity>
      )}


      <Text style={styles.heading}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text>{item.content}</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>{`By ${item.user.username}`}</Text>

            {/* Render edit and delete buttons for the user's own comments */}
            {item.user.userId === firebase.auth().currentUser?.uid && (
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <TouchableOpacity onPress={() => handleEditCommentPress(item)}>
                  <Text style={{ color: 'blue', marginRight: 8 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                  <Text style={{ color: 'red' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      {/* Add a section to allow users to add comments */}
      <Text style={styles.heading}>Add Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your comment here"
        value={newComment}
        onChangeText={(text) => setNewComment(text)}
      />
      <TouchableOpacity onPress={handleAddComment} style={styles.likeButton}>
        <Text style={styles.likeButtonText}>Add Comment</Text>
      </TouchableOpacity>
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

    likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  likesText: {
    fontSize: 18,
    marginRight: 10,
  },
  likeButton: {
    backgroundColor: COLORS.third,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  likeButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  commentContainer: {
    padding: 8,
    backgroundColor: '#F2F2F2',
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default BlogDetails