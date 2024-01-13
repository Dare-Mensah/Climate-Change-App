import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import COLORS from '../data/colors'
import DATA from '../data/data1'
import * as Animatable from 'react-native-animatable';
import {firebase} from '../config'
import Profile from './Profile';
import { Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const {width} = Dimensions.get('screen')

const GuestHome = ({route}) => {
    const navigation = useNavigation();

    const {currentStreak, winPercentage, playedState }= route.params || {}
    const [statsSaved, setStatsSaved] = useState(false);

    const [name, setName] = useState('');

    const [email] = useState('');


    useEffect(() => {
      if (!statsSaved) {
        saveStatsToAsyncStorage();
        setStatsSaved(true);
      }
    }, [statsSaved]);
  
    const saveStatsToAsyncStorage = async () => {
      try {
        const statsData = {
          currentStreak,
          winPercentage,
          playedState,
        };
        const statsString = JSON.stringify(statsData);
        await AsyncStorage.setItem('@user_stats', statsString);
      } catch (error) {
        console.error('Error saving stats to AsyncStorage:', error);
      }
    };
  
    const readStatsFromAsyncStorage = async () => {
      try {
        const statsString = await AsyncStorage.getItem('@user_stats');
        if (statsString) {
          const statsData = JSON.parse(statsString);
          // Update the state with the retrieved statistics
          // This will re-render the component with the saved stats
          setStatsSaved(statsData);
        }
      } catch (error) {
        console.error('Error reading stats from AsyncStorage:', error);
      }
    };
  
    useEffect(() => {
      readStatsFromAsyncStorage();
    }, []);



    const wordleOptions = [
      { id: '1', title: 'SinglePlayer Mode', navigateTo: 'GuestWordle' },
      { id: '2', title: 'Co-op Mode', navigateTo: 'CoopWordleInfo' },
      { id: '3', title: 'Endless Mode', navigateTo: 'EndlessWordleInfo' },
    ];
  
  
  
  
    const WordleOption = ({ item }) => {
      return (
        <Pressable onPress={() => navigation.navigate(item.navigateTo)} style={styles.wordleOption}>
          <View style={styles.wordleOptionView}>
            <Text style={styles.wordleOptionText}>{item.title}</Text>
          </View>
        </Pressable>
      );
    };

  

    const Card =({Tips}) => {
      return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Tips", Tips)}>
      <ImageBackground style={styles.cardImage} source={Tips.image}>
        <Image style={{height: 30, width:30, }} source={Tips.icon}/>
        <Text style={{color: COLORS.white, fontSize: 15, fontWeight:'800', marginTop: 40}}>{Tips.name}</Text>
      </ImageBackground>
      </TouchableOpacity>
      )
    }
  
    return (
  
      <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#8DEDE1']}>
        <StatusBar translucent={false} style={"light"} color = "white"/>

        <View style={styles.header}>

        <View style={{marginTop: 20, flexDirection:'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn", {username: name.username, email})}>
            <Image style={{height: 40, width:40, paddingTop: 5, marginLeft: 18}} source={require('../assets/circle-user.png')}/>
          </TouchableOpacity>
        </View>

        </View>

        

        <ScrollView showsVerticalScrollIndicator={false}>

        <View>
          <Animatable.Text 
          animation={"fadeInUpBig"}
          style={[styles.Title1, style={paddingHorizontal:20, paddingTop:10}]}>Dashboard </Animatable.Text>
        </View>

<Text style={styles.sectionTitle}>Wordle</Text>

<FlatList
  contentContainerStyle={{ paddingLeft: 20 }}
  horizontal
  showsHorizontalScrollIndicator={false}
  data={wordleOptions}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <WordleOption item={item} />}

/>
        
    
        <Text style={styles.sectionTitle}>Tips</Text>
        
  
        <View>
          <FlatList 
          contentContainerStyle={{paddingLeft:20}}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DATA} 
          renderItem={({item}) => <Card Tips={item}/>}
          />
        </View>


        <Text style={styles.sectionTitle}>Blogs</Text>
  
       
  
  
        </ScrollView>
      </LinearGradient>
    )
}


export default GuestHome

const styles = StyleSheet.create({    
Title1:{
    fontSize: 34,
    marginTop: 20,
    //fontFamily: 'Montserrat',
    fontWeight: 'bold',

},

header:{
  //paddingVertical: 21,
  //paddingHorizontal: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
},

headerTitle:{
  color: COLORS.white,
  fontSize: 23,
  fontWeight: '400',
},

inputContainer:{
  height: 60,
  width:'100%',
  backgroundColor: COLORS.white,
  borderRadius:10,
  position: 'absolute',
  top: 90,
  flexDirection: 'row',
  paddingHorizontal: 20,
  alignItems:'center',
  elevation: 12,

},

sectionTitle:{
  marginHorizontal: 20,
  marginVertical:25,
  fontSize: 20,
  fontWeight:'300'
},

cardImage:{
  height: 160,
  width: width /2.9,
  marginRight: 20,
  padding: 20,
  overflow:"hidden",
  borderRadius: 40,
  
},
othercards:{
  width:width -40,
  height: 200,
  marginRight: 20, 
  borderRadius: 10, 
  overflow:"hidden",
  marginLeft: 20,
  elevation:10,
},

wordleOption: {
  height: 160,
  width: width / 2.4,
  marginRight: 20,
  padding: 20,
  overflow: "hidden",
  borderRadius: 40,
  backgroundColor: '#FFFFFF', // or any other color you prefer
  elevation: 10,
  marginBottom:20,
},


wordleOptionView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

wordleOptionText: {
  color: COLORS.black, // Changed to black for better visibility
  fontSize: 18,
  fontWeight: '800',
  textAlign:'center',
},
})