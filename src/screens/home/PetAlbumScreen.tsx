import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Text,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import {
  AddImageComponent,
  ButtonComponent,
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import VideoPlayer from 'react-native-video-player';
import { Trash } from 'iconsax-react-native';
import { apiGetPetByPetId, apiUpdatePetAlbum } from '@/api/apiPet';
import { mediaUpload } from '@/utils/mediaUpload';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_WIDTH = (SCREEN_WIDTH - 40) / 2;

const PetAlbumScreen = () => {
  const route = useRoute<any>();
  const { goBack } = useCustomNavigation();
  const { petId, petName } = route.params;
  const { showLoading, hideLoading } = useLoading();

  const [photos, setPhotos] = useState<any[]>([]); // Danh sách ảnh hiển thị
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([]); // ID ảnh đã xóa
  const [petAddPhotos, setPetAddPhotos] = useState<any[]>([]); 
  const [petVideos, setPetVideos] = useState<any[]>([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isEdit, setIsEdit] = useState(false);


  const fetchPetPhotos = useCallback(async () => {
    try {
      showLoading();
      const res: any = await apiGetPetByPetId(petId);
      if (res.statusCode === 200) {
        setPhotos(res.data.petPhotos || []);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lấy album thất bại',
          text2: res.message || 'Xảy ra lỗi không xác định',
        });
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      hideLoading();
    }
  }, [petId, showLoading, hideLoading]);

  // Lấy danh sách ảnh từ API
  useFocusEffect(
    useCallback(() => {
      fetchPetPhotos();
    }, [])
  );
  const onEditAlbumHandle = () => {
    setIsEdit(!isEdit);
  };

  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    const deletedPhoto = updatedPhotos.splice(index, 1); // Lấy ảnh bị xóa

    if (deletedPhoto[0]?.petPhotoId) {
      // Nếu là ảnh cũ, lưu petPhotoId
      setDeletedPhotoIds((prev) => [...prev, deletedPhoto[0].petPhotoId]);
    } else {
      // Nếu là ảnh mới, loại khỏi danh sách thêm mới
      setPetAddPhotos((prev) =>
        prev.filter((photo) => photo.url !== deletedPhoto[0]?.url)
      );
    }
    setPhotos(updatedPhotos); // Cập nhật danh sách ảnh
  };

  const selectetPetPhotoHandle = (imagePath: any) => {
    const petPhoto: any[] = [];
    const petVideo: any[] = [];
    imagePath.forEach((path: string) => {
      if (path.endsWith('.mp4')) {
        petVideo.push(mediaUpload(path)); // Định dạng video
      } else {
        petPhoto.push(mediaUpload(path)); // Định dạng ảnh
      }
    });
    setPetAddPhotos(petPhoto);
    setPetVideos(petVideo);// Chỉ cập nhật danh sách video mới thêm
  };

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsModalVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      showLoading();
      const res :any = await apiUpdatePetAlbum(petId, petAddPhotos, petVideos, deletedPhotoIds);
      if (res.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Cập nhật album thành công!',
        });
        setIsEdit(false);
        setDeletedPhotoIds([]);
        setPetAddPhotos([]);
        fetchPetPhotos();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Cập nhật album thất bại',
          text2: res.message || 'Xảy ra lỗi không xác định',
        });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật album:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi kết nối',
        text2: 'Không thể cập nhật album.',
      });
    } finally {
      hideLoading();
    }
  };

  const renderMediaItem = ({ item, index }: any) => {
    const isVideo = item.type === 1;
    return (
      <View style={styles.photoContainer}>
        {isEdit && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePhoto(index)}>
            <Trash size={18} color={colors.red} variant="Bold" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => handlePhotoPress(index)} activeOpacity={0.9}>
          {isVideo ? (
            <VideoPlayer
              video={{ uri: item.url }}
              videoWidth={PHOTO_WIDTH}
              videoHeight={150}
              pauseOnPress
              thumbnail={require('../../assets/images/BannerVideo.png')}
              style={[styles.photo, { backgroundColor: colors.grey3 }]}
              resizeMode="cover"
              onError={(error) => console.log(error)}
            />
          ) : (
            <Image source={{ uri: item.url }} style={styles.photo} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={isModalVisible ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor={isModalVisible ? 'rgba(0, 0, 0, 0.8)' : 'transparent'}
      />
      <Container
        
        title={`Album của ${petName}`}
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={() => goBack()}
          />
        }
        right={
          <IconButtonComponent
            name="image-edit-outline"
            size={30}
            color={colors.grey}
            onPress={onEditAlbumHandle}
          />
        }>
        {isEdit && (
          <SectionComponent>
            <TextComponent text="Chỉnh sửa album thú cưng" type="title" />
            <AddImageComponent onSelected={(val: string | string[]) => selectetPetPhotoHandle(val)} />
          </SectionComponent>
        )}
        <FlatList
          data={photos}
          renderItem={renderMediaItem}
          keyExtractor={(item: any, index) =>
            item.petPhotoId?.toString() || index.toString()
          }
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      </Container>
      {isEdit && (
        <ButtonComponent text="Lưu thay đổi" type="primary" onPress={handleSaveChanges} />
      )}
    </>
  );
};

export default PetAlbumScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    flex: 1,
  },
  photoContainer: {
    width: PHOTO_WIDTH,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 150,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
  },
});