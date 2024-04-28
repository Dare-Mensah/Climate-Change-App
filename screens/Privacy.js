import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper'
import { useNavigation, useIsFocused } from '@react-navigation/native';
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import io  from 'socket.io-client';

const Privacy = () => { //privacy/ security information
  return (
    <LinearGradient style={{flex: 1}} colors={['#B7F1B5','#EAEAEA']}>
    <View style={styles.container}>
            <View style={styles.header2}>
            <Text style={styles.Title1}>Privacy and Security</Text>
        </View>
        <Animatable.View 
        animation={"fadeInUpBig"}
        style={styles.footer}>
        <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Privacy Notice</Text>
        <Text style={styles.noticeText}>Climate Sense is comitted tonprotecting user data. This notice outlines the practices with the collection and use of your personal data. Uwsing Climate Sense you will agress to the collection and use of data in accordance with this policy.</Text>

        <Text style={styles.sectionTitle}>Data Collection</Text>
        <Text style={styles.noticeText}>When data is collected provided to us directly such as when you create an account. This information may include but is not limited to:</Text>
        <Text style={styles.noticeTextOne}> - Username and Password</Text>
        <Text style={styles.noticeTextOne}> - Email Address</Text>
        <Text style={styles.noticeTextOne}> - Activity Logs/ Wordle Gameplay Data</Text>

        <Text style={styles.sectionTitle}>Use of Information</Text>
        <Text style={styles.noticeText}>Data we collect is used to:</Text>
        <Text style={styles.noticeTextOne}> - Facilitating social features to allow users to interact and share content</Text>
        <Text style={styles.noticeTextOne}> - Analysing app usage and user behaviour to further enhance the application.</Text>


        </ScrollView>
        </Animatable.View>
    </View>
    </LinearGradient>
  )
}

export default Privacy

const styles = StyleSheet.create({
    header1:{
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
    },
    noticeText:{
        paddingHorizontal:10,
        fontSize: 20,
        fontWeight:'300'
    },
    noticeTextOne:{
        fontSize: 20,
        paddingHorizontal: 20,
        fontWeight:'300'
    },
    sectionTitle:{
        marginHorizontal: 20,
        marginVertical:25,
        fontSize: 20,
        fontWeight:'600'
      },
})