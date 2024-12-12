import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  AddImageComponent,
  ButtonComponent,
  Container,
  DropdownPicker,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import {SelectModel} from '@/models/SelectModel';
import {apiGetPetSpecies} from '@/api/apiPet';
import {useFormik} from 'formik';
import {number} from 'yup';
import {globalStyles} from '@/styles/globalStyles';
import * as Yup from 'yup';
import {apiCreateCenterBreed} from '@/api/apiCenterBreed';
import {useAppSelector} from '@/redux';
import Toast from 'react-native-toast-message';
const AddCenterBreedScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const [resetDropdown, setResetDropdown] = useState(false);
  const [spicies, setSpicies] = useState<SelectModel[]>([]);
  const petCenterId = useAppSelector(state => state.auth.petCenterId) as never;

  const formatVND = (value: string | number) => {
    if (!value || isNaN(Number(value))) return '0'; // Trả về '0' nếu không hợp lệ
    return Number(value)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Thêm dấu phân cách hàng nghìn
  };

  const handleResetDropdown = () => {
    setResetDropdown(true);
    // Đợi một chút để reset
    setTimeout(() => setResetDropdown(false), 50);
  };
  
  useEffect(() => {
    showLoading();
    apiGetPetSpecies().then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        const items: SelectModel[] = [];
        res?.data?.items.forEach((item: any) => {
          items.push({
            label: item.name,
            value: item.id,
          });
        });
        setSpicies(items);
      }
    });
  }, []);
  const validationSchema = Yup.object().shape({
    speciesId: Yup.number()
      .required('Vui lòng chọn loại thú cưng')
      .min(1, 'Vui lòng chọn loại thú cưng hợp lệ'),
    name: Yup.string()
      .required('Vui lòng nhập tên')
      .min(3, 'Tên phải có ít nhất 3 ký tự')
      .max(30,'Tên tối đa 30 ký tự'),
    description: Yup.string()
      .required('Vui lòng nhập mô tả')
      .min(10,'Mô tả phải nhiều hơn 10 ký tự')
      .max(200, 'Mô tả không được vượt quá 300 ký tự'),
    price: Yup.number()
      .required('Vui lòng nhập giá')
      .min(1000, 'Giá phải lớn hơn 1000')
      .max(100000000, 'Giá phải nhỏ hơn 100 triệu'),
    images: Yup.array()
      .of(Yup.string().required('Hình ảnh không hợp lệ'))
      .min(1, 'Vui lòng chọn ít nhất một hình ảnh'),
  });

  const formik = useFormik({
    initialValues: {
      speciesId: 0,
      name: '',
      description: '',
      price: 0,
      images: [],
    },
    validationSchema: validationSchema,
    onSubmit: val => {
      showLoading();
      apiCreateCenterBreed(
        petCenterId,
        val.speciesId,
        val.name,
        val.description,
        val.price,
        val.images,
      ).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Tạo giống thành công',
            text2: 'Vui lòng chờ quản lí xét duyệt giống!',
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Tạo giống thất bại',
            text2: `Xảy ra lỗi ${res.message}`,
          });
        }
      });
    },
  });
  return (
    <>
      <Container
        isScroll
        title="Thêm mới giống"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent styles={{flex: 1}}>
          <TextComponent text="Loại giống" type="title" required />
          <DropdownPicker
            values={spicies}
            onSelect={(selectedSpecies: string | string[]) => {
              formik.setFieldValue('speciesId', selectedSpecies || null);
            }}
            placeholder="Chọn giống"
            formik={formik}
            validateField='speciesId'
          />
          {formik.errors.speciesId && (
            <Text style={globalStyles.errorText}>
              {formik.errors.speciesId}
            </Text>
          )}
          <TextComponent text="Tên giống" type="title" required />
          <InputComponent
            onChange={formik.handleChange('name')}
            value={formik.values.name}
            onBlur={formik.handleBlur('name')}
            placeholder="Nhập tên giống"
          />
          {formik.errors.name && formik.touched.name && (
            <Text style={globalStyles.errorText}>{formik.errors.name}</Text>
          )}
          <TextComponent text="Mô tả giống" type="title" required />
          <InputComponent
            onChange={formik.handleChange('description')}
            value={formik.values.description}
            onBlur={formik.handleBlur('description')}
            placeholder="Mô tả giống"
            multiline
            maxLength={300}
            allowClear
          />
          {formik.errors.description && formik.touched.description && (
            <Text style={globalStyles.errorText}>
              {formik.errors.description}
            </Text>
          )}

          <TextComponent text="Giá" type="title" required />
          <InputComponent
            onChange={value => {
              // Loại bỏ ký tự không phải số trước khi lưu
              const numericValue = value.replace(/[^0-9]/g, '');
              formik.setFieldValue(
                'price',
                numericValue ? Number(numericValue) : 0,
              ); // Lưu giá trị thật (0 nếu trống)

              // Format giá trị hiển thị
              formik.handleChange('price')(numericValue);
            }}
            value={formik.values.price ? formatVND(formik.values.price) : ''} // Format giá trị nếu có, ngược lại để trống
            onBlur={formik.handleBlur('price')}
            placeholder="Giá"
            type="numeric"
          />
          {formik.errors.price && formik.touched.price && (
            <Text style={globalStyles.errorText}>{formik.errors.price}</Text>
          )}
          <TextComponent text="Giấy chứng nhận" type="title" required />
          <AddImageComponent
            onSelected={(url: string | string[]) => {
              formik.setFieldValue('images', Array.isArray(url) ? url : [url]);
            }}
            onlyImage
          />
          {formik.errors.images && formik.touched.images && (
            <Text style={globalStyles.errorText}>{formik.errors.images}</Text>
          )}
        </SectionComponent>
      </Container>
      <ButtonComponent
        text="Thêm mới"
        type="primary"
        onPress={formik.handleSubmit}
      />
    </>
  );
};

export default AddCenterBreedScreen;

const styles = StyleSheet.create({});
