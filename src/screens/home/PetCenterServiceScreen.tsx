import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  Container,
  IconButtonComponent,
  PetCenterCardComponent,
  SectionComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {apiGetPetCenterByPetServiceId} from '@/api/apiPetCenter';
import {FlatList} from 'react-native-gesture-handler';
import useLoading from '@/hook/useLoading';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';

const PetCenterServiceScreen = () => {
  const route = useRoute<any>();
  const {idService, nameService} = route.params;
  const {goBack, navigate} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const navigation = useNavigation<any>();
  const serviceColors = [
    '#FFCDD2',
    '#FFF9C4',
    '#BBDEFB',
    '#C8E6C9',
    '#FFCCBC',
    '#D1C4E9',
  ];
  const [service, setService] = useState([]);

  useEffect(() => {
    showLoading();
    apiGetPetCenterByPetServiceId(idService).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setService(res.data.items);
      } else {
        console.log('lấy petcenter fail');
      }
    });
  }, []);

  const onPressItemHandle = (item: any) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETCENTERDETAILSCREEN, {
      petCenterId: item.id,
      petCenterName: item.name,
    });
  };
  return (
    <Container
      title={nameService}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <SectionComponent>
        <FlatList
          data={service}
          renderItem={({item}) => (
            <PetCenterCardComponent
              item={item}
              onPress={onPressItemHandle}
              serviceColors={serviceColors}
            />
          )}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </SectionComponent>
    </Container>
  );
};

export default PetCenterServiceScreen;

const styles = StyleSheet.create({});
