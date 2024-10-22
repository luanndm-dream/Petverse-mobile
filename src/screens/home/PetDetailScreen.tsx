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

const PetDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const {petId, petName} = route?.params;
  const [petData, setPetData] = useState<any>();
  const [dogSubType, setDogSubType] = useState<any[]>([]);
  const [catSubType, setCatSubType] = useState<any[]>([]);
  const [petSubTypeName, setPetSubTypeName] = useState<string>('');
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
        }

        const subTypeId = petResponse?.data?.petSubTypeId; // Kiểm tra subTypeId
        console.log('subTypeId:', subTypeId);
        if (petResponse?.data?.petTypeId === 1) {
          // Nếu loại thú cưng là chó
          const subType = dogSubType.find(item => item.id === subTypeId); // Sử dụng dogSubType đã được cập nhật
          setPetSubTypeName(subType ? subType.subName : 'Không xác định'); // Sử dụng subName
        } else if (petResponse?.data?.petTypeId === 2) {
          // Nếu loại thú cưng là mèo
          const subType = catSubType.find(item => item.id === subTypeId); // Sử dụng catSubType đã được cập nhật
          setPetSubTypeName(subType ? subType.subName : 'Không xác định'); // Sử dụng subName
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, [route]);

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
            <TextComponent text={petName} type='title' />
            <RowComponent>
            <RowComponent  styles={styles.iconContainer}>
              <Gallery size={24} color={colors.grey}/>
              <TextComponent text="Album" styles={{marginLeft: 6}}/>
            </RowComponent>
            <RowComponent  styles={styles.iconContainer}>
              <Edit size={24} color={colors.grey}/>
              <TextComponent text="Chỉnh sửa" styles={{marginLeft: 6}}/>
            </RowComponent>
            </RowComponent>
          </View>
        </View>
      </ImageBackground>
      <SectionComponent>
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
  iconContainer: 
  {
    marginTop: 16,
    padding: 6,
    backgroundColor: colors.grey4,
    borderRadius: 16,
    marginRight: 8
}
});
