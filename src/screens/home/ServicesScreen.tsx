import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Container, IconButtonComponent, TextComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {apiGetPetCenterByPetCenterId} from '@/api/apiPetCenter';
import {useAppSelector} from '@/redux';
import useLoading from '@/hook/useLoading';
import {
  CatIcon,
  DoctorIcon,
  DogIcon,
  PetBoardingIcon,
  PetGroomingIcon,
  PetTrainingIcon,
} from '@/assets/svgs';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
const ServiceScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [petCenterData, setPetCenterData] = useState<any>(null);

  const getServiceIcon = (label: string, width = 32, height = 32) => {
    switch (label) {
      case 'Trông thú':
        return <PetBoardingIcon width={width} height={height} />;
      case 'Dịch vụ spa':
        return <PetGroomingIcon width={width} height={height} />;
      case 'Huấn luyện':
        return <PetTrainingIcon width={width} height={height} />;
      case 'Bác sĩ thú y':
        return <DoctorIcon width={width} height={height} />;
      case 'Chó':
        return <DogIcon width={width} height={height} />;
      case 'Mèo':
        return <CatIcon width={width} height={height} />;
      default:
        return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const getServices = () => {
        apiGetPetCenterByPetCenterId(petCenterId as never).then((res: any) => {
          if (res.statusCode === 200) {
            hideLoading();
            setPetCenterData(res?.data);
          } else {
            console.log('Lấy dữ liệu services thất bại', res.error);
          }
        });
      };
      getServices();
    }, []),
  );

  const handleServicePress = (service: any) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.EDITSERVICESCREEN, {
      service: service,
    });
  };

  const renderServiceItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServicePress(item)}>
      <View style={styles.iconContainer}>{getServiceIcon(item.name)}</View>
      <View style={styles.textContainer}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>Mô tả: {item.description}</Text>
        <Text style={styles.servicePrice}>Giá: {item.price} VND</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container
      title="Tất cả dịch vụ"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      {petCenterData && petCenterData.petCenterServices ? (
        <FlatList
          data={petCenterData.petCenterServices}
          renderItem={renderServiceItem}
          keyExtractor={(item: any) => item.petCenterServiceId.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <TextComponent
          text="Không có dịch vụ nào"
          styles={styles.noServiceText}
        />
      )}
    </Container>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginTop: 8,
  },
  noServiceText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 20,
  },
});
