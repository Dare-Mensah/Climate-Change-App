import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native'
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



const Profile = ({route}) => {

    const navigation = useNavigation();


  return (
    <LinearGradient style={{flex: 1}} colors={['#B7F1B5','#EAEAEA']}>
    <View style={styles.container}>
        <View style={styles.header1}>
        <Text style={styles.Title1}>Settings</Text>
        </View>


        <Animatable.View 
        animation={"fadeInUpBig"}
        style={styles.footer}>
        <View style={styles.menuWrapper}>

            <TouchableRipple onPress={() => navigation.navigate("EditProfile")}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/edit.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>Edit Profile</Text>
                </View>
            </TouchableRipple>

            <TouchableRipple onPress={() => navigation.navigate("Achievements")}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/trophy.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>Achievements</Text>
                </View>
            </TouchableRipple>

            {/** 
            <TouchableOpacity onPress={() => navigation.navigate("AppNotify")}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/bell.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>Notifications</Text>
                </View>
            </TouchableOpacity>
            */}

            <TouchableRipple onPress={() => navigation.navigate("Privacy")}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/lock.png')} style={{height: 28, width: 28}}/>
                    <Text style={styles.menuItemText}>Privacy and Security</Text>
                </View>
            </TouchableRipple>

            {/** 
            <TouchableRipple onPress={() => navigation.navigate("Accessibility")}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/lock.png')} style={{height: 28, width: 28}}/>
                    <Text style={styles.menuItemText}>Accessibility</Text>
                </View>
            </TouchableRipple>
            */}

            <TouchableRipple onPress={() => navigation.navigate("About")}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/help.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>About</Text>
                </View>
            </TouchableRipple>


            <TouchableRipple onPress={() => firebase.auth().signOut()}>
                <View style={styles.menuItem1}>
                    <Text style={[styles.menuItemText, {color:'red'}]}>Logout</Text>
                </View>
            </TouchableRipple>

        </View>
        </Animatable.View>
    </View>
    </LinearGradient>
  )
}

export default Profile

const styles = StyleSheet.create({
    header1:{
        flex: 0.8,
        justifyContent:'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
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


    menuItem1:{
        flexDirection:'row',
        paddingVertical:15,
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
        flex: 1,
        justifyContent:'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    text_header:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    footer:{
        flex: 3,
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
    },

    Title1:{
        fontSize: 39,
        marginTop: 20,
        //fontFamily: 'Montserrat',
        fontWeight: 'bold',
  
    },

})