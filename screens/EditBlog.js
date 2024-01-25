import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { firebase } from '../config';
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const EditBlog = ({ route, navigation }) => {
  const { postId } = route.params;
  const [blogDetails, setBlogDetails] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const postDoc = await firebase.firestore().collection('posts').doc(postId).get();

        if (postDoc.exists) {
          const postData = postDoc.data();
          setBlogDetails(postData);
          setTitle(postData.title);
          setAuthor(postData.author);
          setContent(postData.content);
        } else {
          console.log('Blog post not found.');
        }
      } catch (error) {
        console.error('Error fetching blog details:', error);
      }
    };

    fetchBlogDetails();
  }, [postId]);

  const handleSaveChanges = async () => {
    try {
      // Update the blog post in Firestore
      await firebase.firestore().collection('posts').doc(postId).update({
        title,
        content,
      });

      console.log('Blog post updated successfully!');
      // Navigate back to the BlogDetails screen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Delete the blog post from Firestore
      await firebase.firestore().collection('posts').doc(postId).delete();
      console.log('Blog post deleted successfully!');
  
      // Delete associated comments
      const commentsQuery = firebase.firestore().collection('comments').where('postId', '==', postId);
      const commentsSnapshot = await commentsQuery.get();
      commentsSnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
      console.log('Associated comments deleted successfully!');
  
      // Delete associated likes
      const likesQuery = firebase.firestore().collection('likes').where('postId', '==', postId);
      const likesSnapshot = await likesQuery.get();
      likesSnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
      console.log('Associated likes deleted successfully!');
  
      // Navigate back to the previous screen
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };
  

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this blog post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDelete, style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  if (!blogDetails) {
    return (
      <View style={styles.container}>
       <Text style={{fontSize:40, textAlign:'center', justifyContent:'center', fontWeight: 200}}>Loading.....</Text>
      </View>
    );
  }

  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
    <View style={styles.container}>
      <View>
        <Animatable.Text 
        animation={"fadeInUpBig"}
        style={[styles.title, style={paddingTop:10, marginBottom: 20}]}>Edit Blog </Animatable.Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>


      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Author</Text>
      <TextInput style={styles.input} value={author} editable={false} />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, styles.largeInput]}
        value={content}
        onChangeText={setContent}
        multiline={true}
        textAlignVertical="top"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete Blog</Text>
        </TouchableOpacity>
      </View>
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
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 44,
    marginTop: 5,
    //fontFamily: 'Montserrat',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  largeInput: {
    height: 300,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.third,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.red,
    borderRadius: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditBlog;