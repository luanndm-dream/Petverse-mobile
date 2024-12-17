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
import AlertPopupComponent from './AlertPopupComponent';
import {alertMessages} from '@/data/alertMessages';

interface Props {
  onSelected: (imagePath: string | string[]) => void;
  initialImages?: string[];
  camera?: boolean;
  maxItem?: number;
  onlyImage?: boolean;
}

const AddImageComponent = (props: Props) => {
  const {onSelected, initialImages, camera, maxItem = 4, onlyImage} = props;
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [isAlert, setIsAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<any>(null);
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
        if (camera) {
          ImagePicker.openCamera({
            cropping: true,
            
            width: 800,
            height: 800,
            compressImageMaxWidth: 800, // Kích thước tối đa 800px
            compressImageMaxHeight: 800,
            // compressImageQuality: 0.9,
          }).then(image => {
            if (onlyImage && !image.mime.startsWith('image')) {
              setAlertContent(alertMessages.onlyImageAllowed);
              setIsAlert(true);
              return;
            }
            if (selectedImages.length < maxItem) {
              const newImage = {path: image.path};
              setSelectedImages(prev => [...prev, newImage]);
              onSelected([
                ...selectedImages.map(img => img.path),
                newImage.path,
              ]);
            } else {
              setAlertContent(alertMessages.maxItemsExceeded(maxItem));
              setIsAlert(true);
            }
          });
        } else {
          ImagePicker.openPicker({
            multiple: true,
            cropping: onlyImage?true: false,
            width: 800,
            height: 800,
            mediaType: onlyImage ? 'photo' : 'any',
            compressImageMaxWidth: 800,
            compressImageMaxHeight: 800,
          }).then(mediaFiles => {
            console.log(mediaFiles)
            const validMedia = mediaFiles.filter((media: any) => {
              // Kiểm tra loại file
              if (onlyImage && !media.mime.startsWith('image')) {
                setAlertContent(alertMessages.onlyImageAllowed);
                setIsAlert(true);

                return false;
              }
              if (media.mime.startsWith('video') && media.duration > 20000) {
                console.log('isAlert:', isAlert, 'alertContent:', alertContent);
                setAlertContent(alertMessages.videoTooLong);
                setIsAlert(true);
                return false;
              }
              return true; // Chỉ giữ lại các file hợp lệ
            });
            if (selectedImages.length + validMedia.length <= maxItem) {
              const newImages = validMedia.map(image => ({
                path: image.path,
              }));
              setSelectedImages(prev => [...prev, ...newImages]);
              onSelected([
                ...selectedImages.map(image => image.path),
                ...newImages.map(image => image.path),
              ]);
            } else {
              setAlertContent(alertMessages.onlyImageAllowed);
              setIsAlert(true);
            }
          });
        }
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
      updatedImages.splice(index, 1);
      onSelected(updatedImages.map(image => image.path));
      return updatedImages;
    });
  };

  return (
    <>
      <View style={styles.imageContainer}>
        <FlatList
          data={
            selectedImages.length < maxItem
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
                <Image
                  source={{uri: item.path}}
                  style={styles.imageThumbnail}
                />
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

      <AlertPopupComponent
        {...alertContent}
        isVisible={isAlert}
        onButtonPress={() => {
          setIsAlert(false);
          setAlertContent(null); 
        }}
        onClose={() => {
          setIsAlert(false);
          setAlertContent(null); 
        }}
      />
    </>
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
