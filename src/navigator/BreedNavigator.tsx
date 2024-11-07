import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BreedScreen } from '@/screens';


const BreedNavigator = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name='BreedScreen' component={BreedScreen}/> 

    </Stack.Navigator>
  )
}

export default BreedNavigator