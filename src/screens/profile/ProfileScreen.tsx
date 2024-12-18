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
import {useAppDispatch, useAppSelector} from '@/redux';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutAuth} from '@/redux/reducers';

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
  const dispatch = useAppDispatch();
  useEffect(() => {
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
      // Hàm fetch data
      const fetchData = async () => {
        try {
          // Chạy song song 2 API
          const [petResponse, userResponse]: any = await Promise.all([
            apiGetPetByUserId(userId),
            apiGetUserByUserId(userId),
          ]);

          // Xử lý kết quả trả về từ API pet
          if (petResponse.statusCode === 200) {
            setMyPetData(petResponse?.data?.items);
          } else {
            console.error('Lấy dữ liệu pet thất bại');
          }

          // Xử lý kết quả trả về từ API user
          if (userResponse.statusCode === 200) {
            const userData = userResponse.data;
            setUserData(userData);
            setIsVerify(
              !!userData.avatar && !!userData.address && !!userData.phoneNumber,
            );
          } else {
            console.error('Lấy dữ liệu user thất bại');
          }
        } catch (error) {
          console.error('Lỗi khi fetch data:', error);
        }
      };

      // Gọi fetchData
      fetchData();
    }, [userId, refreshFlag]),
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
    // showLoading();
    if (RESULTS.GRANTED) {
      ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width: 800,
        height: 800,
        compressImageMaxWidth: 800, // Kích thước tối đa 800px
        compressImageMaxHeight: 800,
      }) // Chỉ cho phép chọn ảnh
        .then(image => {
          // Kiểm tra nếu file không phải là ảnh
          if (!image.mime.startsWith('image')) {
            Toast.show({
              type: 'error',
              text1: 'Lỗi',
              text2:
                'Bạn chỉ được phép chọn tệp ảnh làm avatar. Vui lòng chọn file ảnh hợp lệ!',
            });
            return; // Ngăn không cho tiếp tục nếu không phải ảnh
          }

          apiChangeAvatar(userId, image.path)
            .then((res: any) => {
              if (res.statusCode === 200) {
                setRefreshFlag(!refreshFlag);
                Toast.show({
                  type: 'success',
                  text1: 'Thay đổi ảnh đại diện thành công',
                  text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Thay đổi ảnh đại diện thất bại',
                  text2: `Xảy ra lỗi khi thay đổi ảnh đại diện: ${res.message}`,
                });
              }
            })
            .catch(err => {
              Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Xảy ra lỗi khi kết nối tới server.',
              });
            });
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Huỷ chọn',
            text2: 'Bạn đã huỷ chọn ảnh.',
          });
          console.error('Lỗi khi chọn ảnh:', error);
        });
    }
  };
  const onPressItem = (screen: string) => {
    navigation.navigate(screen);
  };
  const onContactManagerHandle = () => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.CHATDETAILSCREEN, {
      chatId: `${userId}-${managerId}`,
      name: managerData.fullName,
      avatar: managerData.avatar,
      toUserId: managerData.id,
    });
  };

  const logoutConfimHandle = async () => {
    try {
      await AsyncStorage.removeItem('auth'); // Xóa thông tin người dùng trong AsyncStorage
      dispatch(logoutAuth()); // Dispatch action để reset Redux state
      Toast.show({
        type: 'success',
        text1: 'Đăng xuất thành công',
        text2: 'Hẹn gặp lại bạn lần sau!',
      });
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
      Toast.show({
        type: 'error',
        text1: 'Đăng xuất thất bại',
        text2: 'Đã xảy ra lỗi trong quá trình đăng xuất.',
      });
    }
  };

  const onLogoutHanble = () => {
    setIsVisible(!isVisible);
  };
  const onAppointmentItemPressHandle = (status: number, title: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.APPOINTMENTSTATUSSCREEN, {
      status: status,
      title: title,
    });
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
                  {isVerify ? 'Đã xác thực' : 'Chưa xác thực'}
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
            {/* <View style={styles.overviewItem}>
              <TextComponent
                text={
                  myPetCenterData?.rate
                    ? parseFloat(myPetCenterData.rate).toFixed(1)
                    : '0'
                }
                type="title"
                size={24}
              />
              <TextComponent text="Đánh giá" />
            </View> */}
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
              <TouchableOpacity
                key={item.id}
                style={styles.reportItem}
                onPress={() =>
                  onAppointmentItemPressHandle(item.status, item.title)
                }>
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
              </TouchableOpacity>
            ))}
          </View>
        </SectionComponent>
        <SectionComponent styles={{flex: 1}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={profileFeatureData}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{paddingVertical: 6}}
                onPress={() => onPressItem(item.screen)}>
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
        onLeftPress={() => setIsVisible(false)}
        onRightPress={logoutConfimHandle}
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
