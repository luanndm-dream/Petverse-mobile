import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAppSelector} from '@/redux';
import {apiGetPetByUserId, apiGetPetBreed} from '@/api/apiPet';
import useLoading from '@/hook/useLoading';
import {sizes} from '@/constants/sizes';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';
import { ageFormatter } from '@/utils/AgeFormatter';

const MyPetScreen = () => {
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const [pets, setPets] = useState<[]>([]);
  const [dogSubType, setDogSubType] = useState<any[]>([]);
  const [catSubType, setCatSubType] = useState<any[]>([]);


  const onPressItem = (petId:number, petName: string)=>{
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETDETAILSCREEN, {
      petId: petId,
      petName: petName
    })
  }
  useEffect(() => {
    showLoading();
    Promise.all([
      apiGetPetBreed(1),
      apiGetPetBreed(2),
      apiGetPetByUserId(userId),
    ])
      .then(([dogResponse, catResponse, petResponse]: any) => {
        // Kiểm tra và thiết lập dữ liệu
        if (dogResponse.statusCode === 200) {
          setDogSubType(dogResponse.data.items);
        }
        if (catResponse.statusCode === 200) {
          setCatSubType(catResponse.data.items);
        }
        if (petResponse.statusCode === 200) {
          setPets(petResponse.data.items);
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, [userId]);

  
  const renderPetItem = (item: any) => {
    let breed = '';
    if (item.speciesId === 1) {
      const subType = dogSubType.find(
        subType => subType.id === item.breedId,
      );
      breed = subType ? subType.name : 'Không xác định';
    } else if (item.petTypeId === 2) {
      const subType = catSubType.find(
        subType => subType.id === item.breedId,
      );
      breed = subType ? subType.name : 'Không xác định';
    }

    return (
      <TouchableOpacity key={item.id.toString()} style={styles.itemContainer} onPress={()=>onPressItem(item.id, item.name)}>
        <Image
          source={{uri: item?.avatar}}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.itemInfoContainer}>
          <TextComponent text={item.name} type="title" styles={{marginTop: 6}}/>
          <RowComponent justify="space-between" styles={styles.row}>
            <TextComponent text={`${breed}`} size={12} />
            <View style={styles.ageContainer}>
              <TextComponent text={ageFormatter(item.birthDate)} />
            </View>
          </RowComponent>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Container
      isScroll={true}
      title="Thú cưng của tôi"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={() => navigation.goBack()}
        />
      }
      right={
        <IconButtonComponent
          name="plus"
          size={30}
          color={colors.dark}
          onPress={() => navigation.navigate(STACK_NAVIGATOR_SCREENS.ADDPETSCREEN)}
        />
      }
      >
      <SectionComponent>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          scrollEnabled={false}
          numColumns={2}
          data={pets}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({item}) => renderPetItem(item)}
        />
      </SectionComponent>
    </Container>
  );
};

export default MyPetScreen;

const styles = StyleSheet.create({
  itemContainer: {
    width: '45%',
    height: 170,
    margin: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    alignItems: 'center',
    borderRadius: 12,
  },
  row: {
    // marginTop: 8,
  },
  ageContainer: {
    padding: 3,
    backgroundColor: colors.secondary,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  itemInfoContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 6,
  },
});
