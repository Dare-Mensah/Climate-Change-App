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

const Privacy = () => {
  return (
    <LinearGradient style={{flex: 1}} colors={['#B7F1B5','#EAEAEA']}>
    <View style={styles.container}>
            <View style={styles.header2}>
            <Text style={styles.Title1}>Privacy and Security</Text>
        </View>
        <Animatable.View 
        animation={"fadeInUpBig"}
        style={styles.footer}>

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
})