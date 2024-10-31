import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRoute} from '@react-navigation/native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
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

const Tab = createMaterialTopTabNavigator();

const OverviewTab = ({petCenterData}: any) => (
  <View style={styles.tabContainer}>
    <View style={styles.overviewContainer}>
      <TrophyIcon width={60} height={60} />
      <View style={styles.contentOverviewContainer}>
        <RowComponent justify="space-between" styles={{marginBottom: 48}}>
          <RowComponent>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="briefcase-check"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={{marginLeft: 12}}>
              <TextComponent text={`${petCenterData?.yoe} năm`} type="title" />
              <TextComponent text="Kinh nghiệm" />
            </View>
          </RowComponent>
          <RowComponent>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="paw"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={{marginLeft: 12}}>
              <TextComponent text={`${petCenterData?.numPet}`} type="title" />
              <TextComponent text="Đã làm việc" />
            </View>
          </RowComponent>
        </RowComponent>
        <RowComponent justify="space-between">
          <RowComponent>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="briefcase-check"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={{marginLeft: 12}}>
              <TextComponent text={`${petCenterData?.yoe} năm`} type="title" />
              <TextComponent text="Kinh nghiệm" />
            </View>
          </RowComponent>
          <RowComponent>
            <View style={styles.itemOverview}>
              <MaterialCommunityIcons
                name="paw"
                size={24}
                color={colors.dark}
              />
            </View>
            <View style={{marginLeft: 12}}>
              <TextComponent text={`${petCenterData?.numPet}`} type="title" />
              <TextComponent text="Đã làm việc" />
            </View>
          </RowComponent>
        </RowComponent>
      </View>
    </View>
  </View>
);

const ServicesTab = ({petCenterData}: any) => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  return (
    <View style={styles.tabContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        data={petCenterData.petCenterServices}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => setSelectedService(item.petCenterServiceId)}
            style={[
              styles.serviceCard,
              {
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
        )}
        keyExtractor={item => item.petCenterServiceId.toString()}
        contentContainerStyle={styles.serviceList}
      />
      <ButtonComponent
        text="Đặt dịch vụ"
        type="primary"
        disable={!selectedService}
      />
    </View>
  );
};

const ReviewsTab = ({ petCenterRate }: any) => {
  return (
    <View style={styles.tabContainer}>
      {petCenterRate && petCenterRate.length > 0 ? (
        <FlatList
          data={petCenterRate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.headerRow}>
                <TextComponent
                  text={`Dịch vụ: ${item.petServiceName}`}
                  type="title"
                  styles={styles.reviewServiceName}
                />
                <View style={styles.ratingContainer}>
                  <Star size={16} color={colors.primary} variant="Bold" />
                  <TextComponent text={item.rate.toString()} styles={styles.rateText} />
                </View>
              </View>
              <TextComponent 
                text={`Đánh giá: ${item.description || 'Không có nhận xét'}`}
                styles={styles.description} 
              />
            </View>
          )}
          contentContainerStyle={styles.reviewList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <TextComponent text="Hiện chưa có đánh giá." styles={styles.emptyText} />
        </View>
      )}
    </View>
  );
};
const PetCenterDetailScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const {petCenterId, petCenterName} = route.params;
  const [petCenterData, setPetCenterData] = useState<any>();
  const [petCenterRate, setPetCenterRate] = useState<any>([]);

  useEffect(() => {
    showLoading();
    Promise.all([
      apiGetPetCenterByPetCenterId(petCenterId),
      apiGetPetCenterRateByPetCenterId(petCenterId),
    ]).then(([centerRes, rateRes]: any) => {
      if (centerRes.statusCode === 200 && rateRes.statusCode === 200) {
       
        hideLoading();
        setPetCenterData(centerRes.data);
        setPetCenterRate(rateRes.data.items);
      }
    });
  }, []);
  if (!petCenterData) return null;
  // console.log('petCenterData', petCenterData);
  return (
    <Container
      title={petCenterName}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
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
        <TextComponent text="Địa chỉ" type="title"/>
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
          // initialRouteName="Dịch vụ"
        >
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
    height: 200,
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
    padding: 6
  },
  contentOverviewContainer: {
    alignSelf: 'center',
    width: '90%',
    paddingHorizontal: 20,
    // backgroundColor: 'white'
  },
  itemOverview: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
 
});
