import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
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

const { width, height } = Dimensions.get('window');

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    showLoading();
    apiGetCenterBreedByCenterBreedId(centerBreedId).then((res: any) => {
      if (res.statusCode === 200) {
        setCenterBreedData(res.data);
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
          text2: `Xảy ra lỗi ${res.message}`,
        });
      }
    });
  };

  if (!centerBreedData) return null;

  const { cancelReason, description, price, images, status, name } = centerBreedData;

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 1:
        return { color: '#FFA500', label: 'Đang xử lý', bgColor: '#FFF8E7' };
      case 2:
        return { color: '#4CAF50', label: 'Đã duyệt', bgColor: '#E8F5E9' };
      default:
        return { color: '#FF4D4D', label: 'Đã hủy', bgColor: '#FFEBEE' };
    }
  };

  const statusInfo = getStatusStyle(status);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <IconButtonComponent
          name="chevron-left"
          size={28}
          color={colors.dark}
          onPress={goBack}
        />
      </View>

      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          data={images}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            setSelectedImageIndex(
              Math.round(event.nativeEvent.contentOffset.x / width)
            );
          }}
          renderItem={({ item }: any) => (
            <Image 
              source={{ uri: item.image }} 
              style={styles.carouselImage}
              resizeMode="cover"
            />
          )}
        />
        
        {/* Image Counter */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {selectedImageIndex + 1}/{images.length}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>
          <Text style={styles.priceText}>
            {price.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {status === -1 && cancelReason && (
          <View style={[styles.cancelSection, { backgroundColor: statusInfo.bgColor }]}>
            <Text style={[styles.cancelTitle, { color: statusInfo.color }]}>
              Lý do hủy
            </Text>
            <Text style={[styles.cancelText, { color: statusInfo.color }]}>
              {cancelReason}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Delete Button */}
      {status === -1 && (
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Xoá đơn</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CenterBreedDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  carouselContainer: {
    width: width,
    height: height * 0.45,
  },
  carouselImage: {
    width: width,
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCounterText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentHeader: {
    padding: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
  descriptionSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A4A4A',
  },
  cancelSection: {
    margin: 24,
    padding: 16,
    borderRadius: 12,
  },
  cancelTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cancelText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 100,
  },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFF',
  },
  deleteButton: {
    backgroundColor: colors.red,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});