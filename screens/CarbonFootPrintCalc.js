import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, Image, Pressable} from 'react-native';
import { firebase } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import COLORS from '../data/colors';

const CarbonFootPrintCalc = ({ navigation }) => {
  const [electricityUsage, setElectricityUsage] = useState('');
  const [gasUsage, setGasUsage] = useState('');
  const [transportationMiles, setTransportationMiles] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState(null);

  const calculateCarbonFootprint = () => {
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

  return (
    <LinearGradient style={{flex: 1, padding: 16}} colors={['#EAEAEA', '#B7F1B5']}>
    <Animatable.Text
        animation={"fadeInUpBig"}
        style={[styles.Title1]}>
        Carbon Footprint Calculator
      </Animatable.Text>

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
});

export default CarbonFootPrintCalc;
