import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Pressable} from 'react-native'
import React from 'react'
import COLORS from '../data/colors'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
    const navigation = useNavigation();

    const [data, setData] = React.useState({
        email: '',
        password: '',
        username: '',
        check_textInputChange: false,
        check_textInputChange1: false,
        secureTextEntry: true
        });

        const textInputChange = (val) => {
            if(val.length != 0) {
                setData({
                    ...data,
                    email: val,
                    check_textInputChange: true
                })
            } 
            else {
                setData({
                    ...data,
                    email: val,
                    check_textInputChange: false
                })
            }
        }
    
        const textInputChange1 = (val1) => {
            if(val1.length != 0) {
                setData({
                    ...data,
                    username: val1,
                    check_textInputChange1: true
                })
            } 
            else {
                setData({
                    ...data,
                    username: val1,
                    check_textInputChange1: false
                })
            }
        }
    
    
        const handlePasswordChange = (val) => {
            setData({
                ...data,
                password: val,
            })
        }
    
        const updateSecureText = () => {
            setData({
                ...data,
                secureTextEntry: !data.secureTextEntry
            })
        }

        return (
            <View style={styles.container}>
                <View style={styles.header2}>
                    <Text style={styles.text_header}>SignUp</Text>
                </View>
                <Animatable.View 
                animation={"fadeInUpBig"}
                style={styles.footer}>
                <Text style={styles.text_footer}>Username</Text>
                    <View style={styles.action}>
                        <Image
                        style={{height: 20, width: 20}} 
                        source={require('../assets/circle-user.png')}/>
        
                        <TextInput
                            placeholder='Your Username'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val1) => textInputChange1(val1)}
                        />
                        {data.check_textInputChange1 ?
                        <Animatable.Image
                        animation={"bounceIn"}
                        style={{height: 20, width: 20}} 
                        source={require('../assets/correct.png')}
                        />
                        : null}
                    </View>
        
        
                    <Text style={[styles.text_footer, {marginTop: 35}]}>Email</Text>
                    <View style={styles.action}>
                        <Image
                        style={{height: 20, width: 20}} 
                        source={require('../assets/envelope.png')}/>
        
                        <TextInput
                            placeholder='Your Email'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_textInputChange ?
                        <Animatable.Image
                        animation={"bounceIn"}
                        style={{height: 20, width: 20}} 
                        source={require('../assets/correct.png')}
                        />
                        : null}
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
                            secureTextEntry={data.secureTextEntry ? true : false}
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
        
                        <TouchableOpacity
                            onPress={updateSecureText}
                        >
                        {data.secureTextEntry ?
                        <Image
                        style={{height: 20, width: 20}} 
                        source={require('../assets/crossed-eye.png')}
                        /> 
                        :
                        <Image
                        style={{height: 20, width: 20}} 
                        source={require('../assets/eye.png')}
                        /> 
                        }
                        </TouchableOpacity>
                    </View>
        
                    <Pressable 
                    onPress={() => navigation.navigate("Home")}
                    style={[styles.box1,{marginTop:60,justifyContent:'center',alignItems:'center', backgroundColor:COLORS.third}] }
                    >
                        <Text style={[styles.text1,{color:COLORS.white}]}>SignUp</Text>
                    </Pressable>
        
        
                </Animatable.View>
            </View>
          )
}

export default SignUp

const styles = StyleSheet.create({
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
        marginLeft: 85,
        textAlign: 'center'
      },
      
      text1:{
        alignItems: 'center',
        fontWeight:'bold',
        fontSize: 20,
      
      },
})