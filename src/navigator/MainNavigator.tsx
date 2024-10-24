import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EmployeeRegistrationScreen from '@/screens/home/EmployeeRegistrationScreen';
import SitterScreen from '@/screens/home/SitterScreen';
import AddPetScreen from '@/screens/home/AddPetScreen';
import MyPetScreen from '@/screens/home/MyPetScreen';
import PetDetailScreen from '@/screens/home/PetDetailScreen';
import PetAlbumScreen from '@/screens/home/PetAlbumScreen';
import ListChatScreen from '@/screens/chat/ListChatScreen';
import ChatDetailScreen from '@/screens/chat/ChatDetailScreen';

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
          <Stack.Screen name="PetDetailScreen" component={PetDetailScreen} />
          <Stack.Screen name="SitterScreen" component={SitterScreen} />
          <Stack.Screen name="PetAlbumScreen" component={PetAlbumScreen}/>
          <Stack.Screen name="ListChatScreen" component={ListChatScreen}/>
          <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen}/>
        </Stack.Navigator>
  
  );
};

export default MainNavigator;
