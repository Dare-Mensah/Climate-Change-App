import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput, Pressable, Image, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react';
import { firebase } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../data/colors';

const EditProfile = ({route}) => {

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const navigation = useNavigation();

    const { uid } = firebase.auth().currentUser; // Get user UID
    //const {username} = route.params;
  
    const updateProfile = () => {
        const user = firebase.auth().currentUser;
      
        if (newUsername) {
          // Update username
          user.updateProfile({
            displayName: newUsername,
          })
          .then(() => {
            console.log('Username updated successfully');
          })
          .catch(error => {
            console.error('Error updating username:', error.message);
          });
        }
      
        if (newEmail) {
          // Update email
          user.updateEmail(newEmail)
          .then(() => {
            console.log('Email updated successfully');
            // Send email verification
            sendEmailVerification();
            // Show success alert
            showAlert('Profile Updated', 'Your profile has been updated successfully.');
          })
          .catch(error => {
            console.error('Error updating email:', error.message);
            showAlert('Error', `Failed to update email: ${error.message}`);
          });
        }
      
        // Clear input fields after updating
        setNewUsername('');
        setNewEmail('');
      };
      
      const showAlert = (title, message) => {
        Alert.alert(
          title,
          message,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      };
  
    const sendEmailVerification = () => {
      const user = firebase.auth().currentUser;
  
      user.sendEmailVerification({
        handleCodeInApp: true,
        url: 'https://climatesenseapp.firebaseapp.com', // Replace with your app's URL
      })
      .then(() => {
        console.log('Verification email sent');
      })
      .catch(error => {
        console.error('Error sending verification email:', error.message);
      });
    };


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
          await firebase.firestore().collection('users').doc(uid).delete(); // Delete user document
          await firebase.auth().currentUser.delete(); // Delete user account
          showAlert('Account Deleted', 'Your account has been deleted successfully.');
          navigation.navigate('Home'); // Navigate to the home screen or login screen
        } catch (error) {
          console.error('Error deleting account:', error.message);
          showAlert('Error', 'Failed to delete account. Please try again.');
        }
      };
  return (
    <LinearGradient style={{flex: 1}} colors={['#B7F1B5', '#EAEAEA']}>
    <View style={styles.container}>
        <View style={styles.header1}>
            <Pressable onPress={() => navigation.navigate("Home")}>
                <Image style={{width:40, height:40}} source={require("../assets/back.png")}></Image>
            </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{margin:20}}>
            <View style={{alignItems:'center'}}>
                <TouchableOpacity>
                    <View style={{
                        height:100,
                        width:100, 
                        borderRadius:15,
                        marginTop:30,
                        justifyContent:'center',
                        alignItems:'center'
                        }}>

                        <Avatar.Image
                        source={require('../assets/profileUser.png')}
                        size={120}
                        >
                            <View style={{
                                flex:1,
                                justifyContent:'center',
                                alignItems:'center'
                            }}>          
                            </View> 
                        </Avatar.Image>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{marginTop: 40}}>
        <Text style={[styles.text_footer, {marginTop: 35}]}>Username</Text>
            <View style={styles.action}>
                <Image
                    style={{height: 20, width: 20}} 
                    source={require('../assets/envelope.png')}/>
        
                    <TextInput
                        placeholder='Your Email'
                        style={styles.textInput}
                        autoCapitalize='none'
                        onChangeText={(email) => setNewUsername(email)}
                    />

            </View>

        <Text style={[styles.text_footer, {marginTop: 25}]}>Email</Text>
            <View style={styles.action}>
                <Image
                    style={{height: 20, width: 20}} 
                    source={require('../assets/envelope.png')}/>
        
                    <TextInput
                        placeholder='Your Email'
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
          <Text style={{ color: 'white' }}>Delete Profile</Text>
        </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
        
        
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
})