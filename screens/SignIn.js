import {  SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable, ScrollView } from 'react-native'
import React, {useState} from 'react'
import COLORS from '../data/colors'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import {firebase} from '../config'

const SignIn = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('') //email variables

    const [password, setPassword] = useState('') //password variable


    loginUser = async(email, password) => { //handles the logging in for the4 user
        try{
            await firebase.auth().signInWithEmailAndPassword(email, password) // checks if email and passsword is correct 
            navigation.navigate("Home", { email })
        } catch (error){
            alert("Invalid Email or Password")
        }
    }


  return (
    <View style={styles.container}>
        <View style={styles.header2}>
            <Text style={styles.text_header}>Login</Text>
        </View>
        <Animatable.View 
        animation={"fadeInUpBig"}
        style={styles.footer}>

            <Text style={[styles.text_footer, {marginTop: 11}]}>Email</Text>
            <View style={styles.action}>
                <Image
                style={{height: 20, width: 20}} 
                source={require('../assets/envelope.png')}/>

                <TextInput
                    placeholder='Your Email'
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(email) => setEmail(email)}
                    autoCorrect={false}
                />
            </View>



            
            <Text style={[styles.text_footer, {marginTop:35}]}>Password</Text>
            <View style={styles.action}>
                <Image
                style={{height: 20, width: 20}} 
                source={require('../assets/lock.png')}/>

                <TextInput
                    placeholder='Your Password'
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(password) => setPassword(password)}
                    autoCorrect={false}
                    secureTextEntry={true}
                />

            </View>

            <TouchableOpacity 
            onPress={() => loginUser(email, password)}
            style={[styles.button,{marginTop:50, backgroundColor:COLORS.third}] }
            >
                <Text style={[styles.text1,{color:COLORS.white}]}>Login</Text>
            </TouchableOpacity>




            <TouchableOpacity 
            onPress={() => navigation.navigate("ForgotPassword")}
            >
                <Text style={{fontWeight:'500', textAlign:'center', fontSize: 17, marginTop: 30}}>Forgot Password?</Text>
            </TouchableOpacity>



            <View style={{flexDirection:'row', justifyContent:'center', padding:30}}>
                <Text style={{fontWeight:'300', textAlign:'center', fontSize: 17}}>Don't have an account?   </Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate("SignUp")}
                >
                    <Text style={{fontWeight:'500', textAlign:'center', fontSize: 17}}>SignUp</Text>
                </TouchableOpacity>
            </View>


        </Animatable.View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:COLORS.third,
    },
    header2:{
        flex: 0.9,
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
        flex: 3.1,
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

    header1:{
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: COLORS.third,
        //borderBottomLeftRadius:20,
        //borderBottomRightRadius:20,
        //elevation:10
      },
      action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'andriod' ? 0 : -6,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
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
})