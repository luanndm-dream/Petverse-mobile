import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Container,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '@/constants/colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
const EmployeeRegistrationScreen = () => {
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
            <TextComponent text="Họ và tên" type="title" />
            <InputComponent
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              placeholder="Họ và tên"
            />
            {errors.name && touched.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextComponent text="Số điện thoại" type="title" />
            <InputComponent
              onChange={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              value={values.name}
              placeholder="Số điện thoại"
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

             <TextComponent text="Địa chỉ" type="title" />
            <InputComponent
              onChange={handleChange('address')}
              onBlur={handleBlur('address')}
              value={values.name}
              placeholder="Địa chỉ"
            />
            {errors.address && touched.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
            
            <TextComponent text="Hình ảnh" type="title" />
            <InputComponent
              onChange={handleChange('image')}
              onBlur={handleBlur('image')}
              value={values.name}
              placeholder="Địa chỉ"
            />
            {errors.address && touched.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </SectionComponent>
        )}
      </Formik>
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
});
