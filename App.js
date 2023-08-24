import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './screens/Home';
import StackNavigator from './screens/StackNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <StackNavigator/>
    <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});
