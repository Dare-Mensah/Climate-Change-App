import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity, Alert, Switch } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';


const AppNotify = () => {  
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
      getNotificationSetting();
      if (isEnabled) {
        subscribeToLikeNotifications();
        scheduleDailyNotification();
      }
    }, []);
  
    const toggleSwitch = async () => {
        const newSetting = !isEnabled;
        setIsEnabled(newSetting);
        await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newSetting));
        if (newSetting) {
          enableNotifications(); // Enable scheduled notifications
          subscribeToLikeNotifications(); // Subscribe to like notifications
          Alert.alert("Notifications Enabled", "You will now receive notifications.");
        } else {
          disableNotifications(); // Disable all notifications
          Alert.alert("Notifications Disabled", "You have turned off notifications.");
        }
      };
  
    const getNotificationSetting = async () => {
      const setting = await AsyncStorage.getItem('notificationsEnabled');
      if (setting !== null) {
        setIsEnabled(JSON.parse(setting));
      }
    };
  
    const enableNotifications = () => {
      subscribeToLikeNotifications();
      scheduleDailyNotification();
    };
  
    const disableNotifications = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
    };
  
    // Subscribe to like notifications
    const subscribeToLikeNotifications = () => {
      const userId = firebase.auth().currentUser.uid;
      const unsubscribe = firebase.firestore()
        .collection('likes')
        .where('userId', '==', userId)
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              sendLikeNotification(change.doc.data());
            }
          });
        });
      return () => unsubscribe();
    };
  
    // Function to send a notification when the user's blog post is liked
    const sendLikeNotification = async (likeData) => {
      const message = `Your blog post "${likeData.postTitle}" got a new like!`;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Like!",
          body: message,
        },
        trigger: { seconds: 1 },
      });
    };
  
    // Schedule a daily notification
    const scheduleDailyNotification = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Cancel existing notifications first
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Reminder",
          body: "Check out the latest updates on your blog!",
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    };



  return (
    <LinearGradient style={{ flex: 1 }} colors={['#B7F1B5', '#EAEAEA']}>
      <View style={styles.container}>
        <View style={styles.header2}>
          <Text style={styles.Title1}>Notifications</Text>
        </View>
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row' }}>
            <Text>Enable Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default AppNotify

const styles = StyleSheet.create({    header1:{
    marginTop: 40,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
},

header:{
    marginTop: 20,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:5,
},

userInfoSection:{
    paddingHorizontal: 5,
    marginBottom: 25,
},

title:{
    fontSize: 20,
    lineHeight: 20,
    fontWeight: 500,
    marginTop:10,
    color: COLORS.white
},

caption:{
    fontSize:14,
    lineHeight:14,
    fontWeight:'500',
    color: COLORS.white
},  

row:{
    flexDirection: 'row',
    marginBottom: 10,
},

infoBoxWrapper:{
    borderBottomWidth: 1,
    borderTopWidth:1,
    flexDirection: 'row',
    height: 100,
    borderBottomColor:'#dddddd',
    borderTopColor: '#dddddd',
},

infoBox:{
    width: '50%',
    alignItems: 'center',
    justifyContent:'center',
},

menuWrapper:{
    marginTop:10,
},

menuItem:{
    flexDirection:'row',
    paddingVertical:15,
    paddingHorizontal: 10,
},

menuItemText:{
    color:'#777777',
    marginLeft: 20,
    fontWeight:'600',
    fontSize:16,
    lineHeight: 26,
},

container: {
    flex: 1,
},
header2:{
    flex: 0.7,
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
    flex: 3.3,
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
header:{
    marginTop: 40,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
},
detailsContainer: {
    top: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius:30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    flex: 0.4,
},

imageDetails: {
    padding:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position:'absolute',
    bottom:30
},})