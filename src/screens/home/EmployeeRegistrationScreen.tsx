import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ButtonComponent,
  Container,
  DropdownPicker,
  IconButtonComponent,
  ImageZoomingComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '@/constants/colors';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import {Modalize} from 'react-native-modalize';
import {AddCircle, Camera, Gallery} from 'iconsax-react-native';
import {Host, Portal} from 'react-native-portalize';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {SelectModel} from '@/models/SelectModel';
import {apiGetPetServices} from '@/api/apiPetServices';
import {useCustomNavigation} from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import {useAppSelector} from '@/redux';
import {apiPostApplication} from '@/api/apiApplication';
import Toast from 'react-native-toast-message';
import { mediaUpload } from '@/utils/mediaUpload';

const EmployeeRegistrationScreen = () => {
  const [isVisibleImage, setIsVisibleImage] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState<any[]>(
    [],
  );
  const [selectedImage, setSelectedImage] = useState<any>();
  const [servicesSelects, setServicesSelects] = useState<SelectModel[]>([]);
  const [avatar, setAvatar] = useState<any>('');
  const [type, setType] = useState('certifications');
  const imageModalRef = useRef<Modalize>();
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const getPetServiceHandle = () => {
    showLoading();
    apiGetPetServices().then((res: any) => {
      if (res.statusCode === 200) {
        const items: SelectModel[] = [];
        res?.data?.items?.forEach((item: any) =>
          items.push({
            label: item.name ? item.name : 'Không xác định',
            value: item.id,
            description: item.description ? item.description : 'Không xác định',
          }),
        );
        setServicesSelects(items);
        hideLoading();
      }
    });
  };
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
      // console.log(image);
    });
  };
  const openGallaryHandle = () => {
    imageModalRef.current?.close();
    if (type === 'avatar') {
      ImagePicker.openPicker({}).then(image => {
        setAvatar(image.path);
        formik.setFieldValue('avatar', image.path);
      });
    } else {
      if (!RESULTS.GRANTED) {
        requestGalleryPermission();
      } else {
        ImagePicker.openPicker({
          multiple: true,
        }).then(images => {
          if (selectedCertifications.length + images.length <= 4) {
            setSelectedCertifications( prev => [...prev, ...images]);
          } else {
            Alert.alert(
              'Giới hạn ảnh',
              'Bạn chỉ có thể chọn tối đa 4 hình ảnh.',
              [{text: 'OK'}],
            );
          }
        });
      }
    }
    return;
  };
  const removeImage = (index: any) => {
    setSelectedCertifications(prev => prev.filter((_, i) => i !== index));
  };
  useEffect(() => {
    if (isVisibleImage && imageModalRef.current) {
      imageModalRef.current.open();
    } else if (imageModalRef.current) {
      imageModalRef.current.close();
    }
  }, [isVisibleImage]);
  useEffect(() => {
    requestGalleryPermission();
  }, []);
  useEffect(() => {
    getPetServiceHandle();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      address: '',
      avatar: '',
      description: '',
      services: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(3, 'Tên phải lớn hơn 3 ký tự')
        .required('Tên là bắt buộc'),
      phoneNumber: Yup.string()
        .length(10, 'Số điện thoại bao gồm 10 số')
        .required('Số điện thoại là bắt buộc'),
      address: Yup.string()
        .min(12, 'Địa chỉ phải lớn hơn 12 ký tự')
        .required('Địa chỉ là bắt buộc'),
      avatar: Yup.string().required('Avatar là bắt buộc'),
      description: Yup.string()
        .min(12, 'Mô tả phải trên 12 ký tự')
        .required('Mô tả là bắt buộc'),
      services: Yup.array()
        .of(Yup.string().required('Dịch vụ thú cưng không được để trống'))
        .min(1, 'Ít nhất một dịch vụ thú cưng phải được chọn')
        .required('Dịch vụ thú cưng là bắt buộc'),
    }),
    onSubmit: values => {
      
      const certifications: any[] = [];
      if (selectedCertifications) {
        selectedCertifications.forEach(item => {
          // Gọi mediaUpload với đường dẫn thay vì đối tượng
          certifications.push(mediaUpload(item.path)); // Sử dụng item.path
        });
      }
      console.log('certifications',certifications, 'mediaUpload(values.avatar) 1', mediaUpload(values.avatar) )
      showLoading()
        apiPostApplication(
          userId,
          values.name,
          values.phoneNumber,
          values.address,
          mediaUpload(values.avatar),
          values.description,
          values.services,
          certifications
        ).then((res:any) =>{
          console.log('res', res)
          if(res.statusCode === 200){
            hideLoading()
           
            Toast.show({
              type: 'success',
              text1: 'Đăng ký đơn thành công',
              text2: 'Vui lòng chờ phản hồi từ quản lí!',
            });
            goBack();
          }else {
            hideLoading();
            Toast.show({
              type: 'error',
              text1: 'Đăng ký đơn thất bại',
              text2: `Xảy ra lỗi ${res.message}`,
            });
          }
        })
        
      }
    },
  );

 
  return (
    <Container
      title="Đăng ký nhân viên"
      isScroll={true}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <SectionComponent>
        <TextComponent text="Hình ảnh" type="title" />
        <RowComponent justify="flex-start" styles={{marginBottom: 16}}>
          <TouchableOpacity
            style={
              avatar
                ? {
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    borderWidth: 0.5,
                  }
                : styles.imageAvtContainer
            }
            onPress={() => {
              setIsVisibleImage(true), setType('avatar');
            }}>
            {avatar ? (
              <View>
                <Image
                  source={{uri: avatar}}
                  style={styles.avatar}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <AddCircle size={12} color={colors.primary} />
            )}
          </TouchableOpacity>
          <TextComponent
            text="Đây sẽ là ảnh đại diện của của hàng bạn, hãy chọn ảnh sao cho phù hợp nhất!"
            numOfLine={2}
            type="description"
            styles={{paddingLeft: 20, flexWrap: 'wrap', maxWidth: '80%'}}
          />
        </RowComponent>
        {formik.errors.avatar && formik.touched.avatar && (
          <Text style={styles.errorText}>{formik.errors.avatar}</Text>
        )}
        <TextComponent text="Họ và tên" type="title" required />
        <InputComponent
          onChange={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          value={formik.values.name}
          placeholder="Họ và tên"
        />
        {formik.errors.name && formik.touched.name && (
          <Text style={styles.errorText}>{formik.errors.name}</Text>
        )}

        <TextComponent text="Số điện thoại" type="title" required />
        <InputComponent
          onChange={formik.handleChange('phoneNumber')}
          onBlur={formik.handleBlur('phoneNumber')}
          value={formik.values.phoneNumber}
          placeholder="Số điện thoại"
        />
        {formik.errors.phoneNumber && formik.touched.phoneNumber && (
          <Text style={styles.errorText}>{formik.errors.phoneNumber}</Text>
        )}

        <TextComponent text="Địa chỉ" type="title" required />
        <InputComponent
          onChange={formik.handleChange('address')}
          onBlur={formik.handleBlur('address')}
          value={formik.values.address}
          placeholder="Địa chỉ"
        />
        {formik.errors.address && formik.touched.address && (
          <Text style={styles.errorText}>{formik.errors.address}</Text>
        )}

        <TextComponent text="Hồ sơ/chứng nhận" type="title" />
        <View style={styles.imageContainer}>
          <FlatList
            data={
              selectedCertifications.length < 4
                ? [...selectedCertifications, {isAddButton: true}]
                : selectedCertifications
            }
            numColumns={4}
            scrollEnabled={false}
            renderItem={({item, index}) =>
              item.isAddButton ? (
                <TouchableOpacity
                  style={styles.imageItem}
                  onPress={() => {
                    setIsVisibleImage(true);
                    setType('certifications');
                  }}>
                  <AddCircle size={12} color={colors.primary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.imageWrapper}
                  onPress={() => {
                    setSelectedImage(item.path);
                  }}>
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
                </TouchableOpacity>
              )
            }
            keyExtractor={(item, index) =>
              item.isAddButton ? `add-${index}` : item.path
            }
            columnWrapperStyle={{
              justifyContent:
                selectedCertifications.length % 4 === 0
                  ? 'space-between'
                  : 'flex-start',
              paddingVertical: 6,
            }}
          />
        </View>
        <TextComponent text="Mô tả" type="title" required />
        <InputComponent
          onChange={formik.handleChange('description')}
          onBlur={formik.handleBlur('description')}
          placeholder="Mô tả"
          value={formik.values.description}
          multiline
          allowClear
        />
        {formik.errors.description && formik.touched.description && (
          <Text style={styles.errorText}>{formik.errors.description}</Text>
        )}
        <TextComponent text="Dịch vụ" type="title" required />
        <DropdownPicker
        placeholder='Dịch vụ'
          onSelect={(selectedServices: string | string[]) => {
            formik.handleChange('services');
            formik.setFieldValue('services', selectedServices);
          }}
          values={servicesSelects}
          selected={formik.values.services}
          multible
        />
        {formik.errors.services && formik.touched.services && (
          <Text style={styles.errorText}>{formik.errors.services}</Text>
        )}
        <ButtonComponent
          text="Gửi đơn"
          onPress={formik.handleSubmit}
          color={colors.primary}
          type="primary"
          styles={{width: '100%', marginTop: 10}}
        />
      </SectionComponent>
      {/* )}
      </Formik> */}

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
        <Modal
          visible={!!selectedImage}
          transparent={true}
          onRequestClose={() => {
            setSelectedImage(null);
          }}>
          <View style={styles.fullScreenContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}>
              <MaterialCommunityIcons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Image
              source={{uri: selectedImage}}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
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
  imageAvtContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    backgroundColor: colors.grey4,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.dark, // Nền màu đen
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
