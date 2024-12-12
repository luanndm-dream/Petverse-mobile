import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  ButtonComponent,
  Container,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {colors} from '@/constants/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import {useCustomNavigation} from '@/utils/navigation';
import {apiForgotPassword} from '@/api/apiForgotPassword';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    newPassword: Yup.string()
      .min(6, 'Mật khẩu mới không hợp lệ')
      .required('Mật khẩu mới là bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
      .required('Mật khẩu xác nhận là bắt buộc'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: values => {
      showLoading();
      apiForgotPassword(values.email, values.newPassword).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Khôi phục mật khẩu thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Khôi phục mật khẩu thất bại',
            text2: `Xảy ra lỗi ${res.message}`,
          });
        }
      });
    },
  });

  const handleBack = () => {
    goBack();
  };

  return (
    <>
      <Container
        left={
          <View style={{borderRadius: 8}}>
            <Entypo name="arrow-left" size={30} color={colors.grey} />
          </View>
        }
        onLeftPress={handleBack}>
        <SpaceComponent height={50} />
        <Image
          style={styles.logoImage}
          source={require('../../assets/images/ForgotPasswordIcon.png')}
        />
        <SectionComponent styles={styles.welcomeContainer}>
          <TextComponent
            text="Hãy nhập chính xác email của bạn và điền lại mật khẩu mới vào bên dưới."
            numOfLine={2}
            type="text"
            styles={styles.description}
          />
        </SectionComponent>
        <SectionComponent>
          <TextComponent text="Email" />
          <InputComponent
            onChange={formik.handleChange('email')}
            value={formik.values.email}
            onBlur={formik.handleBlur('email')}
            placeholder="Email"
          />
          {formik.errors.email && formik.touched.email && (
            <Text style={styles.errorText}>{formik.errors.email}</Text>
          )}
          <TextComponent text="Mật khẩu mới" styles={{marginTop: 10}} />
          <InputComponent
            value={formik.values.newPassword}
            onChange={formik.handleChange('newPassword')}
            onBlur={formik.handleBlur('newPassword')}
            placeholder="Mật khẩu mới"
            isPassword={true}
          />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <Text style={styles.errorText}>{formik.errors.newPassword}</Text>
          )}
          <TextComponent
            text="Xác nhận mật khẩu mới"
            styles={{marginTop: 10}}
          />
          <InputComponent
            value={formik.values.confirmPassword}
            onChange={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            placeholder="Xác nhận mật khẩu mới"
            isPassword={true}
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <Text style={styles.errorText}>
              {formik.errors.confirmPassword}
            </Text>
          )}
        </SectionComponent>
      </Container>

      <ButtonComponent
        text="Xác nhận"
        type="primary"
        onPress={formik.handleSubmit} // Gọi hàm submit của useFormik
      />
    </>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  logoImage: {
    width: 160,
    height: 160,
    alignSelf: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
    paddingTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -12,
  },
});
