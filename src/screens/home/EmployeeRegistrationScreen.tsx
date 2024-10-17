import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  ImageZoomingComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '@/constants/colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {Modalize} from 'react-native-modalize';
import {Add, AddCircle, Camera, Gallery} from 'iconsax-react-native';
import {Host, Portal} from 'react-native-portalize';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
const EmployeeRegistrationScreen = () => {
  const [isVisibleImage, setIsVisibleImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const imageModalRef = useRef<Modalize>();

  useEffect(() => {
    if (isVisibleImage && imageModalRef.current) {
      imageModalRef.current.open();
    } else if (imageModalRef.current) {
      imageModalRef.current.close();
    }
  }, [isVisibleImage]);

  const requestCameraPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      const result = await check(permission);

      if (result === RESULTS.DENIED) {
        // Yêu cầu quyền camera
        const requestResult = await request(permission);
        if (requestResult !== RESULTS.GRANTED) {
          // Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền camera để sử dụng tính năng này');
        }
      }
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền camera: ', error);
    }
  };
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

  const openCameraHandle = () => {
    requestCameraPermission();
    imageModalRef.current?.close();
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
  };
  const openGallaryHandle = () => {
    imageModalRef.current?.close();
    if (!RESULTS.GRANTED) {
      requestGalleryPermission();
    } else {
      ImagePicker.openPicker({
        multiple: true,
      }).then(images => {
        if (selectedImages.length + images.length <= 4) {
          setSelectedImages(prev => [...prev, ...images]);
        } else {
          // Alert to notify the user that the limit has been reached
          Alert.alert(
            'Giới hạn ảnh',
            'Bạn chỉ có thể chọn tối đa 4 hình ảnh.',
            [{text: 'OK'}],
          );
        }
      });
    }
  };

  const removeImage = (index: any) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    requestGalleryPermission();
  }, []);

  const initialValues = {
    name: '',
    phoneNumber: '',
    address: '',
    image: '',
    description: '',
    petServicesId: [],
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Tên phải lớn hơn 3 ký tự')
      .required('Tên là bắt buộc'),
    phoneNumber: Yup.string()
      .length(10, 'Số điện thoại bao gồm 10 số')
      .required('Số điện thoại là bắt buộc'),
    address: Yup.string()
      .min(12, 'Địa chỉ phải lớn hơn 12 ký tự')
      .required('Địa chỉ là bắt buộc'),
    image: Yup.string().required('Hình ảnh là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    petServicesId: Yup.array()
      .of(Yup.string().required('Dịch vụ thú cưng không được để trống'))
      .min(1, 'Ít nhất một dịch vụ thú cưng phải được chọn')
      .required('Dịch vụ thú cưng là bắt buộc'),
  });
  return (
    <Container
      title="Đăng ký nhân viên"
      left={
        <MaterialCommunityIcons
          name="chevron-left"
          size={30}
          color={colors.dark}
        />
      }>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {}}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <SectionComponent>
            <TextComponent text="Họ và tên" type="title" required/>
            <InputComponent
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Họ và tên"
            />
            {errors.name && touched.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextComponent text="Số điện thoại" type="title" required/>
            <InputComponent
              onChange={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              value={values.name}
              placeholder="Số điện thoại"
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            <TextComponent text="Địa chỉ" type="title" required/>
            <InputComponent
              onChange={handleChange('address')}
              onBlur={handleBlur('address')}
              value={values.name}
              placeholder="Địa chỉ"
            />
            {errors.address && touched.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <TextComponent text="Hồ sơ/chứng nhận" type="title" />
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
                      onPress={() => setIsVisibleImage(true)}>
                      <AddCircle size={12} color={colors.primary} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{uri: item.path}}
                        style={styles.imageThumbnail}
                      />
                      <View style={{position: 'absolute', top: -10, right: -10}}>
                        <IconButtonComponent
                          name="close-circle"
                          size={18}
                          color={colors.red}
                          onPress={() => removeImage(index)}
                        />
                      </View>
                    </View>
                  )
                }
                keyExtractor={(item, index) =>
                  item.isAddButton ? `add-${index}` : item.path
                }
                columnWrapperStyle={{
                  justifyContent:
                    selectedImages.length % 4 === 0
                      ? 'space-between'
                      : 'flex-start',
                  paddingVertical: 6,
                }}
              />
            </View>
          </SectionComponent>
        )}
      </Formik>
      <Portal>
        <Modalize
          ref={imageModalRef}
          onClose={() => setIsVisibleImage(false)}
          handlePosition="inside"
          adjustToContentHeight>
          <View style={{paddingTop: 20, paddingHorizontal: 20}}>
            <SectionComponent>
              {/* <RowComponent justify="flex-start" styles={{paddingBottom: 20}} onPress={openCameraHandle}>
                <Camera size={24} color={colors.primary} variant="Bold" />
                <TextComponent
                  text="Mở camera"
                  type="title"
                  styles={{paddingLeft: 20}}
                />
              </RowComponent> */}
              <RowComponent justify="flex-start" onPress={openGallaryHandle}>
                <Gallery size={24} color={colors.primary} variant="Bold" />
                <TextComponent
                  text="Ảnh từ thư viện"
                  type="title"
                  styles={{paddingLeft: 20}}
                />
              </RowComponent>
            </SectionComponent>
          </View>
        </Modalize>
      </Portal>
    </Container>
  );
};

export default EmployeeRegistrationScreen;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -12,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
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
    marginHorizontal: 5,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginHorizontal: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red', // Choose a color
    borderRadius: 10,
    padding: 4,
  },
});
