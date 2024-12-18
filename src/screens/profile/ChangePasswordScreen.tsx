import {Keyboard, StyleSheet, Text, View} from 'react-native';
import React from 'react';
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
import {apiChangePassword} from '@/api/apiUser';
import {useAppSelector} from '@/redux';
import Toast from 'react-native-toast-message';
import useLoading from '@/hook/useLoading';

const ChangePasswordScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Mật khẩu hiện tại là bắt buộc'),
      newPassword: Yup.string()
        .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
        .required('Mật khẩu mới là bắt buộc'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
        .required('Xác nhận mật khẩu mới là bắt buộc'),
    }),
    onSubmit: values => {
      showLoading();
      apiChangePassword(
        userId,
        values.currentPassword,
        values.confirmPassword,
      ).then((res: any) => {
       // console.log(values, userId, res);
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Đổi mật khẩu thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Đổi mật khẩu thất bại',
            text2: `Xảy ra lỗi ${res.message}`,
          });
        }
      });
    },
  });

  return (
    <>
      <Container
        title="Đổi mật khẩu"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        {/* Mật khẩu hiện tại */}
        <SectionComponent>
          <TextComponent text="Mật khẩu hiện tại" type="title" required />
          <InputComponent
            onChange={formik.handleChange('currentPassword')}
            onBlur={formik.handleBlur('currentPassword')}
            value={formik.values.currentPassword}
            placeholder="Mật khẩu hiện tại"
            isPassword
          />
          {formik.errors.currentPassword && formik.touched.currentPassword && (
            <Text style={styles.errorText}>
              {formik.errors.currentPassword}
            </Text>
          )}
        </SectionComponent>

        {/* Mật khẩu mới */}
        <SectionComponent>
          <TextComponent text="Mật khẩu mới" type="title" required />
          <InputComponent
            onChange={formik.handleChange('newPassword')}
            onBlur={formik.handleBlur('newPassword')}
            value={formik.values.newPassword}
            placeholder="Mật khẩu mới"
            isPassword
          />
          {formik.errors.newPassword && formik.touched.newPassword && (
            <Text style={styles.errorText}>{formik.errors.newPassword}</Text>
          )}
        </SectionComponent>

        {/* Xác nhận mật khẩu mới */}
        <SectionComponent>
          <TextComponent text="Xác nhận mật khẩu mới" type="title" required />
          <InputComponent
            onChange={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            value={formik.values.confirmPassword}
            placeholder="Xác nhận mật khẩu mới"
            isPassword
          />
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <Text style={styles.errorText}>
              {formik.errors.confirmPassword}
            </Text>
          )}
        </SectionComponent>
      </Container>

      <View style={{paddingHorizontal: 16}}>
        <ButtonComponent
          text="Đổi mật khẩu"
          type="primary"
          onPress={formik.handleSubmit}
          // styles={styles.submitButton}
        />
      </View>
    </>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 20,
    marginHorizontal: 16,
  },
});
