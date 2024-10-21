import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AddImageComponent,
  Container,
  DropdownPicker,
  IconButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {apiGetPetByUserId, apiGetPetSubType, apiGetPetType} from '@/api/apiPet';
import {useAppSelector} from '@/redux';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import useLoading from '@/hook/useLoading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SelectModel} from '@/models/SelectModel';
import {AddCircle, PlayCircle} from 'iconsax-react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import Slider from '@react-native-community/slider';
import {Circle} from 'react-native-svg';
const MyPetScreen = () => {
  const userId = useAppSelector(state => state.auth.userId);
  const {goBack, navigate} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const [avatar, setAvatar] = useState('');
  const [petType, setPetType] = useState([]);
  const [petSubType, setSubPetType] = useState<SelectModel[]>([]);
  const [selectedPetTypeId, setSelectedPetTypeId] = useState<number>(0);
  const [isOpenGallary, setIsOpenGallary] = useState(false);
  const [gender, setGender] = useState<number | null>(null);
  const [sterilized, setSterilized] = useState<boolean>(false);
  const [petPhotos, setPetPhotos] = useState([])
  const getPetIcon = (id: number) => {
    switch (id) {
      case 1:
        return 'dog';
        break;
      case 2:
        return 'cat';
        break;
      default:
        return 'paw';
    }
  };
  const getGenderIcon = (type: number) => {
    switch (type) {
      case 1:
        return 'gender-male';
      case 2:
        return 'gender-female';
      default:
        return 'paw';
    }
  };

  const selectetPetPhotoHandle = (imagePath: any) =>{
        console.log(imagePath)
  }

  const onPressGender = (type: number) => {
    setGender(type);
    formik.setFieldValue('gender', type);
  };

  const onPressPetType = (id: number) => {
    setSelectedPetTypeId(id);
    formik.setFieldValue('selectedPetTypeId', id);
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

  const openGallaryHandle = () => {
    // imageModalRef.current?.close();
    if (RESULTS.GRANTED) {
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
        }).then((images: any) => {
          setAvatar(images.path);
        });
      }
    }
    return;
  };

  useEffect(() => {
    apiGetPetByUserId(userId).then((res: any) => {
      // console.log('res', res);
    });
  }, []);
  useEffect(() => {
    showLoading();
    apiGetPetSubType(selectedPetTypeId).then((res: any) => {
      if (res.statusCode === 200) {
        const items: SelectModel[] = [];
        res?.data?.items.forEach((item: any) => {
          items.push({
            label: item?.subName,
            value: item?.id,
            description: item?.description,
          });
        });
        setSubPetType(items);
        hideLoading();
      }
    });
  }, [selectedPetTypeId]);
  useEffect(() => {
    showLoading();
    apiGetPetType().then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setPetType(res?.data?.items);
      }
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      petName: '',
      selectedPetTypeId: 0,
      petSubTypeId: 0,
      age: 0,
      gender: 0,
      weight: 0,
      sterilized: false,
      avatar: '',
      description: '',
      petPhotos: [],
    },
    validationSchema: Yup.object().shape({
      petName: Yup.string()
        .min(3, 'Tên thú cưng phải trên 3 ký tự')
        .required('Tên thú cưng là bắt buộc'),
      petType: Yup.number().required('Loại thú cưng là bắt buộc'),
      petSubType: Yup.number().required('Giống thú cưng là bắt buộc'),
      gender: Yup.number().required('Giới tính là bắt buộc'),
      sterilized: Yup.boolean().required('Tiêm chủng là bắt buộc'),
      avatar: Yup.string().required('Avatar là bắt buộc'),
    }),
    onSubmit: values => {
      console.log(values);
    },
  });

  console.log(
    'formik values',
    formik.values.petSubTypeId,
    formik.values.selectedPetTypeId,
    formik.values.avatar,
    formik.values.gender,
    formik.values.petPhotos,
  );
  return (
    <Container
      title="Thú cưng của tôi"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
      isScroll={true}>
      <SectionComponent>
        <TextComponent text="Ảnh đại diện" type="title" />

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
            onPress={openGallaryHandle}>
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

        <TextComponent text="Tên thú cưng" type="title" />
        <InputComponent
          onChange={formik.handleChange('petName')}
          value={formik.values.petName}
          onBlur={formik.handleBlur('petName')}
          placeholder="Nhập tên thú cưng"
        />
        {formik.errors.petName && formik.touched.petName && (
          <Text style={styles.errorText}>{formik.errors.petName}</Text>
        )}

        <TextComponent text="Loại thú cưng" type="title" />
        <RowComponent styles={{justifyContent: 'flex-start'}}>
          {petType.map((item: any) => {
            const iconName = getPetIcon(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.iconPetContainer,
                  {
                    backgroundColor:
                      selectedPetTypeId === item.id
                        ? colors.primary
                        : colors.white,
                  },
                ]}
                onPress={() => onPressPetType(item.id)}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={32}
                  color={
                    selectedPetTypeId === item.id ? colors.white : colors.dark
                  }
                />
              </TouchableOpacity>
            );
          })}
        </RowComponent>
        <TextComponent text="Giống" type="title" />
        <DropdownPicker
          multible={false}
          placeholder="Chọn giống"
          values={petSubType}
          onSelect={(selectedPetSubType: string | string[]) => {
            formik.setFieldValue('petSubTypeId', selectedPetSubType);
          }}
        />
        <TextComponent text="Tuổi" type="title" />
        <InputComponent
          onChange={formik.handleChange('age')}
          type="numeric"
          value={formik?.values?.age?.toString()}
        />
        <TextComponent text="Giới tính" type="title" />
        <RowComponent styles={{justifyContent: 'flex-start'}}>
          {[1, 2].map(item => {
            const iconName = getGenderIcon(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.iconPetContainer,
                  {
                    backgroundColor:
                      gender === item ? colors.primary : colors.white,
                  },
                ]}
                onPress={() => onPressGender(item)}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={32}
                  color={gender === item ? colors.white : colors.dark}
                />
              </TouchableOpacity>
            );
          })}
        </RowComponent>
        <RowComponent justify="flex-start" styles={{marginTop: 6}}>
          <TextComponent text="Cân nặng " type="title" />
          <TextComponent
            text={`${formik?.values?.weight?.toString()} (kg)`}
            type="bigTitle"
          />
        </RowComponent>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={50}
          step={0.5}
          value={formik.values.weight}
          onValueChange={value => {
            formik.setFieldValue('weight', value);
          }}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.secondary}
          thumbTintColor={colors.primary}
        />
        <TextComponent text="Thú cưng đã được triệt sản?" type="title" />
        <RowComponent styles={{justifyContent: 'space-between', marginVertical: 6}}>
          <TouchableOpacity
            style={styles.sterilizedOption}
            onPress={() => formik.setFieldValue('sterilized', true)}>
            <TextComponent
              text="Đã triệt sản"
              color={formik.values.sterilized ? colors.primary : colors.dark}
              type={formik.values.sterilized ? 'title' : 'text'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sterilizedOption}
            onPress={() => formik.setFieldValue('sterilized', false)}>
            <TextComponent
              text="Chưa triệt sản"
              color={!formik.values.sterilized ? colors.primary : colors.dark}
              type={!formik.values.sterilized ? 'title' : 'text'}
            />
          </TouchableOpacity>
        </RowComponent>
        <TextComponent text='Hình ảnh' type='title'/>
        <AddImageComponent onSelected={(imagePath:string | string[])=>selectetPetPhotoHandle(imagePath)}/>
      </SectionComponent>
    </Container>
  );
};

export default MyPetScreen;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -12,
  },
  iconPetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    marginRight: 16,
    marginTop: 8,
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
  slider: {
    width: '100%',
    height: 40,
  },
  weightLabel: {
    marginTop: 10,
    fontSize: 16,
    color: colors.dark,
  },
  sterilizedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
});
