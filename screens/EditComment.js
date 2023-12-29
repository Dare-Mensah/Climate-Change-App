import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {firebase} from '../config'

const EditComment = ({route, navigation}) => {
    const { comment } = route.params;
    const [editedComment, setEditedComment] = useState(comment.content);

    const commentRef = firebase.firestore().collection('comments').doc(comment.id);
    console.log('Comment ID to update:', comment.id);
  
    const handleSave = async () => {
        try {
            
          // Step 1: Get the reference to the comment document
          const commentRef = firebase.firestore().collection('comments').doc(comment.id);
    
          const commentDoc = await commentRef.get();
          if (!commentDoc.exists) {
            console.log('Comment document does not exist:', comment.id);
            // Handle the case where the comment document does not exist
            return;
          }
          
          // Continue with the update
          await commentRef.update({
            content: editedComment,
          })
    
          // Step 3: Navigate back to the BlogDetails screen
          navigation.goBack();
    
          // Show success alert
          Alert.alert('Success', 'Comment has been successfully edited!');
        } catch (error) {
          console.error('Error saving edited comment:', error);
    
          navigation.goBack();
          // Handle error and show an error alert
          Alert.alert('Error', 'Failed to edit the comment. Please try again.');
        }
      };
      
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Edit your comment..."
          value={editedComment}
          onChangeText={(text) => setEditedComment(text)}
        />
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };
export default EditComment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
      },
      input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
      },
      saveButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
      },
      saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
})