import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '@/constants/colors';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {AddCircle} from 'iconsax-react-native';
import IconButtonComponent from './IconButtonComponent';

interface Props {
  onSelected: (imagePath: string | string[]) => void;
  initialImages?: string[];
}

const AddImageComponent = (props: Props) => {
  const {onSelected, initialImages} = props;
  const [selectedImages, setSelectedImages] = useState<any[]>([]);

  const requestGalleryPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await check(permission);

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          // Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này');
        }
      }
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền thư viện ảnh: ', error);
    }
  };

  const openGalleryHandle = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      if (RESULTS.GRANTED) {
        ImagePicker.openPicker({
          multiple: true,
        }).then(images => {
          if (selectedImages.length + images.length <= 4) {
            const newImages = images.map(image => ({
              path: image.path,
            }));
            setSelectedImages(prev => [...prev, ...newImages]);
            onSelected([...selectedImages.map(image => image.path), ...newImages.map(image => image.path)]);
          } else {
            Alert.alert(
              'Giới hạn ảnh',
              'Bạn chỉ có thể chọn tối đa 4 hình ảnh.',
              [{text: 'OK'}]
            );
          }
        });
      } else {
        await requestGalleryPermission();
      }
    } catch (error) {
      console.error('Lỗi khi mở thư viện ảnh: ', error);
    }
  };
  const removeImage = (index: number) => {
    setSelectedImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1); // Xóa hình ảnh tại vị trí chỉ định
      onSelected(updatedImages.map(image => image.path)); // Gọi hàm onSelected với ảnh đã cập nhật
      return updatedImages;
    });
  };

  return (
    <View style={styles.imageContainer}>
      <FlatList
        data={
          selectedImages.length < 4
            ? [...selectedImages, {isAddButton: true}]
            : selectedImages
        }
        numColumns={4}
        scrollEnabled={false}
        renderItem={({item, index}) =>
          item.isAddButton ? (
            <TouchableOpacity
              style={styles.imageItem}
              onPress={openGalleryHandle}>
              <AddCircle size={40} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imageWrapper}>
              <Image source={{uri: item.path}} style={styles.imageThumbnail} />
              <View style={styles.closeIcon}>
                <IconButtonComponent
                  name="close-circle"
                  size={18}
                  color={colors.red}
                  onPress={() => removeImage(index)}
                />
              </View>
            </TouchableOpacity>
          )
        }
        keyExtractor={(item, index) =>
          item.isAddButton ? `add-${index}` : item.path
        }
        columnWrapperStyle={{
          justifyContent:
            selectedImages.length % 4 === 0 ? 'space-between' : 'flex-start',
          paddingVertical: 6,
        }}
      />
    </View>
  );
};

export default AddImageComponent;

const styles = StyleSheet.create({
  imageItem: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey4,
    borderRadius: 6,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginLeft: 5,
  },
  imageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginHorizontal: 5,
  },
  closeIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});