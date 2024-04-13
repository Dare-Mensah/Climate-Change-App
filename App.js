import { Pressable, ScrollView, StyleSheet, Text, View, Image, Dimensions, SafeAreaView, StatusBar, FlatList, ImageBackground, TouchableOpacity,RefreshControl,backgroundImage, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, useEffect} from 'react';
import {firebase} from './config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';





import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import StartUp from './screens/StartUp';
import News from './screens/News';
import Tips from './screens/Tips';
import ForgotPassword from './screens/ForgotPassword';
import Settings from './screens/Settings';
import EditProfile from './screens/EditProfile';
import Onboarding from './screens/Onboarding';
import SignUpComplete from './screens/SignUpComplete';
import GuestHome from './screens/GuestHome';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Wordle from './screens/Wordle';
import EndScreen from './screens/EndScreen';
import GuestProfile from './screens/GuestProfile';
import BlogScreen from './screens/BlogScreen';
import BlogDetails from './screens/BlogDetails';
import EditBlog from './screens/EditBlog';
import EditComment from './screens/EditComment';
import CarbonFootPrintCalc from './screens/CarbonFootPrintCalc';
import EndScreenCoop from './screens/EndScreenCoop';
import EndlessWordle from './screens/EndlessWordle';
import EndlessEndScreen from './screens/EndlessEndScreen';
import WordleCoop2 from './screens/WordleCoop2';
import Achievements from './screens/Achievements';
import CoopWordleInfo from './screens/CoopWordleInfo';
import EndlessWordleInfo from './screens/EndlessWordleInfo';
import GuestWordle from './screens/GuestWordle';
import GuestWordleCoop from './screens/GuestWordleCoop';
import GuestCoopInfo from './screens/GuestCoopInfo';
import GuestEndlessWordle from './screens/GuestEndlessWordle';
import GuestEndlessEndScreen from './screens/GuestEndlessEndScreen';
import GuestEndlessInfo from './screens/GuestEndlessInfo';
import SelectDifficultyEndlessWordle from './screens/SelectDifficultyEndlessWordle';
import EndlessWordleMedium from './screens/EndlessWordleMedium';
import EndlessWordleHard from './screens/EndlessWordleHard';
import About from './screens/About';
import Privacy from './screens/Privacy';
import Accessibility from './screens/Accessibility';
import GuestSelectDiffWordle from './screens/GuestSelectDiffWordle';
import GuestEndlessWordleMedium from './screens/GuestEndlessWordleMedium';
import GuestEndlessWordleHard from './screens/GuestEndlessWordleHard';
import WordleLeaderboards from './screens/WordleLeaderboards';
import ReversedWordle from './screens/ReversedWordle';
import MultiPlayerWordle from './screens/MultiPlayerWordle';
import WordleMultiplayer from './screens/WordleMultiplayer';
import MultiplayerEndscreen from './screens/MultiplayerEndscreen';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

//const navigation = useNavigation();


function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="CarbonFootPrintCalc" component={CarbonFootPrintCalc} />
      <HomeStack.Screen name="Tips" component={Tips} />
      <HomeStack.Screen name="Wordle" component={Wordle} />
      <HomeStack.Screen name="EndScreen" component={EndScreen} />
      <HomeStack.Screen name="BlogScreen" component={BlogScreen} />
      <HomeStack.Screen name="BlogDetails" component={BlogDetails} />
      <HomeStack.Screen name="EditBlog" component={EditBlog} />
      <HomeStack.Screen name="EndScreenCoop" component={EndScreenCoop} />
      <HomeStack.Screen name="EndlessWordle" component={EndlessWordle} />
      <HomeStack.Screen name="EndlessEndScreen" component={EndlessEndScreen} />
      <HomeStack.Screen name="WordleCoop2" component={WordleCoop2} />
      <HomeStack.Screen name="GuestEndlessInfo" component={GuestEndlessInfo} />
      <HomeStack.Screen name="SelectDifficultyEndlessWordle" component={SelectDifficultyEndlessWordle} />
      <HomeStack.Screen name="EndlessWordleMedium" component={EndlessWordleMedium} />
      <HomeStack.Screen name="EndlessWordleHard" component={EndlessWordleHard} />
      <HomeStack.Screen name="About" component={About} />
      <HomeStack.Screen name="Privacy" component={Privacy} />
      <HomeStack.Screen name="WordleLeaderboards" component={WordleLeaderboards} />
      <HomeStack.Screen name="CoopWordleInfo" component={CoopWordleInfo} />
      <HomeStack.Screen name="EndlessWordleInfo" component={EndlessWordleInfo} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="ReversedWordle" component={ReversedWordle} />
      <HomeStack.Screen name="MultiPlayerWordle" component={MultiPlayerWordle} />
      <HomeStack.Screen name="WordleMultiplayer" component={WordleMultiplayer} />
      <HomeStack.Screen name="MultiplayerEndscreen" component={MultiplayerEndscreen} />



      


      {/* Add other screens here as needed */}
    </HomeStack.Navigator>
  );
}

// Define a default style for your tab bar
const defaultTabBarStyle = {
  backgroundColor: '#fff',
  height: 60,
  position: 'absolute',
  bottom: 15,
  left: 20,
  right: 20,
  elevation: 0,
  borderRadius: 15,
  shadowColor: '#7F5DF0',
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
  elevation: 5,
};




function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-settings' : 'ios-settings-outline';
          } else if (route.name === 'News') {
            iconName = focused ? 'ios-newspaper' : 'ios-newspaper-outline';
          } else if (route.name === 'BlogScreen') {
            iconName = focused ? 'ios-chatbubbles' : 'ios-chatbubbles-outline';
          } else if (route.name === 'Achievements') {
            iconName = focused ? 'ios-trophy' : 'ios-trophy-outline';
          }


          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: defaultTabBarStyle,
        // Dynamically hide the tab bar for certain screens
        tabBarVisible: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';

          // List of screens where the tab bar will be hidden
          const hideOnScreens = ['Wordle','Privacy','CoopWordleInfo','WordleCoop2'];
          if (hideOnScreens.indexOf(routeName) > -1) return false;

          return true;
        })(route),
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="BlogScreen" component={BlogScreen} />
      <Tab.Screen name="Achievements" component={Achievements} />
      {/* Add more tabs as needed */}
    </Tab.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="GuestSelectDiffWordle" component={GuestSelectDiffWordle} />
      <Stack.Screen name="GuestEndlessWordleMedium" component={GuestEndlessWordleMedium} />
      <Stack.Screen name="GuestEndlessWordleHard" component={GuestEndlessWordleHard} />
      <Stack.Screen name="GuestWordle" component={GuestWordle} />
      <Stack.Screen name="GuestWordleCoop" component={GuestWordleCoop} />
      <Stack.Screen name="GuestEndlessWordle" component={GuestEndlessWordle} />
      <Stack.Screen name="GuestEndlessEndScreen" component={GuestEndlessEndScreen} />
      <Stack.Screen name="GuestCoopInfo" component={GuestCoopInfo} />
      <Stack.Screen name="GuestHome" component={GuestHome} />
      <Stack.Screen name="GuestProfile" component={GuestProfile} />
    </Stack.Navigator>
  );
}




function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {user ? <HomeTabs /> : <AuthStack />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}



export default App;

