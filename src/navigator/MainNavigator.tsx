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
import AppointmentScreen from '@/screens/home/AppointmentScreen';
import ManagePetBreedingScreen from '@/screens/home/ManagePetBreedingScreen';
import PetCenterServiceScreen from '@/screens/home/PetCenterServiceScreen';
import AddCenterBreedScreen from '@/screens/home/AddCenterBreedScreen';
import CenterBreedDetailScreen from '@/screens/home/CenterBreedDetailScreen';
import ScheduleScreen from '@/screens/home/ScheduleScreen';
import BreedDetailScreen from '@/screens/breed/BreedDetailScreen';
import MyAppointmentScreen from '@/screens/home/MyAppointmentScreen';
import MyAppointmentDetailScreen from '@/screens/home/MyAppointmentDetailScreen';
import TrackingScreen from '@/screens/home/TrackingScreen';
import UpdateTrackingScreen from '@/screens/home/UpdateTrackingScreen';
import ManagerScreen from '@/screens/profile/ManagerScreen';
import PaymentScreen from '@/screens/profile/PaymentScreen';
import TransactionHistoryScreen from '@/screens/profile/TransactionHistoryScreen';
import PolicyScreen from '@/screens/profile/PolicyScreen';
import AboutUsScreen from '@/screens/profile/AboutUsScreen';
import EditProfileScreen from '@/screens/profile/EditProfileScreen';
import CheckoutScreen from '@/screens/profile/CheckoutScreen';
import ReportScreen from '@/screens/home/ReportScreen';
import EditPetScreen from '@/screens/home/EditPetScreen';
import AppointmentStatusScreen from '@/screens/profile/AppointmentStatusScreen';
import PlaceForPetScreen from '@/screens/home/PlaceForPetScreen';
import ReportApplicationScreen from '@/screens/profile/ReportApplicationScreen';
import ReportApplicationDetail from '@/screens/profile/ReportApplicationDetail';
import EditPetAlbum from '@/screens/home/EditPetAlbum';
import MyApplicationScreen from '@/screens/home/MyApplicationScreen';
import EditOverViewScreen from '@/screens/home/EditOverViewScreen';
import ReviewScreen from '@/screens/home/ReviewScreen';
import ChangePasswordScreen from '@/screens/profile/ChangePasswordScreen';
import VaccineScreen from '@/screens/home/VaccineScreen';
import AddVaccineScreen from '@/screens/home/AddVaccineScreen';
import DisclaimerScreen from '@/screens/profile/DisclaimerScreen';
import EditPetCenterScreen from '@/screens/home/EditPetCenterScreen';

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
          <Stack.Screen name="EditPetScreen" component={EditPetScreen} />
          <Stack.Screen name="ListCenterScreen" component={ListCenterScreen} />
          <Stack.Screen name="PetAlbumScreen" component={PetAlbumScreen}/>
          <Stack.Screen name="ListChatScreen" component={ListChatScreen}/>
          <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen}/>
          <Stack.Screen name="WorkProfileScreen" component={WorkProfileScreen}/>
          <Stack.Screen name="CreateJobScreen" component={CreateJobScreen}/>
          <Stack.Screen name="ServiceScreen" component={ServiceScreen}/>
          <Stack.Screen name="EditServiceScreen" component={EditServiceScreen}/>
          <Stack.Screen name="PetCenterDetailScreen" component={PetCenterDetailScreen}/>
          <Stack.Screen name="AppointmentScreen" component={AppointmentScreen}/>
          <Stack.Screen name="ManagePetBreedingScreen" component={ManagePetBreedingScreen}/>
          <Stack.Screen name="PetCenterServiceScreen" component={PetCenterServiceScreen}/>
          <Stack.Screen name="AddCenterBreedScreen" component={AddCenterBreedScreen}/>
          <Stack.Screen name="CenterBreedDetailScreen" component={CenterBreedDetailScreen}/>
          <Stack.Screen name="ScheduleScreen" component={ScheduleScreen}/>
          <Stack.Screen name='BreedDetailScreen' component={BreedDetailScreen}/> 
          <Stack.Screen name='MyAppointmentScreen' component={MyAppointmentScreen}/> 
          <Stack.Screen name='MyAppointmentDetailScreen' component={MyAppointmentDetailScreen}/> 
          <Stack.Screen name='TrackingScreen' component={TrackingScreen}/> 
          <Stack.Screen name='UpdateTrackingScreen' component={UpdateTrackingScreen}/> 
          <Stack.Screen name='ManagerScreen' component={ManagerScreen}/> 
          <Stack.Screen name='PaymentScreen' component={PaymentScreen}/> 
          <Stack.Screen name='TransactionHistoryScreen' component={TransactionHistoryScreen}/> 
          <Stack.Screen name='PolicyScreen' component={PolicyScreen}/> 
          <Stack.Screen name='AboutUsScreen' component={AboutUsScreen}/> 
          <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}/> 
          <Stack.Screen name='CheckOutScreen' component={CheckoutScreen}/> 
          <Stack.Screen name='ReportScreen' component={ReportScreen}/> 
          <Stack.Screen name='AppointmentStatusScreen' component={AppointmentStatusScreen}/> 
          <Stack.Screen name='PlaceForPetScreen' component={PlaceForPetScreen}/> 
          <Stack.Screen name='ReportApplicationScreen' component={ReportApplicationScreen}/> 
          <Stack.Screen name='ReportApplicationDetail' component={ReportApplicationDetail}/> 
          <Stack.Screen name='EditPetAlbum' component={EditPetAlbum}/>
          <Stack.Screen name='MyApplicationScreen' component={MyApplicationScreen}/>
          <Stack.Screen name='EditOverViewScreen' component={EditOverViewScreen}/>
          <Stack.Screen name='ReviewScreen' component={ReviewScreen}/>
          <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen}/>
          <Stack.Screen name='VaccineScreen' component={VaccineScreen}/>
          <Stack.Screen name='AddVaccineScreen' component={AddVaccineScreen}/>
          <Stack.Screen name='DisclaimerScreen' component={DisclaimerScreen}/>
          <Stack.Screen name='EditPetCenterScreen' component={EditPetCenterScreen}/>
          <Stack.Screen name="TestScreen" component={TestScreen}/>
        </Stack.Navigator>
  );
};

export default MainNavigator;
