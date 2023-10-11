import { ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const EditProfile = () => {
  return (
    <View style={styles.container}>
        <View style={{margin:20}}>
            <View style={{alignItems:'center'}}>
                <TouchableOpacity>
                    <View style={{
                        height:100,
                        width:100, 
                        borderRadius:15,
                        justifyContent:'center',
                        alignItems:'center'
                        }}>

                        <ImageBackground
                        source={require('../assets/profileUser.png')}
                        style={{height:150, width:150, marginTop:50}}
                        >
                            <View style={{
                                flex:1,
                                justifyContent:'center',
                                alignItems:'center'
                            }}>

                            </View>
                            
                        </ImageBackground>

                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container:{
        flex:1,
    },

    commandButton:{
        padding:15,
        borderRadius:10,
        backgroundColor:'#FF6347',
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

    action:{
        flexDirection:'row',
        marginTop:10,
        marginBottom:10,
        borderBottomWidth:1,
        borderBottomColor:'#f2f2f2',
        paddingBottom:5,
    },

    actionError:{
        flexDirection:'row',
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#FF0000',
        paddingBottom:5,
    },

    textInput:{
        flex:1,
        marginTop: Platform.OS === 'android' ? 0: -12,
        color:'#05375a'
    },
})