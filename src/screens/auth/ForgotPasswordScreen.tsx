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
import {Formik} from 'formik';
import {colors} from '@/constants/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import {useCustomNavigation} from '@/utils/navigation';
import {apiForgotPassword} from '@/api/apiForgotPassword';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const initialValues = {
    email: '',
    newPassword: '',
    confirmPassword: '', // Thêm confirmPassword

  };
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

  const forgotPasswordHandle = (email: string, newPassword: string) => {
    showLoading()
    apiForgotPassword(email, newPassword).then((res: any) => {
      console.log(res);
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
  };

  const handleBack = () => {
    goBack();
  };

  return (
    <Container
      left={
        <View
          style={{ borderRadius: 8}}>
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
          text="Hãy nhập chính xác email của bạn và điền lại mật khẩu mới vào bên dưới"
          numOfLine={2}
          type="text"
          styles={styles.description}
        />
      </SectionComponent>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values =>
          forgotPasswordHandle(values.email, values.newPassword)
        }>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <SectionComponent>
              <TextComponent text="Email" />
              <InputComponent
                onChange={handleChange('email')}
                value={values.email}
                onBlur={handleBlur('email')}
                placeholder="Email"
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <TextComponent text="Mật khẩu mới" styles={{marginTop: 10}} />
              <InputComponent
                value={values.newPassword}
                onChange={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                placeholder="Mật khẩu mới"
                isPassword={true}
              />
              {errors.newPassword && touched.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
                 <TextComponent
                text="Xác nhận mật khẩu mới"
                styles={{marginTop: 10}}
              />
              <InputComponent
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="Xác nhận mật khẩu mới"
                isPassword={true}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </SectionComponent>
            <ButtonComponent
              text="Xác nhận"
              type="primary"
              onPress={handleSubmit} // Gọi đúng hàm handleSubmit
            />
          </>
        )}
      </Formik>
    </Container>
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
