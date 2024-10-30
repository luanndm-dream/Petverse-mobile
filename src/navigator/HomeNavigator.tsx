import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '@/screens';
import EmployeeRegistrationScreen from '@/screens/home/EmployeeRegistrationScreen';
import PetCenterDetailScreen from '@/screens/home/PetCenterDetailScreen';

const HomeNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      
    </Stack.Navigator>
  );
};

export default HomeNavigator;
