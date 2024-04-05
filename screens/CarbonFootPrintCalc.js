import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, Pressable, ScrollView} from 'react-native';
import { firebase } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import COLORS from '../data/colors';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const CarbonFootPrintCalc = ({ navigation }) => {
  const [electricityUsage, setElectricityUsage] = useState('');
  const [gasUsage, setGasUsage] = useState('');
  const [transportationMiles, setTransportationMiles] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [name, setName] = useState('');
  const [carbonFootprintData, setCarbonFootprintData] = useState(null);
  const [leastCarbonFootprintData, setLeastCarbonFootprintData] = useState(null);

  const [leastElectricityUsageData, setLeastElectricityUsageData] = useState(null);

  const [leastGasUsageData, setLeastGasUsageData] = useState(null);

  const [refreshing, setRefreshing] = useState(false); // State to track whether the data is being refreshed


  const calculateCarbonFootprint = () => {
      // Check if any of the input fields are empty
  if (!electricityUsage || !gasUsage || !transportationMiles) {
    // Show an alert if any field is empty
    Alert.alert('Missing Information', 'Please fill in all fields to calculate your carbon footprint.', [
      { text: 'OK' },
    ]);
    return; // Exit the function early if validation fails
  }
    // Perform your carbon footprint calculation based on the input values
    // For simplicity, let's assume each unit is equivalent to a specific carbon footprint value
    const electricityFootprint = parseFloat(electricityUsage) * 0.5;
    const gasFootprint = parseFloat(gasUsage) * 2;
    const transportationFootprint = parseFloat(transportationMiles) * 0.1;

    const totalCarbonFootprint =
      electricityFootprint + gasFootprint + transportationFootprint;

    setCarbonFootprint(totalCarbonFootprint.toFixed(2));

    

    // Save the data to Firebase
    saveDataToFirebase(totalCarbonFootprint);
    
  };

  const CarbonFootprintCard = ({ carbonFootprintData }) => {
    const navigation = useNavigation();
  
    return (
      <Pressable onPress={() => navigation.navigate("CarbonFootPrintCalc")}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            elevation: 4,
            borderRadius: 25,
            width: '90%',
            height: 200,
            marginLeft: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ paddingHorizontal: 10, marginTop: 10, fontWeight: 400 }}>
            Total Carbon Footprint:
          </Text>
  
          {carbonFootprintData ? (
            <>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 40,
                  marginTop: 17,
                  fontWeight: '600',
                }}
              >
                {carbonFootprintData.totalCarbonFootprint} CO2e
              </Text>
  
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 15,
                  fontWeight: '200',
                }}
              >
                Recorded on:{' '}
                {carbonFootprintData.timestamp
                  .toDate()
                  .toLocaleDateString()}
              </Text>
  
              {/* Display electricity, transportation, and gas usage */}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 15,
                  fontWeight: '200',
                }}
              >
                Electricity Usage: {carbonFootprintData.electricityUsage} kWh
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 15,
                  fontWeight: '200',
                }}
              >
                Transportation Usage: {carbonFootprintData.transportationUsage} miles
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 15,
                  fontWeight: '200',
                }}
              >
                Gas Usage: {carbonFootprintData.gasUsage} gallons
              </Text>
            </>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 40,
                marginTop: 17,
                fontWeight: '300',
              }}
            >
              Loading...
            </Text>
          )}
        </View>
      </Pressable>
    );
  };


  useEffect(() => {
    fetchCarbonFootprintData();
    fetchLeastElectricityUsageData();
    fetchLeastGasUsageData();
    fetchLeastCarbonFootprintData().then(leastFootprintData => {
      setLeastCarbonFootprintData(leastFootprintData);
    });
  }, [refreshing]);
  

  const saveDataToFirebase = async (carbonFootprint) => {
    try {
      const userId = firebase.auth().currentUser.uid;

      // Add a new document with a generated ID to the 'carbon_footprints' collection
      await firebase.firestore().collection('carbon_footprints').add({
        userId,
        electricityUsage: parseFloat(electricityUsage),
        gasUsage: parseFloat(gasUsage),
        transportationMiles: parseFloat(transportationMiles),
        totalCarbonFootprint: parseFloat(carbonFootprint),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Update the user's profile to indicate they've calculated their carbon footprint
      await firebase.firestore().collection('users').doc(userId).update({
      hasCalculatedCarbonFootprint: true,
      });

      // Show an alert to notify the user
      Alert.alert('Success', 'Data saved to Firebase!', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);

      // Navigate back to the home screen
      navigation.goBack();
    } catch (error) {
      console.error('Error saving data to Firebase:', error);

      // Show an alert for the error
      Alert.alert('Error', 'Failed to save data. Please try again.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };


  const fetchCarbonFootprintData = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
  
      const snapshot = await firebase
        .firestore()
        .collection('carbon_footprints')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
  
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCarbonFootprintData(data);
  
        // Additional data for electricity, transportation, and gas usage
        console.log('Electricity Usage:', data.electricityUsage);
        console.log('Transportation Usage:', data.transportationUsage);
        console.log('Gas Usage:', data.gasUsage);
      }
      else {
        // No carbon footprint data found, you can guide the user to input their details
        console.log('No carbon footprint data found. Please input your details.');
      }
    } catch (error) {
      console.error('Error fetching carbon footprint data:', error);
    }
  };


  const handleRefresh = () => {
    setRefreshing(true); // Set refreshing to true when the user triggers the refresh
  };
  


  useEffect(() => {
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users')
      .doc(userId).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const userData = snapshot.data();
          setName(userData.username); // Set the username in state
        } else {
          console.log('User does not exist');
        }
      }).catch(error => {
        console.error("Error fetching user data: ", error);
      });
  }, []);

  const prepareGraphData = () => {
    const labels = ['My Footprint', 'Least Footprint'];
    const datasets = [{
      data: [
        carbonFootprintData?.totalCarbonFootprint || 0,
        leastCarbonFootprintData?.totalCarbonFootprint || 0
      ],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }];
  
    return { labels, datasets };
  };


  const fetchLeastCarbonFootprintData = async () => {
    try {
      const snapshot = await firebase.firestore().collection('carbon_footprints')
        .orderBy('totalCarbonFootprint', 'asc') // Order by the total carbon footprint in ascending order
        .limit(1) // Get only the first document (user with least carbon footprint)
        .get();
  
      if (!snapshot.empty) {
        const leastFootprintData = snapshot.docs[0].data();
        return leastFootprintData; // Return the least carbon footprint data
      }
    } catch (error) {
      console.error('Error fetching least carbon footprint data:', error);
    }
  };

  const fetchLeastElectricityUsageData = async () => {
    try {
      const snapshot = await firebase.firestore().collection('carbon_footprints')
        .orderBy('electricityUsage', 'asc') // Order by electricity usage in ascending order
        .limit(1) // Get only the first document (user with least electricity usage)
        .get();
  
      if (!snapshot.empty) {
        const leastElectricityUsageData = snapshot.docs[0].data();
        setLeastElectricityUsageData(leastElectricityUsageData); // Update state with fetched data
      }
    } catch (error) {
      console.error('Error fetching least electricity usage data:', error);
    }
  };



  const prepareGraphDataElec = () => {
    const labels = ['My Electricity Usage', 'Least Electricity Usage'];
    const datasets = [{
      data: [
        parseFloat(electricityUsage) || 0, // Current user's electricity usage
        leastElectricityUsageData ? parseFloat(leastElectricityUsageData.electricityUsage) : 0 // Least electricity usage
      ],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }];
  
    return { labels, datasets };
  };



  const fetchLeastGasUsageData = async () => {
    try {
      const snapshot = await firebase.firestore().collection('carbon_footprints')
        .orderBy('gasUsage', 'asc') // Order by gas usage in ascending order
        .limit(1) // Get only the first document (user with least gas usage)
        .get();
  
      if (!snapshot.empty) {
        const leastGasUsageData = snapshot.docs[0].data();
        setLeastGasUsageData(leastGasUsageData); // Update state with fetched data
      }
    } catch (error) {
      console.error('Error fetching least gas usage data:', error);
    }
  };


  const prepareGraphDataGas = () => {
    const labels = ['My Gas Usage', 'Least Gas Usage'];
    const datasets = [{
      data: [
        parseFloat(gasUsage) || 0, // Current user's gas usage
        leastGasUsageData ? parseFloat(leastGasUsageData.gasUsage) : 0 // Least gas usage
      ],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }];
  
    return { labels, datasets };
  };




  return (
    <LinearGradient style={{flex: 1, padding: 16}} colors={['#EAEAEA', '#B7F1B5']}>
    <Animatable.Text
        animation={"fadeInUpBig"}
        style={[styles.Title1]}>
        Carbon Footprint Calculator
      </Animatable.Text>

      <ScrollView showsVerticalScrollIndicator={false}>

      <Text style={[styles.text_footer, { marginTop: 30, marginBottom:10 }]}>Electricity</Text>

      <TextInput
        style={styles.input}
        placeholder="Electricity Usage (kWh)"
        keyboardType="numeric"
        value={electricityUsage}
        onChangeText={(text) => setElectricityUsage(text)}
      />


      <Text style={[styles.text_footer, { marginTop: 30, marginBottom:10 }]}>Gas</Text>

      <TextInput
        style={styles.input}
        placeholder="Gas Usage (cubic meters)"
        keyboardType="numeric"
        value={gasUsage}
        onChangeText={(text) => setGasUsage(text)}
      />

      <Text style={[styles.text_footer, { marginTop: 30, marginBottom:10 }]}>Transportation</Text>

      <TextInput
        style={styles.input}
        placeholder="Transportation Miles"
        keyboardType="numeric"
        value={transportationMiles}
        onChangeText={(text) => setTransportationMiles(text)}
      />

      
          <Pressable
            onPress={calculateCarbonFootprint}
            style={[styles.box1, { marginTop: 50, backgroundColor: COLORS.third }]}
          >
          
            <Text style={[styles.text1, { color: COLORS.white }]}>Calculate</Text>
          </Pressable>

      {carbonFootprint !== null && (
        <Text style={styles.result}>
          Total Carbon Footprint: {carbonFootprint} CO2e
        </Text>
      )}


    <Text style={styles.sectionTitle}>Carbon Footprint Comparison</Text>
    <BarChart
      data={prepareGraphData()}
      width={Dimensions.get("window").width-40}
      height={220}
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      bezier
      style={{
        paddingHorizontal: 20, // Add horizontal padding
        alignItems: 'center', // Center the graph horizontally
        marginTop: 10, 
        marginBottom: 20, 
        borderRadius:16,
      }}
    />

{carbonFootprintData?.totalCarbonFootprint <= leastCarbonFootprintData?.totalCarbonFootprint &&
    <Text style={[styles.congratulatoryMessage,{marginBottom:100}]}>
      Congratulations! You have the lowest carbon footprint!
    </Text>
  }



      

    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '100%',
    borderRadius: 20,
    fontWeight: '400',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  Title1:{
    fontSize: 34,
    //fontFamily: 'Montserrat',
    fontWeight: 'bold',
},

Title2:{
  fontSize: 34,
  //fontFamily: 'Montserrat',
  fontWeight: 'bold',
  marginTop:20,
},

text_footer:{
  color: COLORS.black,
  fontSize: 18,
},

action: {
flexDirection: 'row',
marginTop: 10,
borderBottomWidth: 1,
borderBottomColor: COLORS.black,
paddingBottom: 5
},

textInput: {
  flex: 1,
  marginTop: Platform.OS === 'android' ? 0 : -6, // Corrected typo here
  paddingLeft: 10,
  color: COLORS.darkgrey,
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

},

sectionTitle:{
  marginHorizontal: 20,
  marginVertical:25,
  fontSize: 20,
  fontWeight:'300'
},

congratulatoryMessage: {
  textAlign: 'center',
  color: 'green',
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 20,
  marginBottom: 20,
},
});

export default CarbonFootPrintCalc;
