import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ButtonComponent,
  Container,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '@/constants/colors';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useCustomNavigation} from '@/utils/navigation';
import {apiSignUp} from '@/api/apiSignUp';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';
const SignUpScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const initialValue = {
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  };
  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, 'Họ tên phải ít nhất 3 ký tự')
      .required('Họ tên là bắt buộc'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải ít nhất 6 ký tự')
      .required('Mật khẩu là bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
      .required('Xác nhận mật khẩu là bắt buộc'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Số điện thoại phải là 10 chữ số')
      .required('Số điện thoại là bắt buộc'),
  });
  const handleSignUp = (
    fullname: string,
    email: string,
    password: string,
    phoneNumber: string,
  ) => {
    showLoading();
    apiSignUp(fullname, email, password, phoneNumber).then((res: any) => {
      console.log(res);
      if (res.statusCode === 200) {
        hideLoading();
        Toast.show({
          type: 'success',
          text1: 'Đăng kí thành công',
          text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
        });
        goBack();
      } else {
        hideLoading();
        Toast.show({
          type: 'error',
          text1: 'Đăng kí thất bại',
          text2: `Xảy ra lỗi khi đăng kí ${res.message}`,
        });
      }
    });
  };
  const handleBack = () => {
    goBack();
  };
  return (
    <Container
      isScroll={true}
      left={
        <View
          style={{
            padding: 12,
            // backgroundColor: colors.white,
            // borderRadius: 8,
            marginTop: Platform.OS === 'android' ? 24 : 0,
          }}>
          <Entypo name="arrow-left" size={30} color={colors.grey} />
        </View>
      }
      onLeftPress={handleBack}>
      {/* <SpaceComponent height={50} /> */}
      <Image
        style={styles.logoImage}
        source={require('../../assets/images/LogoIcon.png')}
      />
      <SectionComponent styles={styles.welcomeContainer}>
        <TextComponent text="Đăng ký" size={30} />
        <RowComponent>
          <TextComponent text="cùng với" size={30} />
          <TextComponent
            text=" PETVERSE"
            size={40}
            color={colors.primary}
            type={'bigTitle'}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={30} />
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={values => {
          handleSignUp(
            values.fullname,
            values.email,
            values.password,
            values.phoneNumber,
          );
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <SectionComponent styles={{flex: 1}}>
              <TextComponent text="Họ và tên" type="title" />
              <InputComponent
                value={values.fullname}
                onChange={handleChange('fullname')}
                placeholder="Họ và tên"
              />
              {errors.fullname && touched.fullname && (
                <Text style={styles.errorText}>{errors.fullname}</Text>
              )}
              <TextComponent text="Email" type="title" />
              <InputComponent
                value={values.email}
                onChange={handleChange('email')}
                placeholder="Địa chỉ email"
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <TextComponent text="Mật khẩu" type="title" />
              <InputComponent
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Mật khẩu"
                isPassword={true}
              />
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <TextComponent text="Xác nhận mật khẩu" type="title" />
              <InputComponent
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="Xác nhận mật khẩu"
                isPassword={true}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              <TextComponent text="Số điện thoại" type="title" />
              <InputComponent
                value={values.phoneNumber}
                onChange={handleChange('phoneNumber')}
                placeholder="Số điện thoại"
                type='numeric'
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}
            </SectionComponent>
            <ButtonComponent
              text="Đăng ký"
              type="primary"
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  logoImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -12,
  },
});
