import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import COLORS from '../data/colors';
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'
const Profile = () => {

    const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <View style={styles.header1}>
            <Pressable onPress={() => navigation.navigate("Home")}>
                <Image style={{width:40, height:40}} source={require("../assets/back.png")}></Image>
            </Pressable>
        </View>

        <View style={styles.header2}>
            <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Avatar.Image
                        source={require('../assets/profileUser.png')}
                        size={80}
                    />
                    <View style={{marginLeft:20, marginTop:20}}>
                        <Title style={styles.title}>Dare</Title>
                        <Caption style={styles.caption}>darepaul.mensah@gmail.com</Caption>
                    </View>
                </View>
            </View>
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

            <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/headset.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>Help and Support</Text>
                </View>
            </TouchableRipple>

            <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/bell.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>Notifications</Text>
                </View>
            </TouchableRipple>

            <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/lock.png')} style={{height: 28, width: 28}}/>
                    <Text style={styles.menuItemText}>Privacy and Security</Text>
                </View>
            </TouchableRipple>

            <TouchableRipple onPress={() => {}}>
                <View style={styles.menuItem}>
                    <Image source={require('../assets/help.png')} style={{height: 30, width: 30}}/>
                    <Text style={styles.menuItemText}>About</Text>
                </View>
            </TouchableRipple>
        </View>



        </Animatable.View>
    </View>
  )
}

export default Profile

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
        fontSize: 17,
        lineHeight: 17,
        fontWeight: 500,
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
        backgroundColor:COLORS.third,
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

})