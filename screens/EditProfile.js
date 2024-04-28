import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput, Pressable, Image, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { firebase } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../data/colors';
import * as ImagePicker from 'expo-image-picker'
import storage from '@react-native-firebase/storage';
import * as Animatable from 'react-native-animatable';

const EditProfile = ({route}) => {

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const navigation = useNavigation();



    const { uid } = firebase.auth().currentUser; // Get user UID
    //const {username} = route.params;

    const updateProfile = async () => {
        const user = firebase.auth().currentUser;
      
        try {
          // Update Firebase Auth user profile
          if (newUsername) {
              await user.updateProfile({
                  displayName: newUsername,
              });
              console.log('Username updated in Auth successfully');
              
              // Update username in Firestore database
              await firebase.firestore().collection('users').doc(user.uid).update({
                  username: newUsername, // Assuming 'username' is the field name in your Firestore collection
              });
              console.log('Username updated in Firestore successfully');
          }
      
          if (newEmail) {
            await user.updateEmail(newEmail);
            console.log('Email updated successfully in Auth');
            
            // Optionally, update email in Firestore database if you're storing it there
            await firebase.firestore().collection('users').doc(user.uid).update({
                email: newEmail,
            });
            console.log('Email updated in Firestore successfully');
            
            // Send email verification if necessary
            await sendEmailVerification();
            
            // Show success alert
            showAlert('Profile Updated', 'Your profile has been updated successfully.');
        }
      
        // Clear input fields after updating
        setNewUsername('');
        setNewEmail('');
    } catch (error) {
        console.error('Error updating profile:', error.message);
        showAlert('Error', `Failed to update profile: ${error.message}`);
    }
};

const showAlert = (title, message) => {
    Alert.alert(
        title,
        message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
    );
};
      


    const sendEmailVerification = async () => {
      const user = firebase.auth().currentUser;

      try {
          await user.sendEmailVerification({
              handleCodeInApp: true,
              url: 'https://climatesenseapp.firebaseapp.com', // app firebase url
          });
          console.log('Verification email sent');
      } catch (error) {
          console.error('Error sending verification email:', error.message);
      }
    };


    const deleteUserProfile = async () => {
      const uid = firebase.auth().currentUser.uid;
    
      try {
        // Delete likes associated with the user
        await deleteUserDataFromCollection('likes', uid);
    
        // Delete comments associated with the user
        await deleteUserDataFromCollection('comments', uid);
    
        // Delete posts associated with the user
        await deleteUserDataFromCollection('posts', uid);
    
        // Delete carbon footprint data associated with the user
        await deleteUserDataFromCollection('carbon_footprints', uid);
    
        // Delete user document from 'users' collection
        await firebase.firestore().collection('users').doc(uid).delete();
    
        // Delete user account
        await firebase.auth().currentUser.delete();
    
        showAlert('Account Deleted', 'Your account and all associated data have been deleted successfully.');
        navigation.navigate('Home'); // Navigate to home or login screen
      } catch (error) {
        console.error('Error deleting user profile:', error.message);
        showAlert('Error', 'Failed to delete user profile. Please try again.');
      }
    };
    
    const deleteUserDataFromCollection = async (collectionName, userId) => {
      const querySnapshot = await firebase.firestore().collection(collectionName).where('userId', '==', userId).get();
      querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
    };
  
    //delete confirmation alert
    const deleteProfile = () => {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => confirmDelete(),
            style: 'destructive',
          },
        ]
      );
  };


    
  const confirmDelete = async () => {
    try {
        await deleteUserProfile(); // Call deleteUserProfile here
        showAlert('Account Deleted', 'Your account has been deleted successfully.');
        navigation.navigate('Home'); // Navigate to the home screen or login screen
    } catch (error) {
        console.error('Error deleting account:', error.message);
        showAlert('Error', 'Failed to delete account. Please try again.');
    }
}



      
  return (
    <LinearGradient style={{flex: 1}} colors={['#B7F1B5','#EAEAEA']}>
    <View style={styles.container}>
            <View style={styles.header2}>
            <Text style={styles.Title1}>Edit Profile</Text>
        </View>
        <Animatable.View 
        animation={"fadeInUpBig"}
        style={styles.footer}>

        <Text style={[styles.text_footer, {marginTop: 35}]}>Username</Text>
            <View style={styles.action}>
                <Image
                    style={{height: 20, width: 20}} 
                    source={require('../assets/envelope.png')}/>
        
                    <TextInput
                        placeholder='Your Username'
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(email) => setNewUsername(email)}
                    />

            </View>

        <Text style={[styles.text_footer, {marginTop: 25}]}>Verify Email</Text>
            <View style={styles.action}>
                <Image
                    style={{height: 20, width: 20}} 
                    source={require('../assets/envelope.png')}/>
        
                    <TextInput
                        placeholder='Type in your current email address'
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(email) => setNewEmail(email)}
                    />

            </View>


        {/* Button to update profile */}
        <TouchableOpacity onPress={updateProfile} style={styles.commandButton}>
          <Text style={{ color: 'white' }}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={deleteProfile} style={styles.DeletecommandButton}>
          <Text style={{ color: 'white' }}>Delete Account</Text>
        </TouchableOpacity>

        </Animatable.View>
    </View>
    </LinearGradient>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header1:{
        marginTop: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:20,
    },
    text_footer:{
        color: '#05375a',
        fontSize: 18,
    },
    commandButton:{
        padding:15,
        borderRadius:10,
        backgroundColor: COLORS.third,
        alignItems:'center',
        marginTop:10,
    },


    DeletecommandButton:{
        padding:15,
        borderRadius:10,
        backgroundColor: COLORS.red,
        alignItems:'center',
        marginTop:10,
    },

    panel:{
        padding:20,
        backgroundColor:'#FFFFFF',
        paddingTop:20,
    },

    header:{
        backgroundColor:'#FFFFFF',
        shadowColor:'#333333',
        shadowOffset:{width:-1, height:-3},
        shadowRadius:2,
        shadowOpacity:0.4,
        paddingTop:20,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
    },

    panelHeader:{
        alignItems:'center'
    },

    panelHandle:{
        width:40,
        height:8,
        borderRadius:4,
        backgroundColor:'#00000040',
        marginBottom:10,

    },

    panelTitle:{
        fontSize:27,
        height:35,
    },

    panelSubtitle:{
        fontSize:14,
        color: 'grey',
        height:30,
        marginBottom:10,
    },

    panelButton:{
        padding:13,
        borderRadius:10,
        backgroundColor:'#FF6347',
        alignItems:'center',
        marginVertical:7
    },

    panelButtonTitle:{
        fontSize:17, 
        fontWeight:'bold',
        color:'white',
    },

    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.darkgrey,
        paddingBottom: 5,
        marginBottom: 20,
    },

    actionError:{
        flexDirection:'row',
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#FF0000',
        paddingBottom:5,
    },

    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'andriod' ? 0 : -6,
        paddingLeft: 10,
        color: COLORS.darkgrey,
    },

        imageContainer: {
        height: 100,
        width: 100,
        borderRadius: 15,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },

    header2:{
      flex: 1.5,
      justifyContent:'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 50,
  },
  Title1:{
      fontSize: 34,
      marginTop: 20,
      //fontFamily: 'Montserrat',
      fontWeight: 'bold',

  },
  footer:{
    flex: 2.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
},
text_footer:{
    color: '#05375a',
    fontSize: 18,
},

header2:{
  flex: 0.7,
  justifyContent:'flex-end',
  paddingHorizontal: 20,
  paddingBottom: 50,
},
})