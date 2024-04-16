import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Image, Pressable} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../data/colors';
import * as ImagePicker from 'expo-image-picker'
import { firebase } from '../config';
import { FlatList } from 'react-native-gesture-handler';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const BlogScreen = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null); // New state for selected topic
  const navigation = useNavigation();

  const handleSavePost = async () => {
    // Check if all fields are filled and a topic is selected
    if (!title.trim() || !author.trim() || !content.trim() || !selectedTopic) {
      Alert.alert("Missing Fields", "Please fill in all fields and select a topic.");
      return;
    }
  
    try {
      // Create a new post object
      const post = {
        title,
        author,
        content,
        timestamp: new Date(),
        topic: selectedTopic,
      };
  
      // Get the current user's ID from Firebase Auth
      const userId = firebase.auth().currentUser.uid;
  
      // Add the post to the 'posts' collection in Firestore
      await firebase.firestore().collection('posts').add({
        userId,
        ...post,
      });
  
      // Reset the form fields after successful submission
      setTitle('');
      setAuthor('');
      setContent('');
      setSelectedTopic(null);
  
      Alert.alert("Post Shared", "Your post has been shared successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate('Home'), // Navigate back to Home screen
        },
      ]);
  
      console.log('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={['#EAEAEA', '#B7F1B5']}>
      <Animatable.Text
        animation={"fadeInUpBig"}
        style={[styles.Title1, { paddingHorizontal: 10, paddingTop: 10, marginBottom: 20 }]}>
        Create A New Blog
      </Animatable.Text>

      <ScrollView showsVerticalScrollIndicator={false}>


        <View style={styles.formContainer}>
          <Text style={[styles.text_footer, { marginTop: 35 }]}>Title</Text>
          <View style={styles.action}>
            <Image
              style={{ height: 20, width: 20 }}
              source={require('../assets/title.png')} />

            <TextInput
              placeholder='Enter Title'
              style={styles.textInput}
              autoCapitalize='none'
              onChangeText={(text) => setTitle(text)}
              autoCorrect={false}
            />
          </View>

          <Text style={[styles.text_footer, { marginTop: 35 }]}>Author</Text>
          <View style={styles.action}>
            <Image
              style={{ height: 20, width: 20 }}
              source={require('../assets/circle-user.png')} />

            <TextInput
              placeholder='Enter Author'
              style={styles.textInput}
              autoCapitalize='none'
              onChangeText={(text) => setAuthor(text)}
              autoCorrect={false}
            />
          </View>

          <Text style={[styles.text_footer, { marginTop: 35, marginBottom: 20 }]}>Content</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}  // Adjust the height here
            placeholder="Enter content"
            multiline={true}
            value={content}
            onChangeText={(text) => setContent(text)}
            textAlignVertical="top"  // Move placeholder to the top
          />

          {/* Add the topic selection FlatList */}
          <Text style={[styles.text_footer, { marginTop: 35, marginBottom: 20 }]}>Select Topic</Text>
          <FlatList
            data={['General','Wordle','Technology', 'Food', 'Transport', 'Finance' ]} // Add more topics as needed
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
              <Pressable
                style={[styles.topicButton, { backgroundColor: selectedTopic === item ? COLORS.third : COLORS.gray }]}
                onPress={() => setSelectedTopic(item)}
              >
                <Text style={{ color: COLORS.black}}>{item}</Text>
              </Pressable>
            )}
          />

          <Pressable
            onPress={handleSavePost}
            style={[styles.button, { marginTop: 50, backgroundColor: COLORS.third, marginBottom:100 }]}
          >
          
            <Text style={[styles.text1, { color: COLORS.white, }]}>Share Post</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};



export default BlogScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  Title1:{
    fontSize: 34,
    marginTop: 20,
    //fontFamily: 'Montserrat',
    fontWeight: 'bold',
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
},

largeInput: {
  height: 100,  // Adjust the height as needed
},
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formContainer: {

  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle:{
    paddingHorizontal: 5,
    marginVertical:25,
    fontSize: 20,
    fontWeight:'300'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 10
  },
  text_footer:{
    color: COLORS.black,
    fontSize: 18,
},
action: {
  flexDirection: 'row',
  marginTop: 10,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.black,
  paddingBottom: 5
},

textInput: {
  flex: 1,
  marginTop: Platform.OS === 'android' ? 0 : -6, // Corrected typo here
  paddingLeft: 10,
  color: COLORS.darkgrey,
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
  textAlign:'center',

},
button: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 20,
  elevation: 2,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.09,
  shadowRadius: 10,
  textAlign: 'center',
},
});
