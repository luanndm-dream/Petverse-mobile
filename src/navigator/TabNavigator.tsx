import {View, Text, StyleSheet, Platform} from 'react-native';
import React, { useEffect, useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeNavigator from './HomeNavigator';
import BreedNavigator from './BreedNavigator';
import NotificationNavigator from './NotificationNavigator';
import ProfileNavigator from './ProfileNavigator';
import {colors} from '@/constants/colors';
import {Notification, Pet, User} from 'iconsax-react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {TextComponent} from '@/components';
import firestore from '@react-native-firebase/firestore';
import { useAppSelector } from '@/redux';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const [unreadCount, setUnreadCount] = useState(0);
  const roleName = useAppSelector(state => state.auth.roleName);
  const id = useAppSelector(state =>
    roleName === 'Customer' ? state.auth.userId : state.auth.petCenterId,
  );

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .where(`participants.${id}.isRead`, '==', false)
      .onSnapshot(snapshot => {
        setUnreadCount(snapshot.size);
      });

    return () => unsubscribe();
  }, [id]);

  const renderTabIcon = (route:any, focused:any) => {
    const color = focused ? colors.white : colors.dark;
    const size = 14;
    let icon = <Entypo name="home" size={size} color={color} />;
    let name = "Trang Chủ";
    let showBadge = false;

    switch (route.name) {
      case 'BreedTab':
        icon = <Pet variant='Bold' size={size} color={color} />;
        name = "Phối giống";
        break;
      case 'NotificationTab':
        icon = <Notification variant="Bold" size={size} color={color} />;
        showBadge = unreadCount > 0;
        name = "Thông báo";
        break;
      case 'ProfileTab':
        icon = <User variant='Bold' size={size} color={color} />;
        name = "Cá nhân";
        break;
      default:
        icon = <Entypo name="home" size={size} color={color} />;
        name = "Trang Chủ";
        break;
    }

    return (
      <View style={styles.tabItemContainer}>
        <View
          style={[
            styles.iconWrapper,
            focused && styles.focusedIconWrapper,
          ]}>
          <View style={focused ? styles.iconContainer : undefined}>
            {icon}
          </View>
          {focused && (
            <TextComponent 
              text={name} 
              styles={styles.tabLabel}
            />
          )}
          {showBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({focused}) => renderTabIcon(route, focused),
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
  tabBar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 70,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  focusedIconWrapper: {
    backgroundColor: colors.grey2,
    height: 30,
    borderRadius: 100,
    paddingRight: 6,
  },
  iconContainer: {
    width: 30,
    height: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabLabel: {
    paddingHorizontal: 6,
    fontSize: 11,
    fontFamily: 'Roboto-Medium',
  },
});