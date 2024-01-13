import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { firebase } from '../config';

const Achievements = () => {

  const [hasPostedBlog, setHasPostedBlog] = useState(false);
  const [hasCalculatedCarbonFootprint, setHasCalculatedCarbonFootprint] = useState(false);
  const [showBlogDescription, setShowBlogDescription] = useState(false);
  const [showCarbonFootprintDescription, setShowCarbonFootprintDescription] = useState(false);

  const [hasPostedComment, setHasPostedComment] = useState(false);
  const [showCommentDescription, setShowCommentDescription] = useState(false);

  const [hasLikedPost, setHasLikedPost] = useState(false);
  const [showLikeDescription, setShowLikeDescription] = useState(false);

  const [hasAchievedWordMaster, setHasAchievedWordMaster] = useState(false);
  const [showWordMasterDescription, setShowWordMasterDescription] = useState(false);

  const [hasPlayedOver10WordleGames, setHasPlayedOver10WordleGames] = useState(false);
  const [showWordleGameMasterDescription, setShowWordleGameMasterDescription] = useState(false);




  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    const userRef = firebase.firestore().collection('users').doc(userId);
    
    userRef.get().then((doc) => {
      if (doc.exists) {
        setHasPostedBlog(doc.data().hasPostedBlog);
        setHasCalculatedCarbonFootprint(doc.data().hasCalculatedCarbonFootprint);
        setHasPostedComment(doc.data().hasPostedComment);
        setHasLikedPost(doc.data().hasLikedPost);
        setHasAchievedWordMaster(doc.data().hasAchievedWordMaster);
        setHasPlayedOver10WordleGames(doc.data().hasPlayedOver10WordleGames);
    
      }
    });
  }, []);

  return (
    <LinearGradient style={{ flex: 1, padding: 16 }} colors={['#EAEAEA', '#B7F1B5']}>
      <Animatable.Text
        animation={"fadeInUpBig"}
        style={[styles.Title1, { paddingHorizontal: 10, paddingTop: 5, marginBottom: 40 }]}>
        Achievements
      </Animatable.Text>

      <ScrollView showsVerticalScrollIndicator={false}>


      <View style={styles.achievementBox}>
      <TouchableOpacity 
        onPress={() => setShowBlogDescription(!showBlogDescription)}
      >
        <View style={styles.achievementContainer}>
          <Image
            source={hasPostedBlog ? require('../assets/padlockunlock.png') : require('../assets/padlock.png')}
            style={styles.achievementImage}
          />
          <Text style={styles.achievementText}>
            {hasPostedBlog ? "  Word Weaver Unlocked!  " : "  Word Weaver Locked  "}
          </Text>
          <Image
            source={showBlogDescription ? require('../assets/arrowUp.png') : require('../assets/arrowDown.png')}
            style={styles.arrowImage}
          />
        </View>
        {showBlogDescription && (
          <Text style={styles.descriptionText}>
            Unlock your inner storyteller by sharing your first blog post and earn the 'Word Weaver' badge!
          </Text>
        )}
      </TouchableOpacity>
      </View>



      <View style={styles.achievementBox}>
      <TouchableOpacity 
        onPress={() => setShowCarbonFootprintDescription(!showCarbonFootprintDescription)}
      >
        <View style={styles.achievementContainer}>
          <Image
            source={hasCalculatedCarbonFootprint ? require('../assets/padlockunlock.png') : require('../assets/padlock.png')}
            style={styles.achievementImage}
          />
          <Text style={styles.achievementText}>
            {hasCalculatedCarbonFootprint ? "  Eco Analyst Unlocked!  " : "   Eco Analyst Locked  "}
          </Text>
          <Image
            source={showCarbonFootprintDescription ? require('../assets/arrowUp.png') : require('../assets/arrowDown.png')}
            style={styles.arrowImage}
          />
        </View>
        {showCarbonFootprintDescription && (
          <Text style={styles.descriptionText}>
          Step into the world of sustainability by calculating your carbon footprint for the first time and unlock the Eco Analyst badge!
          </Text>
        )}
      </TouchableOpacity>
      </View>


      <View style={styles.achievementBox}>
        <TouchableOpacity onPress={() => setShowCommentDescription(!showCommentDescription)}>
          <View style={styles.achievementContainer}>
            <Image
              source={hasPostedComment ? require('../assets/padlockunlock.png') : require('../assets/padlock.png')}
              style={styles.achievementImage}
            />
            <Text style={styles.achievementText}>
              {hasPostedComment ? "  Commentator Unlocked!  " : "  Commentator Locked  "}
            </Text>
            <Image
              source={showCommentDescription ? require('../assets/arrowUp.png') : require('../assets/arrowDown.png')}
              style={styles.arrowImage}
            />
          </View>
          {showCommentDescription && (
            <Text style={styles.descriptionText}>
              Share your thoughts by posting your first comment and unlock the Commentator badge!
            </Text>
          )}
        </TouchableOpacity>
      </View>


      <View style={styles.achievementBox}>
        <TouchableOpacity onPress={() => setShowLikeDescription(!showLikeDescription)}>
          <View style={styles.achievementContainer}>
            <Image
              source={hasLikedPost ? require('../assets/padlockunlock.png') : require('../assets/padlock.png')}
              style={styles.achievementImage}
            />
            <Text style={styles.achievementText}>
              {hasLikedPost ? "  First Like Unlocked!  " : "  First Like Locked  "}
            </Text>
            <Image
              source={showLikeDescription ? require('../assets/arrowUp.png') : require('../assets/arrowDown.png')}
              style={styles.arrowImage}
            />
          </View>
          {showLikeDescription && (
            <Text style={styles.descriptionText}>
              Show your appreciation by liking a blog post and unlock the 'First Like' badge!
            </Text>
          )}
        </TouchableOpacity>
      </View>


      <View style={styles.achievementBox}>
        <TouchableOpacity onPress={() => setShowWordMasterDescription(!showWordMasterDescription)}>
          <View style={styles.achievementContainer}>
            <Image
              source={hasAchievedWordMaster ? require('../assets/padlockunlock.png') : require('../assets/padlock.png')}
              style={styles.achievementImage}
            />
          <Text style={styles.achievementText}>
            {hasAchievedWordMaster ? "  Word Master Unlocked!  " : "  Word Master Locked  "}
          </Text>
          <Image
            source={showWordMasterDescription ? require('../assets/arrowUp.png') : require('../assets/arrowDown.png')}
            style={styles.arrowImage}
          />
        </View>
        {showWordMasterDescription && (
        <Text style={styles.descriptionText}>
          Congrats on guessing more than three words correctly in endless mode! You've unlocked the 'Word Master' badge!
        </Text>
        )}
      </TouchableOpacity>
        </View>


        <View style={styles.achievementBox}>
        <TouchableOpacity onPress={() => setShowWordleGameMasterDescription(!showWordleGameMasterDescription)}>
          <View style={styles.achievementContainer}>
            <Image
              source={hasPlayedOver10WordleGames ? require('../assets/padlockunlock.png') : require('../assets/padlock.png')}
              style={styles.achievementImage}
            />
            <Text style={styles.achievementText}>
              {hasPlayedOver10WordleGames ? "  Wordle Enthusiast Unlocked!  " : "  Wordle Enthusiast Locked  "}
            </Text>
            <Image
              source={showWordleGameMasterDescription ? require('../assets/arrowUp.png') : require('../assets/arrowDown.png')}
              style={styles.arrowImage}
            />
          </View>
          {showWordleGameMasterDescription && (
            <Text style={styles.descriptionText}>
              You've played over 10 Wordle games! You're a true 'Wordle Enthusiast'!
            </Text>
          )}
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default Achievements

const styles = StyleSheet.create({
  Title1:{
    fontSize: 34,
    marginTop: 20,
    //fontFamily: 'Montserrat',
    fontWeight: 'bold',
},

achievementContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
  flexDirection:'row'
},
achievementImage: {
  width: 40,
  height: 40,
  marginBottom: 10,
},
descriptionText: {
  fontSize: 14,
  padding: 10,
  color: 'gray',
  textAlign:'center',
  marginBottom:10
},

achievementBox:{
  backgroundColor: '#FFFFFF',
  elevation: 4,
  borderRadius: 25,
  width:'90%',
  height: 100,
  marginTop: 20,
  marginLeft:20,
},

arrowImage: {
  width: 20,
  height: 20,
  },

  achievementBox: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
})