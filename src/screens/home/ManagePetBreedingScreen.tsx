import {StyleSheet, Text, View, FlatList, Animated, Image} from 'react-native';
import React, {useCallback, useState, useRef} from 'react';
import {
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import {apiGetCenterBreedByPetCenterId, apiUpdateBreedCenterAvailability} from '@/api/apiCenterBreed';
import {useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  TouchableOpacity,
  Swipeable,
  RectButton,
} from 'react-native-gesture-handler';
import {priceFormater} from '@/utils/priceFormater';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface BreedItem {
  cancelReason: string;
  description: string;
  id: number;
  images: any[];
  name: string;
  petCenterId: string;
  price: number;
  speciesId: number;
  isDisable: boolean;
  status: 1 | 2 | -1;
}

type StatusType = 1 | 2 | -1;

const STATUS_COLORS: Record<StatusType, string> = {
  1: '#FFA500',
  2: '#4CAF50',
  '-1': '#FF0000',
};

const STATUS_LABELS: Record<StatusType, string> = {
  1: 'Đang xử lý',
  2: 'Đã duyệt',
  '-1': 'Đã hủy',
};

interface BreedCardProps {
  item: BreedItem;
  onToggleStatus: (id: number, currentStatus: StatusType) => void;
}

const BreedCard: React.FC<BreedCardProps> = ({item, onToggleStatus}) => {
  const statusColor = STATUS_COLORS[item.status];
  const statusLabel = STATUS_LABELS[item.status];
  const navigation = useNavigation<any>();
  const swipeableRef = useRef<Swipeable>(null);

  const avatar =
    item.images.length > 0
      ? {uri: item.images[0].image} // Đường dẫn ảnh đầu tiên
      : require('@/assets/images/DefaultPetAvatar.jpg');

  const onPressItem = (id: number, name: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.CENTERBREEDDETAILSCREEN, {
      centerBreedId: id,
      centerBreedName: name,
    });
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    const isDisable = item.isDisable;
    const actionColor = !isDisable ? '#FF6B6B' : '#4CAF50';
    const actionText = !isDisable ? 'Hết hàng' : 'Kích hoạt';
    const actionIcon = !isDisable ? 'cart-arrow-down' : 'cart-arrow-up';

    return (
      <View style={styles.rightActions}>
        <Animated.View
          style={[
            styles.actionButton,
            {
              transform: [{translateX: trans}],
            },
          ]}>
          <RectButton
            style={[styles.actionButtonInner, {backgroundColor: actionColor}]}
            onPress={() => {
              onToggleStatus(item.id, item.status);
              swipeableRef.current?.close();
            }}>
            <MaterialCommunityIcons
              name={actionIcon}
              color={colors.white}
              size={24}
            />
            <Text style={styles.actionText}>{actionText}</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      overshootFriction={8}>
      <TouchableOpacity
        style={[
          styles.cardContainer,
          item.isDisable ? styles.disabledCardContainer : null,
        ]}
        onPress={() => onPressItem(item.id, item.name)}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <Image source={avatar} style={styles.avatar} />
          </View>
          <TextComponent text={item.name} type="title" styles={styles.name} />
          <View style={[styles.statusBadge, {backgroundColor: statusColor}]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <TextComponent
            text={`Mô tả: ${item.description}`}
            styles={styles.description}
          />
          <TextComponent
            text={priceFormater(item.price)}
            styles={styles.price}
          />
          {item.isDisable && (
            <TextComponent
              text="Đã tắt"
              styles={styles.disabledText} // Thêm style riêng cho text "Đã tắt"
            />
          )}
          {item.cancelReason ? (
            <View style={styles.cancelContainer}>
              <TextComponent
                text={`Lý do hủy: ${item.cancelReason}`}
                styles={styles.cancelText}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const ManagePetBreedingScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [centerBreedData, setCenterBreedData] = useState<BreedItem[]>([]);

  const addBreedHandle = () => {
    navigate(STACK_NAVIGATOR_SCREENS.ADDCENTERBREEDSCREEN);
  };

  const handleToggleStatus = (id: number, isDisable: boolean) => {
    console.log(isDisable)
    showLoading()
    apiUpdateBreedCenterAvailability(id, !isDisable).then((res: any) => {
      if(res.statusCode === 200){
        hideLoading()
        Toast.show({
          type: 'success',
          text1: 'Cập nhật trạng thái giống thành công',
          text2: 'Chúc bạn sức khoẻ!',
        });
        apiGetCenterBreedByPetCenterId(petCenterId as never).then((data: any) => {
          if (data.statusCode === 200) {
            setCenterBreedData(data.data.items);
          }
          hideLoading();
        });
      }else {
        hideLoading();
        Toast.show({
          type: 'error',
          text1: 'Cập nhật trạng thái giống thất bại',
          text2: `Xảy ra lỗi ${res.message}`,
        });
      }
    })
  };

  useFocusEffect(
    useCallback(() => {
      showLoading();
      apiGetCenterBreedByPetCenterId(petCenterId as never).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          setCenterBreedData(res.data.items);
        } else {
          hideLoading();
        }
      });
    }, [petCenterId]),
  );

  return (
    <Container
      title="Quản lí giống thú cưng"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
      right={
        <IconButtonComponent
          name="plus"
          size={30}
          color={colors.dark}
          onPress={addBreedHandle}
        />
      }>
      <SectionComponent styles={{flex: 1}}>
        {centerBreedData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <TextComponent
              text="Bạn hiện tại chưa có loại giống nào"
              type="title"
            />
          </View>
        ) : (
          <FlatList
            data={centerBreedData}
            renderItem={({item}) => (
              <BreedCard item={item} onToggleStatus={()=>handleToggleStatus(item.id, item.isDisable)} />
            )}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SectionComponent>
    </Container>
  );
};

export default ManagePetBreedingScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 16,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
 
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledCardContainer: {
    opacity: 0.6,
    backgroundColor: colors.grey4
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.grey4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    gap: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  cancelContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
  },
  cancelText: {
    color: colors.red,
    fontSize: 14,
  },
  rightActions: {
    marginBottom: 16,
    width: 100,
    height: '100%',
  },
  actionButton: {
    flex: 1,
    width: 100,
    marginBottom: 16,
  },
  actionButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  disabledText: {
    color: colors.red, // Màu đỏ nhạt để biểu thị trạng thái tắt
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
});
