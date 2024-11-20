import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import {apiGetCenterBreedByPetCenterId} from '@/api/apiCenterBreed';
import {useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface BreedItem {
  cancelReason: string;
  description: string;
  id: number;
  images: any[];
  name: string;
  petCenterId: string;
  price: number;
  speciesId: number;
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
}


const BreedCard: React.FC<BreedCardProps> = ({item}) => {
  const statusColor = STATUS_COLORS[item.status];
  const statusLabel = STATUS_LABELS[item.status];
  const navigation = useNavigation<any>();

  const onPressItem = (id: number, name: string) => {

    navigation.navigate(STACK_NAVIGATOR_SCREENS.CENTERBREEDDETAILSCREEN, {
      centerBreedId: id,
      centerBreedName: name,
    });
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPressItem(item.id, item.name)}>
      <View style={styles.cardHeader}>
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
          text={`Giá: ${item.price.toLocaleString('vi-VN')} VNĐ`}
          styles={styles.price}
        />
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
            renderItem={({item}) => <BreedCard item={item} />}
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    color: '#FF0000',
    fontSize: 14,
  },
});
