import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EmployeeRegistrationScreen from '@/screens/home/EmployeeRegistrationScreen';
import SitterScreen from '@/screens/home/SitterScreen';
import AddPetScreen from '@/screens/home/AddPetScreen';
import MyPetScreen from '@/screens/home/MyPetScreen';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
   
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="EmployeeRegistrationScreen"
            component={EmployeeRegistrationScreen}
          />
          <Stack.Screen name="MyPetScreen" component={MyPetScreen} />
          <Stack.Screen name="AddPetScreen" component={AddPetScreen} />
          <Stack.Screen name="SitterScreen" component={SitterScreen} />
        </Stack.Navigator>
  
  );
};

export default MainNavigator;
