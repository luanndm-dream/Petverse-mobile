import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { Container, IconButtonComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { apiGetPetCenterByPetCenterId } from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import { priceFormater } from '@/utils/priceFormater';

const Tab = createMaterialTopTabNavigator();

const OverviewTab = ({ petCenterData }: any) => (
  <View style={styles.tabContainer}>
    <View style={styles.overviewContainer}>
       
    </View>
  </View>
);

const ServicesTab = ({ petCenterData }: any) => (
  <View style={styles.tabContainer}>
    <FlatList
      data={petCenterData.petCenterServices}
      renderItem={({ item }) => (
        <View style={styles.serviceCard}>
          <TextComponent text={item.name} styles={styles.serviceName} />
          <TextComponent text={`Giá: ${priceFormater(item.price)}`} styles={styles.servicePrice} />
        </View>
      )}
      keyExtractor={(item) => item.petCenterServiceId.toString()}
      contentContainerStyle={styles.serviceList}
    />
  </View>
);

const ReviewsTab = ({ petCenterData }: any) => (
  <View style={styles.tabContainer}>
    <TextComponent text="Hiện chưa có đánh giá." styles={styles.emptyText} />
  </View>
);

const PetCenterDetailScreen = () => {
  const { goBack } = useCustomNavigation();
  const { showLoading, hideLoading } = useLoading();
  const route = useRoute<any>();
  const { petCenterId, petCenterName } = route.params;
  const [petCenterData, setPetCenterData] = useState<any>();

  useEffect(() => {
    showLoading();
    apiGetPetCenterByPetCenterId(petCenterId).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setPetCenterData(res.data);
      } else {
        console.log('Lấy dữ liệu petcenter thất bại');
      }
    });
  }, []);

  if (!petCenterData) return null;

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
        <Image source={{ uri: petCenterData.avatar }} style={styles.avatar} />
        {/* <TextComponent text={petCenterData.name} type="title" styles={styles.centerName} /> */}
        {/* {petCenterData.isVerified && (
          <View style={styles.verificationContainer}>
            <VertifyIcon width={20} height={20} />
            <TextComponent text="Xác minh" styles={styles.verifiedText} />
          </View>
        )} */}
        <TextComponent text='Mô tả' type='title'/>
        <TextComponent text={petCenterData.description} styles={styles.addressText}  />

        {/* <View style={styles.ratingContainer}>
          <Star size={18} color={colors.primary} variant="Bold" />
          <TextComponent text={petCenterData.rate.toString()} styles={styles.rateText} />
        </View> */}

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.grey,
            tabBarIndicatorStyle: { backgroundColor: colors.primary },
            tabBarPressColor: 'transparent',
            // tabBarPressOpacity: 1,
            tabBarAndroidRipple: {radius: 0},
            tabBarStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
            }
          }}>
          <Tab.Screen name="Tổng quan">
            {() => <OverviewTab petCenterData={petCenterData} />}
          </Tab.Screen>
          <Tab.Screen name="Dịch vụ">
            {() => <ServicesTab petCenterData={petCenterData} />}
          </Tab.Screen>
          <Tab.Screen name="Đánh giá">
            {() => <ReviewsTab petCenterData={petCenterData} />}
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
    borderRadius: 8
    // marginBottom: 16,
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
    // padding: 16,
    marginTop: 16
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
    backgroundColor: colors.grey4,
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
    borderRadius: 12
  }
});