import { StyleSheet, Text, View, Animated, useWindowDimensions } from 'react-native'
import React from 'react'
import COLORS from '../data/colors';

const Pageinator = ({data, scrollX}) => { // allows to move between each of the cards in the onboarding screen
    const {width} =useWindowDimensions();
  return (
    <View style={{flexDirection: 'row', height:64}}>
        {data.map((_,i)=>{
            const inputRange = [(i-1) * width, i* width, (i+1) * width];

            const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange:[10,20,10],
                extrapolate:'clamp',
            });

           return <Animated.View style={[styles.dot, {width:dotWidth}]} key={i.toString}/>
        })}
    </View>
  )
}

export default Pageinator

const styles = StyleSheet.create({
    dot:{
        height:10,
        borderRadius:5,
        backgroundColor:COLORS.third,
        marginHorizontal:8,
    },
})