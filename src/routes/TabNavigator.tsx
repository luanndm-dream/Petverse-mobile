import {View, Text, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import BreedNavigator from './BreedNavigator';
import NotificationNavigator from './NotificationNavigator';
import ProfileNavigator from './ProfileNavigator';
import {colors} from '@/constants/colors';
import {Home2, Notification, Pet, User} from 'iconsax-react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {TextComponent} from '@/components';
import { BreedIcon } from '@/assets/svgs';
const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          height: 70,
          paddingTop: Platform.OS === 'ios' ? 20 : 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({focused}) => {
          const color = focused ? colors.white : colors.dark;
          const size = 14;
          let name = "Trang Chủ"
          let icon = <Entypo name="home" size={size} color={color} />;
          switch (route.name) {
            case 'BreedTab':
              icon = <Pet variant='Bold' size={size} color={color} />;
              // icon = <BreedIcon />;
              name = "Phối giống"
              break;
            case 'NotificationTab':
              icon = <Notification variant='Bold' size={size} color={color} />;
              name = "Thông báo"
              break;
            case 'ProfileTab':
              icon = <User variant='Bold' size={size} color={color} />;
              name = "Cá nhân"
              break;
            default:
              icon = <Entypo name="home" size={size} color={color} />;
              name = "Trang Chủ"
              break;
          }
          return (
            <View
              style={[
                {flexDirection: 'row', alignItems: 'center'},
                focused
                  ? {
                      backgroundColor: colors.grey2,
                      height: 30,
                      borderRadius: 100,
                      
                    }
                  : undefined,
              ]}>
              <View style={focused ? styles.iconContainer : undefined}>
                {icon}
              </View>

              {focused && <TextComponent text={name} 
              style={{paddingHorizontal: 6, fontSize: 11, fontFamily: 'Roboto-Medium'}}
              />}
            </View>
          );
        },
      })}>
      <Tab.Screen name="HomeTab" component={HomeNavigator} />
      <Tab.Screen name="BreedTab" component={BreedNavigator} />
      <Tab.Screen name="NotificationTab" component={NotificationNavigator} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});
