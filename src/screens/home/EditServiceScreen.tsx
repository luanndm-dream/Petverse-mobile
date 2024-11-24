import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {globalStyles} from '@/styles/globalStyles';
import {apiUpdatePetCenterService} from '@/api/apiPetCenterService';
import Toast from 'react-native-toast-message';
import useLoading from '@/hook/useLoading';
const EditServiceScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const service = route?.params?.service;
  console.log(service);
  const formik = useFormik({
    initialValues: {
      price: service.price.toString(),
      description: service.description,
    },
    validationSchema: Yup.object().shape({
      price: Yup.number()
        .min(1, 'Giá phải lớn hơn hoặc bằng 1')
        .max(10000000, 'Giá phải nhỏ hơn hoặc bằng 10,000,000')
        .required('Giá là bắt buộc'),
      description: Yup.string()
        .min(5, 'Mô tả phải lớn hơn 5 chữ')
        .required('Mô tả là bắt buộc'),
    }),
    onSubmit: val => {
      apiUpdatePetCenterService(
        service.petCenterServiceId,
        service.petCenterServiceId,
        formik.values.price,
        formik.values.description,
        service.type,
      ).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Chỉnh sửa dịch vụ thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Chỉnh sửa dịch vụ thất bại',
            text2: `Xảy ra lỗi ${res.message}`,
          });
        }
      });
    },
  });
  return (
    <>
      <Container
        title={service.name}
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          <TextComponent text="Mô tả dịch vụ" required type="title" />
          <InputComponent
            placeholder="Mô tả dịch vụ của bạn"
            onChange={formik.handleChange('description')}
            value={formik.values.description}
            multiline
            allowClear
            onBlur={formik.handleBlur('description')}
          />
          {formik.errors.description && formik.touched.description && (
            <Text style={globalStyles.errorText}>
              {typeof formik.errors.description === 'string'
                ? formik.errors.description
                : ''}
            </Text>
          )}

          <TextComponent
            text={service.type === 0 ? 'Giá (theo giờ)' : 'Giá'}
            required
            type="title"
          />
          <InputComponent
            placeholder="Giá dịch vụ"
            onChange={formik.handleChange('price')}
            value={formik.values.price}
            type="numeric"
            onBlur={formik.handleBlur('price')}
          />
          {formik.errors.price && formik.touched.price && (
            <Text style={globalStyles.errorText}>
              {typeof formik.errors.price === 'string'
                ? formik.errors.price
                : ''}
            </Text>
          )}
        </SectionComponent>
      </Container>
      <ButtonComponent
        disable={!formik.isValid || !formik.dirty}
        text="Cập nhật"
        type="primary"
        onPress={formik.handleSubmit}
      />
    </>
  );
};

export default EditServiceScreen;

const styles = StyleSheet.create({});
