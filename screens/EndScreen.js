import { StyleSheet, Text, View, SafeAreaView,ScrollView, LogBox, Alert, ActivityIndicator, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../src/constants'
import COLORS from '../data/colors';

const Number = ({number, label}) => (
    <View style ={{alignItems: 'center', margin: 10}}>
        <Text style={{fontSize: 35, fontWeight: 'bold'}}>{number}</Text>
        <Text style={{fontSize: 20, fontWeight: 200}}>{label}</Text>
    </View>
)


const GuessDistribution = () => {
    return (
        <View style={{width:'100%', padding: 20, justifyContent:'flex-start'}}>
            <GuessDistributionLine position={0} amount={2} percentage={40}/>
            <GuessDistributionLine position={3} amount={6} percentage={70}/>   
        </View>
    )
}

const GuessDistributionLine =({position, amount, percentage}) => {
    return (
        <View style={{flexDirection: 'row', alignItems:'center', width:'100%', justifyContent:'flex-start'}}>
            <Text style={{fontSize: 17}}>{position}</Text>
            <View style={{backgroundColor: COLORS.grey, margin: 5, padding: 5, width: `${percentage}%`}}>
                <Text style={{fontSize: 17}}>{amount}</Text>
            </View>
        </View>
    )
}




const EndScreen = ({won = false}) => {

    const share = () => {

    }

    const [secondsTillTmr, setSecondsTillTmr] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

            setSecondsTillTmr(Math.floor((tomorrow - now) / 1000));
        }

        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [])

    //const formatSeconds = () => {
        //const hours = Math.floor(setSecondsTillTmr / 3600);
       //const minutes = Math.floor((setSecondsTillTmr % 3600) / 60);
        //const seconds = Math.floor(setSecondsTillTmr % 60);
      
        //return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      //};

  return (
    <LinearGradient style={{flex: 1}} colors={['#EAEAEA', '#B7F1B5']}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={{width:'100%', alignContent:'center'}}>
        <View>
            <Text style={styles.title}>WORDLE</Text>
            <Text style ={{fontSize: 30, color:"black", fontWeight: 400, textAlign: 'center',}}>{won ? 'Congrats!' : 'Try again tomorrow'}</Text>
        </View>

        <Text style ={{fontSize: 30, color:"black", fontWeight: 200, marginVertical: 20, textAlign: 'center',}}>Your Statisitics</Text>
        <View>
            <Number number={2} label ={"Played"}/>
            <Number number={2} label ={"Win %"}/>
            <Number number={2} label ={"Current Streak"}/>
            <Number number={2} label ={"Max Streak"}/> 
        </View>

        <Text style ={{fontSize: 30, color:"black", fontWeight: 200, marginVertical: 20, textAlign: 'center',}}>Guess Distribution</Text>

        <GuessDistribution/>

        <View>
            
            <View>
                <Text style ={{fontSize: 30, color:"black", fontWeight: 200, marginTop:20, textAlign: 'center',}}>Next Game</Text>
                <Text style ={{fontSize: 30, color:"black", fontWeight: 'bold',marginTop:10, textAlign: 'center',}}></Text>
            </View>
            
            <TouchableOpacity onPress={share}
                style={[styles.box1, {marginTop:50, backgroundColor:COLORS.third}]}
            >
                <Text style={[styles.text1,{color:COLORS.white}]}>Share</Text>
            </TouchableOpacity>

        </View>

        </SafeAreaView>
        </ScrollView>

    </LinearGradient>
  )
}

export default EndScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
    },

    title: {   
        fontSize: 40,
        fontWeight: 'bold',
        letterSpacing: 4,
        marginTop: 20,
        textAlign: 'center',
    },

    box1:{
        backgroundColor: '#EAEAEA',
        elevation: 2,
        borderRadius: 20,
        width: "54%",
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