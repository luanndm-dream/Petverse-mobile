import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import useLoading from '@/hook/useLoading';
import {apiGetJobByPetCenterId} from '@/api/apiJob';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useAppSelector} from '@/redux';
import {EditServiceIcon, PetBreedingIcon} from '@/assets/svgs';

const WorkProfileScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [petCenterData, setPetCenterData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const getPetCenterJob = async () => {
        showLoading();
        await apiGetJobByPetCenterId(petCenterId as never).then((res: any) => {
          if (res.statusCode === 200) {
            hideLoading();
            setPetCenterData(res.data);
          } else {
            hideLoading();
            console.log('loading working profile fail');
          }
        });
      };
      getPetCenterJob();
    }, [petCenterId]),
  );
  console.log(petCenterData)

  const editServiceHandle = () => {
    navigate(STACK_NAVIGATOR_SCREENS.SERVICESCREEN)
  }

  const managePetBreedingHandle = () => {
    navigate(STACK_NAVIGATOR_SCREENS.MANAGEPETBREEDINGSCREEN)
  }

  const createJobHandle = () => {
    navigate(STACK_NAVIGATOR_SCREENS.CREATEJOBSCREEN);
  };
  
  const renderCreateJob = () => {
    return (
      <>
        <Image
          source={require('../../assets/images/FindJobBanner.jpg')}
          style={styles.image}
        />
        <TextComponent
          text="Chưa tìm thấy công việc của bạn, vui lòng tạo công việc"
          styles={styles.description}
          type="description"
        />
        <TouchableOpacity style={styles.container} onPress={createJobHandle}>
          <RowComponent>
            <MaterialCommunityIcons
              name="paw"
              size={24}
              color={colors.orange}
              style={{marginRight: 20}}
            />
            <TextComponent
              text="Tạo công việc"
              color={colors.orange}
              size={24}
            />
          </RowComponent>
        </TouchableOpacity>
      </>
    );
  };
  return (
    <Container
      title="Quản lí công việc"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
     <SectionComponent>
  {petCenterData.length === 0 ? (
    renderCreateJob() // Nếu mảng rỗng, hiển thị "Tạo công việc"
  ) : (
    <>
      <RowComponent
        justify="flex-start"
        styles={styles.itemContainer}
        onPress={editServiceHandle}>
        <EditServiceIcon width={40} height={40} />
        <TextComponent
          text="Tất cả dịch vụ"
          size={18}
          styles={{marginLeft: 24}}
        />
      </RowComponent>
      <RowComponent
        justify="flex-start"
        styles={styles.itemContainer}
        onPress={managePetBreedingHandle}>
        <PetBreedingIcon width={40} height={40} />
        <TextComponent
          text="Quản lí giống"
          size={18}
          styles={{marginLeft: 24}}
        />
      </RowComponent>
    </>
  )}
</SectionComponent>
    </Container>
  );
};

export default WorkProfileScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    backgroundColor: '#F8E8BD',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8B86D',
    borderStyle: 'dashed',
  },
  image: {
    height: 200,
    width: 200,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 24,
  },
  description: {
    paddingVertical: 12,
    textAlign: 'center',
  },
  itemContainer: {
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 6,
  },
});
