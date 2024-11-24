import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useAppSelector} from '@/redux';
import {apiGetPetByUserId, apiGetPetBreed} from '@/api/apiPet';
import useLoading from '@/hook/useLoading';
import {sizes} from '@/constants/sizes';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {ageFormatter} from '@/utils/AgeFormatter';
import {async} from '@firebase/util';

const MyPetScreen = () => {
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const [pets, setPets] = useState<[]>([]);
  const [dogSubType, setDogSubType] = useState<any[]>([]);
  const [catSubType, setCatSubType] = useState<any[]>([]);

  const onPressItem = (petId: number, petName: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETDETAILSCREEN, {
      petId: petId,
      petName: petName,
    });
  };

  useEffect(() => {
    showLoading();
    Promise.all([apiGetPetBreed(1), apiGetPetBreed(2)])
      .then(([dogResponse, catResponse]: any) => {
        if (dogResponse.statusCode === 200) {
          setDogSubType(dogResponse.data.items);
        }
        if (catResponse.statusCode === 200) {
          setCatSubType(catResponse.data.items);
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      const getMyPets = async () => {
        showLoading();
        await apiGetPetByUserId(userId)
          .then((res: any) => {
            if (res.statusCode === 200) {
              setPets(res?.data?.items);
              hideLoading();
            } else {
              console.log('Load pet fail');
            }
          })
          .finally(() => {
            hideLoading()
          });
      };
      getMyPets();
    }, [userId]),
  );

  const renderPetItem = (item: any) => {
    return (
      <TouchableOpacity
        key={item.id.toString()}
        style={[styles.itemContainer, styles.shadowProps]}
        onPress={() => onPressItem(item.id, item.name)}
        activeOpacity={0.7}>
        <Image
          source={{uri: item?.avatar}}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <TextComponent
            text={item.name}
            type="title"
            color={colors.white}
            styles={styles.petName}
          />
          <TextComponent
            text={ageFormatter(item.birthDate)}
            color={colors.white}
            size={12}
            styles={styles.age}
            type='title'
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container
      isScroll={false}
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
          color={colors.grey}
          onPress={() =>
            navigation.navigate(STACK_NAVIGATOR_SCREENS.ADDPETSCREEN)
          }
        />
      }>
      <FlatList
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={pets}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({item}) => renderPetItem(item)}
        ListEmptyComponent={
          <TextComponent
            text="Bạn chưa có thú cưng nào, hãy thêm thú cưng mới!"
            color={colors.grey}
            size={16}
            type="title"
            styles={styles.emptyText}
          />
        }
      />
    </Container>
  );
};

export default MyPetScreen;

const styles = StyleSheet.create({
  listContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemContainer: {
    width: '48.5%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  shadowProps: {
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.grey4,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  age: {
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    // backgroundColor: colors.primary
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 16,
    color: colors.grey,
  },

});