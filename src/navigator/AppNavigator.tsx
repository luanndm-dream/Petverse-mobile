import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import {useSelector} from 'react-redux';
import {useAppDispatch, useAppSelector} from '@/redux';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {addAuth} from '@/redux/reducers';

const AppNavigator = () => {
  const {getItem} = useAsyncStorage('auth');
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    checkLogin();
    console.log(auth.accessToken);
    // const timeout = setTimeout(() => {
    //   // setIsShowSplash(false);
    // }, 1500);

    // return () => clearTimeout(timeout);
  }, []);

  const checkLogin = async () => {
    const res = await getItem();
    // res && dispatch(addAuth(JSON.parse(res)));
  };

  return <>{auth.accessToken ? <MainNavigator /> : <AuthNavigator />}</>;
  // return <>{1>2 ? <MainNavigator /> : <AuthNavigator />}</>;
};

export default AppNavigator;
