import { StyleSheet, Text, View, FlatList, useWindowDimensions, Animated } from 'react-native'
import React, {useState, useRef} from 'react'
import data2 from '../data/data2'
import OnboardingItem from './OnboardingItem'
import COLORS from '../data/colors'
import Pageinator from './Pageinator'
import NextButton from './NextButton'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native';


const Onboarding = () => {

    const route = useRoute();

    const navigation = useNavigation();

    const scrollX =useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] =useState(0);

    const data2Ref = useRef(null)

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    }).current

    const viewConfig =useRef({viewAreaCoveragePercentThreshold: 50}).current;

    const scrollTo = () => {
        if (currentIndex < data2.length-1) {
            data2Ref.current.scrollToIndex({index: currentIndex + 1});
        } else {
            console.log ('last item')
            navigation.navigate("SignUpComplete")
        }
    }
  return (
    <View style={styles.container}>
        <View style={{flex:3}}>
            <FlatList 
            data={data2}
            renderItem={({item}) => <OnboardingItem item={item}/>}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                useNativeDriver:false
            })}

            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
            ref={data2Ref}
            />
        </View>

        <Pageinator data={data2} scrollX={scrollX}/>
        
        <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / data2.length)}/>
    </View>
  )
}

export default Onboarding

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: COLORS.white
    }
})