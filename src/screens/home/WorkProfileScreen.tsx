import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useCallback, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import useLoading from '@/hook/useLoading';
import { apiGetJobByPetCenterId } from '@/api/apiJob';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';
import { useAppSelector } from '@/redux';

const WorkProfileScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const petCenterId = useAppSelector((state => state.auth.petCenterId))
  const [petCenterData, setPetCenterData] = useState([])
  useFocusEffect(
    useCallback(()=>{
      const getPetCenterJob = async () => {
        showLoading()
        await apiGetJobByPetCenterId(petCenterId as never).then((res: any)=>{
          console.log(res)
          if(res.statusCode === 200){
            hideLoading()
            console.log(res)
          }else{
            hideLoading()
            console.log('loading working profile fail')
          }
        })
      }
      getPetCenterJob()
    },[petCenterId])
  )
  const createJobHandle = ()=>{
    navigate(STACK_NAVIGATOR_SCREENS.CREATEJOBSCREEN)
  }
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
});
