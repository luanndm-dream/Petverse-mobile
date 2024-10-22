import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiGetPetByPetId, apiGetPetSubType} from '@/api/apiPet';
import useLoading from '@/hook/useLoading';
import {
  Container,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {FlatList} from 'react-native-gesture-handler';
import {Camera, Edit, Edit2, Gallery} from 'iconsax-react-native';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';

const PetDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const {petId, petName} = route?.params;
  const [petData, setPetData] = useState<any>();
  const [dogSubType, setDogSubType] = useState<any[]>([]);
  const [catSubType, setCatSubType] = useState<any[]>([]);
  const [petSubTypeName, setPetSubTypeName] = useState<string>('');
//   console.log(petData);
  const petInfo = [
    {
      label: 'Tên',
      value: petData?.name,
    },
    {
      label: 'Loài',
      value: petData?.petTypeId === 1 ? 'Chó' : 'Mèo',
    },
    {
      label: 'Giống',
      value: petSubTypeName,
    },
    {
      label: 'Tuổi',
      value: petData?.age,
    },
    {
      label: 'Giới tính',
      value: petData?.gender === 1 ? 'Đực' : 'Cái',
    },
    {
      label: 'Cân nặng',
      value: petData?.weight,
    },
    {
      label: 'Triệt sản',
      value: petData?.sterilized === 1 ? 'Đã triệt sản' : 'Chưa triệt sản',
    },
    // {
    //     label: 'Giới thiệu',
    //     value: petData?.weight
    // }
  ];
  
  const onPressIcon = (type: string) => {
    if(type === 'album'){
        navigation.navigate(STACK_NAVIGATOR_SCREENS.PETALBUMSCREEN, {
            petName: petData.name,
            petPhotos: petData.petPhotos
        })
    }
  }

  useEffect(() => {
    showLoading();
    Promise.all([
      apiGetPetSubType(1),
      apiGetPetSubType(2),
      apiGetPetByPetId(petId),
    ])
      .then(([dogResponse, catResponse, petResponse]: any) => {
        if (dogResponse.statusCode === 200) {
          setDogSubType(dogResponse?.data?.items);
        }
        if (catResponse.statusCode === 200) {
          setCatSubType(catResponse?.data?.items);
        }
        if (petResponse?.statusCode === 200) {
          setPetData(petResponse?.data);
          
          // Xử lý tìm petSubTypeName ở đây, sau khi đã có đầy đủ data
          const subTypeId = petResponse?.data?.petSubTypeId;
          if (petResponse?.data?.petTypeId === 1) {
            const subType = dogResponse?.data?.items.find(
              (item: any) => item.id === subTypeId
            );
            setPetSubTypeName(subType ? subType.subName : 'Không xác định');
          } else if (petResponse?.data?.petTypeId === 2) {
            const subType = catResponse?.data?.items.find(
              (item: any) => item.id === subTypeId
            );
            setPetSubTypeName(subType ? subType.subName : 'Không xác định');
          }
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, [petId]); 

  const renderInfoItem = (label: string, value: any, isLastItem: boolean) => {
    return (
      <RowComponent
        justify="space-between"
        styles={[styles.infoItem, !isLastItem && styles.borderBottom]}>
        <TextComponent text={label} size={16} />
        <TextComponent text={value} size={18} type="title" />
      </RowComponent>
    );
  };
  return (
    <Container
      isScroll={true}
      title={petName}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={() => navigation.goBack()}
        />
      }>
      <ImageBackground
        source={require('../../assets/images/BannerAvatarPet.png')}
        style={styles.backgroundImage}>
        {petData?.avatar && (
          <Image source={{uri: petData?.avatar}} style={styles.avatar} />
        )}
        <View style={styles.editContainer}>
          <View>
            <TextComponent text={petName} type="title" />
            <RowComponent>
              <RowComponent styles={styles.iconContainer} onPress={() => onPressIcon('album')}>
                <Gallery size={24} color={colors.grey} />
                <TextComponent text="Album" styles={{marginLeft: 6}} />
              </RowComponent>
              <RowComponent styles={styles.iconContainer}>
                <Edit size={24} color={colors.grey} />
                <TextComponent text="Chỉnh sửa" styles={{marginLeft: 6}} />
              </RowComponent>
            </RowComponent>
          </View>
        </View>
      </ImageBackground>
      <SectionComponent>
        <TextComponent text='Giới thiệu' type='title'/>
        <TextComponent text={petData?.description.trim()} type='description'/>
        <FlatList
          contentContainerStyle={{
            backgroundColor: 'white',
            paddingHorizontal: 12,
            marginTop: 25,
            borderRadius: 12,
          }}
          scrollEnabled={false}
          data={petInfo}
          renderItem={({item, index}) =>
            renderInfoItem(item.label, item.value, index === petInfo.length - 1)
          }
        />
        {/* <TextComponent text='Hình ảnh' type='title'/> */}

      </SectionComponent>
    </Container>
  );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  editContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: colors.grey4,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -180}, {translateY: -40}],
  },
  infoItem: {
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  iconContainer: {
    marginTop: 16,
    padding: 6,
    backgroundColor: colors.grey4,
    borderRadius: 16,
    marginRight: 8,
  },
});
