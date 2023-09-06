import { StyleSheet, Text, View, useWindowDimensions, Image, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '../data/colors'
import { useNavigation } from '@react-navigation/native';

const SignUpComplete = () => {
    const {width} = useWindowDimensions()    
    const navigation = useNavigation();
  return (
    <View style={[styles.container, {width}]}>
        <Image 
        source={require('../assets/Complete.png')}
        style={[styles.image, {width, resizeMode:'contain'}]}
        />

        <View style={{flex:0.3}}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.description}>Sign Up Complete Welcome to Climate Sense.</Text>

            <TouchableOpacity 
            onPress={() => navigation.navigate("Home")}
            style={[styles.box1,{marginTop:60,justifyContent:'center',alignItems:'center', backgroundColor:COLORS.third}] }
            >
                <Text style={[styles.text1,{color:COLORS.white}]}>Home</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default SignUpComplete

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    },

    box1:{
        backgroundColor: '#EAEAEA',
        elevation: 2,
        borderRadius: 20,
        width: 210,
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
        marginLeft: 95,
        textAlign: 'center'
      },

    image: {
        flex: 0.7,
        justifyContent: 'center',
    },

    title:{
        fontWeight:'800',
        fontSize: 28,
        marginBottom: 10,
        color: COLORS.third,
        textAlign: 'center',
    },

    description: {
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
    },

    text1:{
        alignItems: 'center',
        fontWeight:'bold',
        fontSize: 20,
      
      },
})