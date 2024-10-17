import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import EmployeeRegistrationScreen from '@/screens/home/EmployeeRegistrationScreen'

const MainNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Main' component={TabNavigator}/>
      <Stack.Screen name="EmployeeRegistrationScreen" component={EmployeeRegistrationScreen} />
    </Stack.Navigator>
  )
}

export default MainNavigator