import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
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
import {apiGetPetByUserId, apiGetPetSubType} from '@/api/apiPet';
import useLoading from '@/hook/useLoading';
import {sizes} from '@/constants/sizes';

const MyPetScreen = () => {
  const navigation = useNavigation();
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const [pets, setPets] = useState<[]>([]);
  const [dogSubType, setDogSubType] = useState<any[]>([]);
  const [catSubType, setCatSubType] = useState<any[]>([]);
  console.log(pets);
  useEffect(() => {
    showLoading();
    Promise.all([
      apiGetPetSubType(1), // API cho loại chó
      apiGetPetSubType(2), // API cho loại mèo
      apiGetPetByUserId(userId), // API để lấy thú cưng của người dùng
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
    return (
      <View key={item.id.toString()} style={[styles.itemContainer]}>
        <Image
          source={{uri: item?.avatar}}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={{justifyContent: 'flex-start'}}>
          <TextComponent text={item.name} type="title" />
          <RowComponent>{/* <TextComponent text={item.}/> */}</RowComponent>
        </View>
      </View>
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
      }>
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
  },
  image: {
    width: 80,
    height: 80,
    alignItems: 'center',
    borderRadius: 12,
  },
});
