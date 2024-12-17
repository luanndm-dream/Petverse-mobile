import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  apiGetPetByPetId,
  apiGetPetBreed,
  apiUpdatePet,
  apiDeletePet,
  apiUpdatePetAvatar,
} from '@/api/apiPet';
import ImagePicker from 'react-native-image-crop-picker';
import useLoading from '@/hook/useLoading';
import {
  AlertPopupComponent,
  ButtonComponent,
  Container,
  IconButtonComponent,
  InputComponent,
  PopupComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {FlatList} from 'react-native-gesture-handler';
import {Camera, Edit, Edit2, Gallery} from 'iconsax-react-native';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {ageFormatter} from '@/utils/AgeFormatter';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import {useCustomNavigation} from '@/utils/navigation';
import { apiChangeAvatar } from '@/api/apiUser';
import { mediaUpload } from '@/utils/mediaUpload';

const PetDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const {petId, petName} = route?.params;
  const [petData, setPetData] = useState<any>();
  const [petAvatar, setPetAvatar] = useState<any>();
  const [dogSubType, setDogSubType] = useState<any[]>([]);
  const [catSubType, setCatSubType] = useState<any[]>([]);
  const [petSubTypeName, setPetSubTypeName] = useState<string>('');
  const [isEdit, setIsEdit] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const {navigate, goBack} = useCustomNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: petData?.name || '',
      weight: petData?.weight?.toString() || '',
      sterilized: petData?.sterilized || false,
      description: petData?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Tên không được bỏ trống'),
      weight: Yup.number()
        .required('Cân nặng không được bỏ trống')
        .typeError('Cân nặng phải là số')
        .positive('Cân nặng phải là số dương'),
      description: Yup.string().required('Giới thiệu không được bỏ trống'),
    }),
    onSubmit: vals => {
      showLoading();
      apiUpdatePet(
        petId,
        vals.name,
        vals.weight,
        vals.description,
        vals.sterilized,
      ).then((res: any) => {
        if (res.statusCode === 200) {
          console.log(res);
          setIsEdit(false);
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Thay đổi thông tin thú cưng thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Thay đổi thông tin thú cưng thất bại',
            text2: `Xảy ra lỗi khi thay đổi thông tin thú cưng ${res.message}`,
          });
        }
      });
      console.log(vals);
    },
  });

  const petInfo = [
    {
      label: 'Tên',
      value: petData?.name,
      isEdit: true,
      field: 'name',
    },
    {
      label: 'Loài',
      value: petData?.speciesId === 1 ? 'Chó' : 'Mèo',
      isEdit: false,
    },
    {
      label: 'Giống',
      value: petSubTypeName,
      isEdit: false,
    },
    {
      label: 'Tuổi',
      value: ageFormatter(petData?.birthDate),
      isEdit: false,
    },
    {
      label: 'Giới tính',
      value: petData?.gender === 1 ? 'Đực' : 'Cái',
      isEdit: false,
    },
    {
      label: 'Cân nặng',
      value: `${petData?.weight} kg`,
      isEdit: true,
      field: 'weight',
    },
    {
      label: 'Triệt sản',
      value: petData?.sterilized === true ? 'Đã triệt sản' : 'Chưa triệt sản',
      isEdit: true,
      field: 'sterilized',
    },
  ];

  useEffect(() => {
    if (!isEdit) {
      formik.resetForm();
    }
  }, [isEdit]);

  const onPressIcon = (type: string) => {
    if (type === 'album') {
      navigation.navigate(STACK_NAVIGATOR_SCREENS.PETALBUMSCREEN, {
        petId: petData.id,
        petName: petData.name,
        petPhotos: petData.petPhotos,
      });
    } else {
      setIsEdit(!isEdit);
    }
  };

  useEffect(() => {
    showLoading();
    Promise.all([apiGetPetBreed(1), apiGetPetBreed(2), apiGetPetByPetId(petId)])
      .then(([dogResponse, catResponse, petResponse]: any) => {
        if (dogResponse.statusCode === 200) {
          setDogSubType(dogResponse?.data?.items);
        }
        if (catResponse.statusCode === 200) {
          setCatSubType(catResponse?.data?.items);
        }

        if (petResponse?.statusCode === 200) {
          setPetData(petResponse?.data);
          const breedId = petResponse?.data?.breedId;
          if (petResponse?.data?.speciesId === 1) {
            const breed = dogResponse?.data?.items.find(
              (item: any) => item.id === breedId,
            );
            setPetSubTypeName(breed ? breed.name : 'Không xác định');
          } else if (petResponse?.data?.speciesId === 2) {
            const breed = catResponse?.data?.items.find(
              (item: any) => item.id === breedId,
            );
            setPetSubTypeName(breed ? breed.name : 'Không xác định');
          }
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, [petId, isEdit, petAvatar]);

  const deletePetHandle = () => {
    apiDeletePet(petId).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        Toast.show({
          type: 'success',
          text1: 'Xoá pet thành công',
          text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
        });
        goBack();
      } else {
        hideLoading();
        Toast.show({
          type: 'error',
          text1: 'Xoá pet thất bại',
          text2: `Xảy ra lỗi ${res.message}`,
        });
      }
    });
  };

  const handleChangeAvatar = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageMaxWidth: 800, // Kích thước tối đa 800px
      compressImageMaxHeight: 800,
    }).then(image => {
      if (image.path) {
        if (!image.mime.startsWith('image')) {
          setIsAlert(true)
          return;
        }
        showLoading();
       apiUpdatePetAvatar(petId,mediaUpload(image.path))
          .then((res:any) => {
            if (res.statusCode === 200) {
              setPetAvatar(image.path)
              Toast.show({
                type: 'success',
                text1: 'Thay đổi ảnh đại diện thành công',
                text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'Thay đổi ảnh đại diện thất bại',
                text2: `Xảy ra lỗi: ${res.message}`,
              });
            }
          })
          .finally(() => hideLoading());
      }
    });
  }

  const renderInfoItem = (
    label: string,
    value: any,
    isLastItem: boolean,
    isEditItem?: boolean,
    field?: string,
  ) => {
    return (
      <RowComponent
        justify="space-between"
        styles={[styles.infoItem, !isLastItem && styles.borderBottom]}>
        <RowComponent>
          <TextComponent text={label} size={16} />
          {isEdit && isEditItem && (
            <RowComponent styles={styles.editRow}>
              <Edit2 size={16} color={colors.red} />
              {formik.errors[field as never] &&
                formik.touched[field as never] && (
                  <TextComponent
                    text="Bắt buộc"
                    size={12}
                    color={colors.red}
                    styles={styles.errorTextInline}
                  />
                )}
            </RowComponent>
          )}
        </RowComponent>

        {isEdit && isEditItem ? (
          field === 'sterilized' ? (
            <Switch
              trackColor={{true: colors.primary, false: colors.grey4}}
              thumbColor={colors.white}
              value={formik.values.sterilized}
              onValueChange={value => {
                formik.setFieldValue('sterilized', value);
              }}
            />
          ) : (
            <View>
              <TextInput
                style={[
                  styles.textInput,
                  formik.errors[field as never] &&
                    formik.touched[field as never] &&
                    styles.inputError,
                ]}
                keyboardType={field === 'weight' ? 'numeric' : 'default'}
                value={formik.values[field as never]}
                onChangeText={formik.handleChange(field)}
                onBlur={() => formik.handleBlur(field)}
                placeholder="Nhập nội dung"
              />
            </View>
          )
        ) : (
          <TextComponent text={value} size={18} type="title" />
        )}
      </RowComponent>
    );
  };

  return (
    <>
      <Container
        isScroll={true}
        title={petName}
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={() => navigation.goBack()}
          />
        }
        right={
          <IconButtonComponent
            name="needle"
            size={30}
            color={colors.dark}
            onPress={() => {
              navigation.navigate(STACK_NAVIGATOR_SCREENS.VACCINESCREEN, {
                petId,
                petName,
              });
            }}
          />
        }>
        <ImageBackground
          source={require('../../assets/images/BannerAvatarPet.png')}
          style={styles.backgroundImage}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangeAvatar}>
            {petData?.avatar ? (
              <Image source={{uri: petData?.avatar}} style={styles.avatar} />
            ) : (
              <Image source={require('../../assets/images/DefaultAvatar.jpg')} style={styles.avatar} />
            )}
          </TouchableOpacity>

          <View style={styles.editContainer}>
            <View>
              <TextComponent text={petName} type="title" />
              <RowComponent>
                <RowComponent
                  styles={styles.iconContainer}
                  onPress={() => onPressIcon('album')}>
                  <Gallery size={24} color={colors.grey} />
                  <TextComponent text="Album" styles={{marginLeft: 6}} />
                </RowComponent>
                <RowComponent
                  styles={[
                    styles.iconContainer,
                    {backgroundColor: isEdit ? colors.primary : colors.grey4},
                  ]}
                  onPress={() => onPressIcon('edit')}>
                  <Edit size={24} color={isEdit ? colors.white : colors.grey} />
                  <TextComponent
                    text="Chỉnh sửa"
                    styles={{marginLeft: 6}}
                    color={isEdit ? colors.white : colors.dark}
                  />
                </RowComponent>
              </RowComponent>
            </View>
          </View>
        </ImageBackground>
        <SectionComponent>
          <RowComponent justify="flex-start">
            <TextComponent text="Giới thiệu" size={16} type="title" />
            {isEdit && (
              <>
                <SpaceComponent width={16} />
                <Edit2 size={16} color={colors.red} />
              </>
            )}
          </RowComponent>

          {isEdit ? (
            <InputComponent
              onChange={formik.handleChange('description')}
              value={formik.values.description}
              allowClear
              multiline
              maxLength={500}
              onBlur={formik.handleBlur('description')}
              placeholder="Mô tả thú cưng"
              // ={{padding: 8, backgroundColor: colors.white, borderRadius: 6}}
            />
          ) : (
            <TextComponent
              text={petData?.description?.trim()}
              type="description"
              styles={{
                padding: 8,
                backgroundColor: colors.white,
                borderRadius: 6,
              }}
            />
          )}
          {formik.errors.description && formik.touched.description && (
            <TextComponent
              text="Bắt buộc phải có"
              size={14}
              color={colors.red}
              styles={styles.errorTextInline}
            />
          )}
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: 'white',
              paddingHorizontal: 12,
              marginTop: 25,
              borderRadius: 12,
            }}
            scrollEnabled={false}
            data={petInfo}
            renderItem={({item, index}) =>
              renderInfoItem(
                item.label,
                item.value,
                index === petInfo.length - 1,
                item.isEdit,
                item.field,
              )
            }
          />
          <View style={{alignSelf: 'center', marginTop: 12}}>
            <ButtonComponent
              text="Xoá thú cưng"
              type="link"
              textColor={colors.red}
              onPress={() => setIsVisible(true)}
            />
          </View>
        </SectionComponent>
      </Container>
      {isEdit && (
        <ButtonComponent
          text="Lưu thay đổi"
          type="primary"
          onPress={formik.handleSubmit}
          // disabled={!formik.isValid || !formik.dirty}
        />
      )}
      <PopupComponent
        title="Xoá thú cưng"
        description="Bạn chắc chắn muốn xoá thú cưng này"
        iconName="alert-circle"
        iconColor={colors.yellow}
        isVisible={isVisible}
        leftTitle="Huỷ"
        onClose={() => setIsVisible(false)}
        onLeftPress={() => setIsVisible(false)}
        onRightPress={deletePetHandle}
        rightTitle="Xác nhận"
        buttonLeftColor={colors.grey}
        buttonRightColor={colors.red}
      />
        <AlertPopupComponent 
          buttonTitle='Đóng'
          description='Xin lỗi ảnh đại điện chỉ được chấp nhận file ảnh.'
          iconColor={colors.yellow}
          iconName='alert-circle'
          isVisible={isAlert}
          onButtonPress={()=>setIsAlert(false)}
          onClose={()=>setIsAlert(false)}
          title='Cảnh báo'
          buttonColor={colors.grey}
          />
    </>
  );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  editContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: colors.grey4,
  },
  infoItem: {
    paddingVertical: 16,
  },

  iconContainer: {
    marginTop: 16,
    padding: 6,
    backgroundColor: colors.grey4,
    borderRadius: 16,
    marginRight: 8,
  },

  errorText: {
    position: 'absolute',
    bottom: -20,
    right: 0,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginLeft: 8,
  },
  errorTextInline: {
    marginLeft: 4, 
  },
  textInput: {
    minWidth: 120,
    maxWidth: '50%',
    color: colors.dark,
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.grey4,
    paddingVertical: 4,
    textAlign: 'right',
    borderStyle: 'dotted',
  },
  inputError: {
    borderBottomColor: colors.red,
  },
  avatarContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -180}, {translateY: -40}],
    
  },
});
