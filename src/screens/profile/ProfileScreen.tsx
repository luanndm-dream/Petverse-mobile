import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  PopupComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {useAppSelector} from '@/redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {apiChangeAvatar, apiGetUserByUserId} from '@/api/apiUser';
import {colors} from '@/constants/colors';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {apiGetPetByUserId} from '@/api/apiPet';
import {apiGetPetCenterByPetCenterId} from '@/api/apiPetCenter';
import {appointmentData} from '@/data/appointmentData';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {profileFeatureData} from '@/data/profileFeatureData';
import {priceFormater} from '@/utils/priceFormater';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {managerId} from '@/constants/app';
import useLoading from '@/hook/useLoading';

interface ReportFeature {
  id: string;
  title: string;
  icon: string;
  count?: number;
}

const ProfileScreen = () => {
  const userId = useAppSelector(state => state.auth.userId);
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const [userData, setUserData] = useState<any>();
  const [myPetData, setMyPetData] = useState<[]>([]);
  const [myPetCenterData, setMyPetCenterData] = useState<any>();
  const [managerData, setManagerData] = useState<any>();
  const [isVisible, setIsVisible] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    apiGetPetByUserId(userId).then((res: any) => {
      if (res.statusCode === 200) {
        setMyPetData(res?.data?.items);
      }
    });
    apiGetUserByUserId(managerId).then((res: any) => {
      if (res.statusCode === 200) {
        setManagerData(res?.data);
      }
    });
    if (petCenterId) {
      apiGetPetCenterByPetCenterId(petCenterId).then((res: any) => {
        if (res.statusCode === 200) {
          setMyPetCenterData(res.data);
        }
      });
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      apiGetUserByUserId(userId).then((res: any) => {
        if (res.statusCode === 200) {
          setUserData(res.data);
          setIsVerify(
            !!res.data.avatar && !!res.data.address && !!res.data.phoneNumber,
          );
        } else {
          console.log('lay du lieu user that bại');
        }
      });
    }, [userId,refreshFlag]),
  );
  const requestGalleryPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await check(permission);

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          // Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này');
        }
      }
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền thư viện ảnh: ', error);
    }
  };

  const openGalarryHandle = () => {
    showLoading()
    if (RESULTS.GRANTED) {
      ImagePicker.openPicker({}).then(image => {
        apiChangeAvatar(userId, image.path).then((res: any)=>{
          if (res.statusCode === 200) {
            hideLoading();
            setRefreshFlag(!refreshFlag);
            Toast.show({
              type: 'success',
              text1: 'Thay đổi ảnh đại diện thành công',
              text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
            });
          } else {
            hideLoading();
            Toast.show({
              type: 'error',
              text1: 'Thay đổi ảnh đại diện thất bại',
              text2: `Xảy ra lỗi khi thay đổi ảnh đại diện ${res.error}`,
            });
          }
        })
      });
    }
  };
  const onPressItem = (screen: string) => {
    navigation.navigate(screen)
  } 
  const onContactManagerHandle = () => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.CHATDETAILSCREEN, {
      chatId: `${userId}-${managerId}`,
      name: managerData.fullName,
      avatar: managerData.avatar,
      toUserId: managerData.id,
    });
  };
  const onLogoutHanble = () => {
    setIsVisible(!isVisible);
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
    // Auto hide tooltip after 3 seconds
    if (!showTooltip) {
      setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
    }
  };
  return (
    <>
      <Container>
        <RowComponent justify="flex-end">
          <IconButtonComponent
            name="headphones-settings"
            onPress={onContactManagerHandle}
          />
          <IconButtonComponent name="location-exit" onPress={onLogoutHanble} />
        </RowComponent>

        <SectionComponent>
          <RowComponent justify="space-between">
            <RowComponent>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={openGalarryHandle}>
                <Image
                  source={
                    userData?.avatar
                      ? {uri: userData?.avatar}
                      : require('../../assets/images/DefaultAvatar.jpg')
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <View style={{marginLeft: 20}}>
                <TextComponent
                  text={userData?.fullName}
                  size={20}
                  type="title"
                />
                <TextComponent
                  text={userData?.email}
                  styles={{marginTop: 12}}
                />
              </View>
            </RowComponent>
            <IconButtonComponent
              name="shield-check"
              color={isVerify ? colors.primary : colors.grey}
              size={32}
              onPress={toggleTooltip}
            />
             {showTooltip && (
                <View style={styles.tooltip}>
                  <View style={styles.tooltipArrow} />
                  <Text style={styles.tooltipText}>
                    {isVerify 
                      ? 'Đã xác thực'
                      : 'Chưa xác thực'
                    }
                  </Text>
                </View>
              )}
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent justify="flex-start">
            <View>
              <TextComponent
                text={myPetData.length.toString()}
                type="title"
                size={24}
              />
              <TextComponent text="Thú cưng" />
            </View>
            <View style={styles.overviewItem}>
              <TextComponent
                text={myPetCenterData?.rate ? myPetCenterData?.rate : '0'}
                type="title"
                size={24}
              />
              <TextComponent text="Đánh giá" />
            </View>
            <View style={styles.overviewItem}>
              <TextComponent
                text={priceFormater(userData?.balance)}
                type="title"
                size={24}
              />
              <TextComponent text="Số dư" />
            </View>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <TextComponent text="Lịch hẹn của tôi" type="title" />
          <View style={styles.reportContainer}>
            {appointmentData.map(item => (
              <View key={item.id} style={styles.reportItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={32}
                    color={colors.dark}
                  />
                  {/* {item.count && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.count}</Text>
                  </View>
                )} */}
                </View>
                <TextComponent
                  text={item.title}
                  styles={styles.reportItemText}
                  size={14}
                />
              </View>
            ))}
          </View>
        </SectionComponent>
        <SectionComponent styles={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={profileFeatureData}
            renderItem={({item}) => (
              <TouchableOpacity style={{paddingVertical: 6}} onPress={() => onPressItem(item.screen)}>
                <RowComponent justify="space-between">
                  <RowComponent>
                    <View
                      style={{
                        padding: 12,
                        backgroundColor: item.backgroundColor,
                        borderRadius: 8,
                        marginRight: 12,
                      }}>
                      <MaterialCommunityIcons
                        size={24}
                        color={colors.white}
                        name={item.iconName}
                      />
                    </View>

                    <TextComponent text={item.title} size={18} type="title" />
                  </RowComponent>
                  <MaterialCommunityIcons
                    size={24}
                    color={colors.dark}
                    name="chevron-right"
                  />
                </RowComponent>
              </TouchableOpacity>
            )}
          />
        </SectionComponent>
      </Container>
      <PopupComponent
        description="Bạn muốn đăng xuất?"
        iconColor={colors.red}
        iconName="help"
        isVisible={isVisible}
        leftTitle="Huỷ"
        onClose={() => setIsVisible(false)}
        onLeftPress={() => {}}
        onRightPress={() => {}}
        rightTitle="Xác nhận"
        title="Đăng xuất"
      />
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  overviewItem: {
    marginLeft: 40,
  },
  reportContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  reportItem: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    // width: 48,
    // height: 48,
    // borderRadius: 24,
    // borderWidth: 1,
    // borderColor: colors.grey + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    // backgroundColor: 'white',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportItemText: {
    textAlign: 'center',
    color: colors.grey,
  },
  tooltip: {
    position: 'absolute',
    bottom: -20,
    right: 0,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 6,
    borderColor: '#e0e0e0',
    width: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  tooltipArrow: {
    position: 'absolute',
    top: -10,
    right: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
  },
  tooltipText: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
});
