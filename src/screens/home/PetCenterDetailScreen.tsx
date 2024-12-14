import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  PopupComponent,
  RowComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {apiGetPetCenterByPetCenterId} from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import {priceFormater} from '@/utils/priceFormater';
import {TrophyIcon} from '@/assets/svgs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Star} from 'iconsax-react-native';
import {apiGetPetCenterRateByPetCenterId} from '@/api/apiPetCenterRate';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useAppSelector} from '@/redux';

const Tab = createMaterialTopTabNavigator();

const OverviewTab = ({petCenterData}: any) => (
  <View style={styles.tabContainer}>
    <View style={styles.overviewContainer}>
      <TrophyIcon width={60} height={60} />
      <View style={styles.contentOverviewContainer}>
        <RowComponent justify="space-between" styles={{marginBottom: 48}}>
          <RowComponent styles={[styles.overviewRow, {marginRight: 18}]}>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="briefcase-check"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={styles.textWrapper}>
              <TextComponent text={`${petCenterData?.yoe} năm`} type="title" />
              <TextComponent text="Kinh nghiệm" />
            </View>
          </RowComponent>
          <RowComponent styles={styles.overviewRow}>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="truck"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={styles.textWrapper}>
              <TextComponent
                text={petCenterData?.job?.haveTransport ? 'Có' : 'Không'}
                type="title"
              />
              <TextComponent text="Ship" />
            </View>
          </RowComponent>
        </RowComponent>
        <RowComponent justify="space-between">
          <RowComponent styles={[styles.overviewRow, {marginRight: 18}]}>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="image"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={styles.textWrapper}>
              <TextComponent
                text={petCenterData?.job?.havePhoto ? 'Có' : 'Không'}
                type="title"
              />
              <TextComponent text="Chụp ảnh" />
            </View>
          </RowComponent>
          <RowComponent styles={styles.overviewRow}>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="video"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={styles.textWrapper}>
              <TextComponent
                text={petCenterData?.job?.haveCamera ? 'Có' : 'Không'}
                type="title"
              />
              <TextComponent text="Video" />
            </View>
          </RowComponent>
        </RowComponent>
      </View>
    </View>
  </View>
);

const ServicesTab = ({petCenterData}: any) => {
  const navigation = useNavigation<any>();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedServiceName, setSelectedServiceName] = useState<string>('');
  const [serviceType, setServiceType] = useState();
  const [servicePrice, setServicePrice] = useState();
  const [isPopupVisible, setPopupVisible] = useState(false); // Trạng thái Popup
  const [selectedServiceUsageRate, setSelectedServiceUsageRate] = useState(0); // Tỷ lệ sử dụng

  const roleName = useAppSelector(state => state.auth.roleName);
  const isPetCenter = roleName === 'PetCenter';

  const handleServicePress = () => {
    // Hiển thị cảnh báo nếu dịch vụ gần quá tải
    if (selectedServiceUsageRate >= 0.5) {
      setPopupVisible(true);
    } else {
      // Điều hướng đến màn hình đặt dịch vụ
      navigation.navigate(STACK_NAVIGATOR_SCREENS.APPOINMENTSCREEN, {
        petCenterServiceId: selectedService,
        petCenterServiceName: selectedServiceName,
        type: serviceType,
        price: servicePrice,
        speciesId: null,
      });
    }
  };

  return (
    <>
      <View style={styles.tabContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={petCenterData.petCenterServices}
          renderItem={({item, index}) => {
            const usageRate =
              item.capacity > 0 ? item.currentUsage / item.capacity : 0;

            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedService(item.petCenterServiceId);
                  setSelectedServiceName(item.name);
                  setServiceType(item.type);
                  setServicePrice(item.price);
                  setSelectedServiceUsageRate(usageRate); // Cập nhật tỷ lệ sử dụng của dịch vụ
                }}
                style={[
                  styles.serviceCard,
                  {
                    backgroundColor: usageRate >= 0.5 ? '#FFFDE7' : '#FFFFFF', // Cảnh báo màu nền
                    borderColor:
                      selectedService === item.petCenterServiceId
                        ? colors.primary
                        : 'transparent',
                    borderWidth: 2,
                  },
                ]}>
                <RowComponent justify="space-between">
                  <TextComponent
                    text={item.name}
                    styles={styles.serviceName}
                    type="title"
                  />
                  <RowComponent
                    styles={{justifyContent: 'center', alignItems: 'center'}}>
                    <Star size={16} color={colors.primary} variant="Bold" />
                    <TextComponent
                      text={item.rate.toFixed(2)}
                      styles={{marginLeft: 4}}
                      type="title"
                    />
                  </RowComponent>
                </RowComponent>

                <TextComponent
                  text={`Giá: ${priceFormater(item.price)}`}
                  styles={styles.servicePrice}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item.petCenterServiceId.toString()}
          contentContainerStyle={styles.serviceList}
        />
        <ButtonComponent
          text={isPetCenter ? 'Chỉ khách hàng đặt' : 'Đặt dịch vụ'}
          type="primary"
          styles={{width: '100%'}}
          disable={!selectedService || roleName === 'PetCenter'}
          onPress={handleServicePress}
        />
      </View>

      {/* PopupComponent */}
      <PopupComponent
        description="Hiện tại dịch vụ này đang có khả năng bị quá tải, bạn hãy cân nhắc trước khi đặt."
        isVisible={isPopupVisible}
        iconColor={colors.yellow}
        buttonLeftColor={colors.grey}
        iconName="alert-circle"
        leftTitle="Huỷ"
        onClose={() => setPopupVisible(false)}
        onLeftPress={() => setPopupVisible(false)}
        onRightPress={() => {
          // Điều hướng đến đặt dịch vụ nếu người dùng xác nhận
          navigation.navigate(STACK_NAVIGATOR_SCREENS.APPOINMENTSCREEN, {
            petCenterServiceId: selectedService,
            petCenterServiceName: selectedServiceName,
            type: serviceType,
            price: servicePrice,
            speciesId: null,
          });
          setPopupVisible(false); // Ẩn Popup
        }}
        rightTitle="Xác nhận"
        title="Cảnh báo"
      />
    </>
  );
};

const ReviewsTab = ({petCenterRate}: any) => {
  console.log(petCenterRate);
  const serviceColors = [
    '#FFCDD2',
    '#FFF9C4',
    '#BBDEFB',
    '#C8E6C9',
    '#FFCCBC',
    '#D1C4E9',
  ];
  return (
    <View style={styles.tabContainer}>
      {petCenterRate && petCenterRate.length > 0 ? (
        <FlatList
          data={petCenterRate}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.reviewCard}>
              <View style={styles.headerRow}>
                <Image
                  source={
                    item?.avatar
                      ? {uri: item?.avatar}
                      : require('../../assets/images/DefaultAvatar.jpg')
                  }
                  style={styles.avatarImage}
                />
                <View style={styles.reviewContent}>
                  <TextComponent
                    text={item.userName}
                    styles={styles.userName}
                  />
                  <View style={styles.serviceNameContainer}>
                    <TextComponent
                      text={item.serviceName}
                      styles={styles.serviceNameText}
                    />
                  </View>
                </View>

                {/* Đánh giá với ngôi sao */}
                <View style={styles.ratingContainer}>
                  <Star size={16} color={colors.primary} variant="Bold" />
                  <TextComponent
                    text={item.rate.toString()}
                    styles={styles.rateText}
                  />
                </View>
              </View>

              {/* Mô tả đánh giá */}
              <RowComponent
                justify="space-between"
                styles={styles.rowComponent}>
                <TextComponent
                  text={item.description || 'Không có nhận xét'}
                  styles={styles.description}
                />
                <TextComponent
                  text={item.createdDate}
                  styles={styles.dateText}
                />
              </RowComponent>
            </View>
          )}
          contentContainerStyle={styles.reviewList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <TextComponent
            text="Hiện chưa có đánh giá."
            styles={styles.emptyText}
          />
        </View>
      )}
    </View>
  );
};
const PetCenterDetailScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const userId = useAppSelector(state => state.auth.userId);
  const myPetCenterId = useAppSelector(state => state.auth.petCenterId);
  const {petCenterId, petCenterName, userIdOfPetCenter, isBook} = route.params;
  const [petCenterData, setPetCenterData] = useState<any>();
  const [petCenterRate, setPetCenterRate] = useState<any>([]);
  const [isVisible, setisVisible] = useState(false);
  useEffect(() => {
    showLoading();
    Promise.all([
      apiGetPetCenterByPetCenterId(petCenterId),
      apiGetPetCenterRateByPetCenterId(petCenterId),
    ]).then(([centerRes, rateRes]: any) => {
      console.log(centerRes, 'rateRes', rateRes);
      if (centerRes.statusCode === 200 && rateRes.statusCode === 200) {
        hideLoading();
        setPetCenterData(centerRes.data);
        setPetCenterRate(rateRes.data.items);
      }
    });
  }, []);
  if (!petCenterData) return null;

  const onMessaging = () => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.CHATDETAILSCREEN, {
      chatId: `${userId}-${userIdOfPetCenter}`,
      name: petCenterData.name,
      avatar: petCenterData.avatar,
      toUserId: userIdOfPetCenter,
    });
  };

  return (
    <>
      <Container
        title={petCenterName}
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }
        right={
          myPetCenterId != petCenterId && (
            <IconButtonComponent
              name="chat-plus"
              size={30}
              color={colors.grey}
              onPress={onMessaging}
            />
          )
        }>
        <View style={styles.container}>
          <Image source={{uri: petCenterData.avatar}} style={styles.avatar} />
          {/* <TextComponent text={petCenterData.name} type="title" styles={styles.centerName} /> */}
          {/* {petCenterData.isVerified && (
          <View style={styles.verificationContainer}>
            <VertifyIcon width={20} height={20} />
            <TextComponent text="Xác minh" styles={styles.verifiedText} />
          </View>
        )} */}
          <TextComponent text="Mô tả" type="title" />
          <TextComponent
            text={petCenterData.description}
            styles={styles.addressText}
          />
          <TextComponent
            text="Địa chỉ"
            type="title"
            styles={{marginVertical: 6}}
          />
          <TextComponent text={petCenterData.address} size={16} />
          {/* <View style={styles.ratingContainer}>
          <Star size={18} color={colors.primary} variant="Bold" />
          <TextComponent text={petCenterData.rate.toString()} styles={styles.rateText} />
        </View> */}

          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.grey,
              tabBarIndicatorStyle: {backgroundColor: colors.primary},
              tabBarPressColor: 'transparent',
              // tabBarPressOpacity: 1,
              tabBarAndroidRipple: {radius: 0},
              tabBarStyle: {
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
              },
            }}
            initialRouteName={isBook ? 'Dịch vụ' : 'Tổng quan'}>
            <Tab.Screen name="Tổng quan">
              {() => <OverviewTab petCenterData={petCenterData} />}
            </Tab.Screen>
            <Tab.Screen name="Dịch vụ">
              {() => <ServicesTab petCenterData={petCenterData} />}
            </Tab.Screen>
            <Tab.Screen name="Đánh giá">
              {() => <ReviewsTab petCenterRate={petCenterRate} />}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </Container>
      <PopupComponent
        description="Hiện tại dịch vụ này của trung tâm đang có khả năng sẽ bị quá tải, bạn hãy cân nhắc trước khi đặt"
        isVisible={isVisible}
        iconColor={colors.yellow}
        iconName="alert-circle"
        leftTitle="Huỷ"
        onClose={() => setisVisible(false)}
        onLeftPress={() => setisVisible(false)}
        onRightPress={() => {}}
        rightTitle="Xác nhận"
        title="Cảnh báo"
      />
    </>
  );
};

export default PetCenterDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  avatar: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
  },
  centerName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  verifiedText: {
    color: colors.primary,
    marginLeft: 4,
  },
  addressText: {
    color: colors.grey,
    // textAlign: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rateText: {
    marginLeft: 8,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    flex: 1,
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  serviceList: {
    paddingBottom: 16,
  },
  serviceCard: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: colors.primary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 20,
  },
  overviewContainer: {
    height: 230,
    backgroundColor: '#ffeec6',
    borderRadius: 12,
    padding: 6,
  },
  contentOverviewContainer: {
    alignSelf: 'center',
    width: '90%',
    paddingHorizontal: 20,
    // backgroundColor: 'white'
  },
  // itemOverview: {
  //   width: 40,
  //   height: 40,
  //   backgroundColor: colors.white,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  reviewCard: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewServiceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rateText2: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewList: {
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  reviewContent: {
    flex: 1,
    // justifyContent: 'flex-start'
  },

  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
  },
  rowComponent: {
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.grey,
  },
  serviceNameContainer: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  serviceNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
  },
  overviewRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemOverview: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    marginLeft: 12,
    flex: 1, // Đảm bảo text chiếm không gian còn lại
    justifyContent: 'center', // Giữ text nằm giữa
  },
});
