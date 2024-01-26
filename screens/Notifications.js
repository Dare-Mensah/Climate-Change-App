import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
      // Retrieve the saved notification setting when the component mounts
      getNotificationSetting();
    }, []);
  
    const toggleSwitch = async () => {
      const newSetting = !isEnabled;
      setIsEnabled(newSetting);
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newSetting));
      // Add any additional code to handle notification settings (e.g., scheduling/cancelling notifications)
    };
  
    const getNotificationSetting = async () => {
      const setting = await AsyncStorage.getItem('notificationsEnabled');
      if (setting !== null) {
        setIsEnabled(JSON.parse(setting));
      }
    };
  
    return (
      <View style={styles.container}>
        <Text>Enable Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    );
}

export default Notifications

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
})