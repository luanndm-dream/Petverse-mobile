import {View, Text} from 'react-native';
import React from 'react';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '@/redux/store';


const AppNavigator = () => {
    const auth = useAppSelector((state)=>state.auth.authData)
    const dispatch = useAppDispatch();
    console.log(auth)
    
    // const checkLogin = async () =>{
    //     const res = await 
    // }
  return <>
  {auth.accesstoken ? <MainNavigator /> : <AuthNavigator />}
  </>;
};

export default AppNavigator;
