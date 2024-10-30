import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, FlatList, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import { Container, IconButtonComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { apiGetPetCenterByPetCenterId } from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import { VertifyIcon } from '@/assets/svgs';
import { Star } from 'iconsax-react-native';
import { priceFormater } from '@/utils/priceFormater';

const Tab = createMaterialTopTabNavigator();

const OverviewTab = ({ petCenterData }:any) => (
  <ScrollView contentContainerStyle={styles.tabContainer} scrollEnabled={false}>
    <TextComponent text={petCenterData.description} styles={styles.descriptionText} />
    <TextComponent text={`Số điện thoại: ${petCenterData.phoneNumber}`} />
  </ScrollView>
);

const ServicesTab = ({ petCenterData }:any) => (
  <FlatList
    data={petCenterData.petCenterServices}
    scrollEnabled={false}
    renderItem={({ item }) => (
      <View style={styles.serviceCard}>
        <TextComponent text={item.name} styles={styles.serviceName} />
        <TextComponent text={`Giá: ${priceFormater(item.price)}`} styles={styles.servicePrice} />
      </View>
    )}
    keyExtractor={(item) => item.petCenterServiceId.toString()}
    contentContainerStyle={styles.serviceList}
  />
);

const ReviewsTab = ({ petCenterData }:any) => (
  <View style={styles.tabContainer}>
    <TextComponent text="Hiện chưa có đánh giá." styles={styles.emptyText} />
    {/* Thêm danh sách đánh giá ở đây */}
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
        console.log('get petcenter detail data lỗi');
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
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: petCenterData.avatar }} style={styles.avatar} />
        <TextComponent text={petCenterData.name} type="title" styles={styles.centerName} />
        
        {petCenterData.isVerified && (
          <View style={styles.verificationContainer}>
            <VertifyIcon width={20} height={20} />
            <TextComponent text="Xác minh" styles={styles.verifiedText} />
          </View>
        )}

        <TextComponent text={petCenterData.address} styles={styles.addressText} />

        <View style={styles.ratingContainer}>
          <Star size={18} color={colors.primary} variant="Bold" />
          <TextComponent text={petCenterData.rate.toString()} styles={styles.rateText} />
        </View>

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.grey,
            tabBarIndicatorStyle: { backgroundColor: colors.primary },
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
      </ScrollView>
    </Container>
  );
};

export default PetCenterDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
    textAlign: 'center',
    marginBottom: 16,
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
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 12,
  },
  serviceList: {
    paddingBottom: 16,
  },
  serviceCard: {
    padding: 12,
    backgroundColor: colors.grey4,
    borderRadius: 8,
    marginRight: 10,
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
  certificationsList: {
    paddingBottom: 16,
  },
  certificateImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  contactContainer: {
    padding: 12,
    backgroundColor: colors.grey4,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 20,
  },
});