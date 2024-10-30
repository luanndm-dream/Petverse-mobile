import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import EmployeeRegistrationScreen from '@/screens/home/EmployeeRegistrationScreen';
import AddPetScreen from '@/screens/home/AddPetScreen';
import MyPetScreen from '@/screens/home/MyPetScreen';
import PetDetailScreen from '@/screens/home/PetDetailScreen';
import PetAlbumScreen from '@/screens/home/PetAlbumScreen';
import ListChatScreen from '@/screens/chat/ListChatScreen';
import ChatDetailScreen from '@/screens/chat/ChatDetailScreen';
import TestScreen from '@/screens/home/TestScreen';
import WorkProfileScreen from '@/screens/home/WorkProfileScreen';
import CreateJobScreen from '@/screens/home/CreateJobScreen';
import ListCenterScreen from '@/screens/home/ListCenterScreen';
import ServiceScreen from '@/screens/home/ServicesScreen';
import EditServiceScreen from '@/screens/home/EditServiceScreen';
import PetCenterDetailScreen from '@/screens/home/PetCenterDetailScreen';

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
          <Stack.Screen name="ListCenterScreen" component={ListCenterScreen} />
          <Stack.Screen name="PetAlbumScreen" component={PetAlbumScreen}/>
          <Stack.Screen name="ListChatScreen" component={ListChatScreen}/>
          <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen}/>
          <Stack.Screen name="WorkProfileScreen" component={WorkProfileScreen}/>
          <Stack.Screen name="CreateJobScreen" component={CreateJobScreen}/>
          <Stack.Screen name="ServiceScreen" component={ServiceScreen}/>
          <Stack.Screen name="EditServiceScreen" component={EditServiceScreen}/>
          <Stack.Screen name="PetCenterDetailScreen" component={PetCenterDetailScreen}/>
          <Stack.Screen name="TestScreen" component={TestScreen}/>
        </Stack.Navigator>
  
  );
};

export default MainNavigator;
