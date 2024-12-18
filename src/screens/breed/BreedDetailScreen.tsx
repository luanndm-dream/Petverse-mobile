import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  RowComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiGetCenterBreedByCenterBreedId} from '@/api/apiCenterBreed';
import useLoading from '@/hook/useLoading';
import Icon from 'react-native-vector-icons/Feather';
import {
  apiGetBreedAppointmentHistoryByUserId,
  apiGetUserBreedAppointmentHistory,
} from '@/api/apiAppoinment';
import {useAppDispatch, useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import { addBreedHistory } from '@/redux/reducers';

const DEFAULT_IMAGE = require('../../assets/images/DefaultPetAvatar.jpg');

const BreedDetailScreen = () => {
  const {width} = Dimensions.get('window');
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const userId = useAppSelector(state => state.auth.userId);
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const dispatch = useAppDispatch()
  const {centerBreedId, breedName} = route.params;
  const [breedCenterData, setBreedCenterData] = useState<any>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // console.log('breedCenterData',breedCenterData )

  useEffect(() => {
    showLoading();
    apiGetCenterBreedByCenterBreedId(centerBreedId).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setBreedCenterData(res.data);
      } else {
        // console.log('get center breed thất bại');
      }
    });
  }, []);
  useEffect(() => {
    showLoading();
    apiGetUserBreedAppointmentHistory(userId).then((res:any) => {
      if(res.statusCode === 200){
        hideLoading()
        dispatch(addBreedHistory(res.data.breedAppointemnts))
      }else{
        // console.log('get lich su dat phoi giong that bai')
        hideLoading()
      }
    })

    // apiGetUserBreedAppointmentHistory(userId).then((res: any) => {
    //   if (res.statusCode === 200) {
    //     hideLoading();
    //     dispatch(addBreedHistory(res.data.items))
    //     setHistoryBreed(res.data.items);
    //   } else {
    //     console.log('get center breed thất bại');
    //   }
    // });
  }, []);

  const formatPrice = (price: number) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 2:
        return colors.green;
      case 1:
        return colors.orange;
      case -1:
        return colors.red;
      default:
        return colors.grey;
    }
  };

  const renderStatus = (status: number) => {
    switch (status) {
      case 2:
        return 'Đã được kiểm duyệt';
      case 1:
        return 'Đang kiểm duyệt';
      case -1:
        return 'Đã bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  const renderStatusIcon = (status: number) => {
    switch (status) {
      case 2:
        return 'check-circle';
      case 1:
        return 'clock';
      case -1:
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  const renderImage = ({item}: {item: any}) => (
    <Image
      source={{uri: item.image}}
      style={[styles.image, {width}]}
      resizeMode="cover"
    />
  );

  const onPressBreedHandle = (
    petCenterId: string  ,
    breedName: string,
    breedId: string,
    type: number,
    price: number,
    speciesId: number
  ) => {
    // if()
    navigation.navigate(STACK_NAVIGATOR_SCREENS.APPOINMENTSCREEN, {
      petCenterId: petCenterId,
      petCenterServiceId: breedId,
      petCenterServiceName: `phối ${breedName}`,
      type: 0,
      price: price,
      speciesId,
    });
  };

  return (
    <Container
      title={breedName}
      isScroll={false}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {breedCenterData?.images && breedCenterData.images.length > 0 ? (
            <>
              <FlatList
                data={breedCenterData.images}
                horizontal
                pagingEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderImage}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              />
              <View style={styles.pagination}>
                {breedCenterData.images.map((_: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <Image
              source={DEFAULT_IMAGE}
              style={[styles.image, {width}]}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.infoContainer}>
          <RowComponent justify="space-between">
            <Text style={styles.name}>{breedCenterData?.name}</Text>
            <View
              style={{
                padding: 8,
                backgroundColor: colors.primary,
                borderRadius: 24,
              }}>
              <TextComponent
                text={breedCenterData?.speciesName}
                type="bigTitle"
                color={colors.white}
              />
            </View>

            {/* <Text style={styles.name}>{breedCenterData?.speciesName}</Text> */}
          </RowComponent>

          <Text style={styles.price}>
            {formatPrice(breedCenterData?.price)}
          </Text>
          <View style={styles.statusContainer}>
            <Icon
              name={renderStatusIcon(breedCenterData?.status)}
              size={20}
              color={getStatusColor(breedCenterData?.status)}
            />
            <Text
              style={[
                styles.status,
                {color: getStatusColor(breedCenterData?.status)},
              ]}>
              {renderStatus(breedCenterData?.status)}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{breedCenterData?.description}</Text>
          <Text style={styles.sectionTitle}>Thông tin trung tâm</Text>
          <View style={styles.centerInfo}>
            <Icon name="home" size={20} color={colors.dark} />
            <Text style={styles.centerName}>
              {breedCenterData?.petCenterName}
            </Text>
          </View>
        </View>
      </View>
      {breedCenterData?.status === 2 && (
        <ButtonComponent
          text="Đặt phối ngay"
          type="primary"
          onPress={() =>
            onPressBreedHandle(
              breedCenterData.petCenterId,
              breedCenterData.name,
              breedCenterData.id,
              1,
              breedCenterData.price,
              breedCenterData.speciesId
            )
          }
        />
      )}
    </Container>
  );
};

export default BreedDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: colors.grey,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 16,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginTop: -15,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  status: {
    marginLeft: 8,
    fontSize: 16,
  },
  detailsContainer: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.grey,
    lineHeight: 24,
    marginBottom: 16,
  },
  centerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  centerName: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.dark,
  },
  contactButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
