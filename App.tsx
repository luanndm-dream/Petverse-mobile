import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextComponent from './src/components/TextComponent';
import HomeScreen from './src/screens/home/HomeScreen';
import MainNavigator from './src/routes/MainNavigator';
import AuthNavigator from './src/routes/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <NavigationContainer>
      {1 > 2 ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
