import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import { useRoute } from '@react-navigation/native';
import {
  apiDeleteCenterBreed,
  apiGetCenterBreedByCenterBreedId,
} from '@/api/apiCenterBreed';
import Toast from 'react-native-toast-message';

interface BreedData {
  cancelReason: string;
  description: string;
  id: number;
  images: string[];
  name: string;
  petCenterId: string;
  price: number;
  speciesId: number;
  status: 1 | 2 | -1;
}

const CenterBreedDetailScreen = () => {
  const route = useRoute<any>();
  const { goBack } = useCustomNavigation();
  const { showLoading, hideLoading } = useLoading();
  const { centerBreedId, centerBreedName } = route.params;
  const [centerBreedData, setCenterBreedData] = useState<BreedData | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    showLoading();
    apiGetCenterBreedByCenterBreedId(centerBreedId).then((res: any) => {
      if (res.statusCode === 200) {
        setCenterBreedData(res.data);
        setMainImage(res?.data?.images[0].image || null); // Đảm bảo mainImage có giá trị hoặc là null
      }
      hideLoading();
    });
  }, [centerBreedId]);

  const handleDelete = () => {
    showLoading();
    apiDeleteCenterBreed(centerBreedId).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        Toast.show({
          type: 'success',
          text1: 'Xoá giống thành công',
          text2: 'Petverse chúc bạn ngày mới vui vẻ!',
        });
        goBack();
      } else {
        hideLoading();
        Toast.show({
          type: 'error',
          text1: 'Xoá giống thất bại',
          text2: `Xảy ra lỗi ${res.error}`,
        });
      }
    });
  };

  if (!centerBreedData) return null;

  const { cancelReason, description, price, images, status } = centerBreedData;

  const statusColor = status === 1 ? '#FFA500' : status === 2 ? '#4CAF50' : '#FF4D4D';
  const statusLabel = status === 1 ? 'Đang xử lý' : status === 2 ? 'Đã duyệt' : 'Đã hủy';

  return (
    <Container
      title={centerBreedName}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main Card */}
        <View style={styles.cardContainer}>
          {/* Main Image */}
          {mainImage ? ( // Kiểm tra nếu mainImage có giá trị thì mới hiển thị
            <Image source={{ uri: mainImage }} style={styles.mainImage} />
          ) : (
            <Text style={styles.placeholderText}>Không có hình ảnh</Text>
          )}

          {/* Additional Images */}
          <FlatList
            data={images}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: any) => (
              <TouchableOpacity onPress={() => setMainImage(item.image)}>
                <Image source={{ uri: item.image }} style={styles.smallImage} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.imageList}
            showsHorizontalScrollIndicator={false}
          />

          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.nameText}>{centerBreedData.name}</Text>
            <Text style={styles.priceText}>
              {price.toLocaleString('vi-VN')} VNĐ
            </Text>
            <Text style={styles.descriptionText}>{description}</Text>

            {/* Status */}
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusLabel}</Text>
            </View>

            {/* Cancel Reason */}
            {status === -1 && cancelReason ? (
              <View style={styles.cancelContainer}>
                <Text style={styles.cancelText}>Lý do hủy: {cancelReason}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      {status === -1 && (
        <ButtonComponent
          text="Xoá đơn"
          color={colors.red}
          type="primary"
          onPress={handleDelete}
        />
      )}
    </Container>
  );
};

export default CenterBreedDetailScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#F4F4F4',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  placeholderText: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#EEE',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#999',
  },
  imageList: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  smallImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  statusText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelContainer: {
    padding: 12,
    backgroundColor: '#FFF3F3',
    borderRadius: 8,
    marginTop: 8,
  },
  cancelText: {
    color: colors.red,
    fontSize: 14,
    lineHeight: 20,
  },
});