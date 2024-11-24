import {Image, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  ButtonComponent,
  Container,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {apiLogin} from '@/api/apiLogin';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useCustomNavigation} from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';
import {useAppDispatch} from '@/redux';
import {addAuth} from '@/redux/reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const {navigate} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const dispatch = useAppDispatch();
  const [isRemember, setIsRemember] = useState(true);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email là bắt buộc'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .required('Mật khẩu là bắt buộc'),
  });

  const handleLogin = async (email: string, password: string) => {
    try {
      showLoading();

      const res: any = await apiLogin(email, password);

      if (res.statusCode === 200) {
        dispatch(addAuth(res.data));
        await AsyncStorage.setItem(
          'auth',
          isRemember ? JSON.stringify(res.data) : '',
        );

        hideLoading();
        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công',
          text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
        });
      } else {
        hideLoading();
        Toast.show({
          type: 'error',
          text1: 'Đăng nhập thất bại',
          text2: `Xảy ra lỗi: ${res.message}`,
        });
      }
    } catch (error) {
      hideLoading();
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: 'Có lỗi xảy ra trong quá trình đăng nhập.',
      });
      console.error('Lỗi đăng nhập:', error);
    }
  };

  const signUpHandle = () => {
    navigate(STACK_NAVIGATOR_SCREENS.SIGNUPSCREEN);
  };
  const forgotPasswordHandle = () => {
    navigate(STACK_NAVIGATOR_SCREENS.FORGOTPASSWORDSCREEN);
  } 

  return (
    <Container
    isScroll={true}>
      <SpaceComponent height={50} />
      <Image
        style={styles.logoImage}
        source={require('../../assets/images/LogoIcon.png')}
      />
      <SectionComponent styles={styles.welcomeContainer}>
        <TextComponent text="Chào mừng" size={30} />
        <RowComponent>
          <TextComponent text="đến với" size={30} />
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          handleLogin(values.email, values.password);
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
            <SectionComponent>
              <TextComponent text="Tài khoản" />
              <InputComponent
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Email"
                iconRight={
                  <FontAwesome name="envelope" size={22} color={colors.grey} />
                }
              />
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              <TextComponent text="Mật khẩu" styles={{marginTop: 10}} />
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
            </SectionComponent>
            <SectionComponent>
            <RowComponent
              justify="space-between"
              styles={{marginTop: -20}}>
              <RowComponent onPress={() => setIsRemember(!isRemember)}>
                <Switch
                  trackColor={{true: colors.primary}}
                  thumbColor={colors.white}
                  value={isRemember}
                  onChange={() => setIsRemember(!isRemember)}
                />
                <SpaceComponent width={4} />
                <TextComponent text="Remember me" />
              </RowComponent>
              <ButtonComponent
                text="Quên mật khẩu?"
                onPress={forgotPasswordHandle}
                type="text"
              />
            </RowComponent>
            </SectionComponent>
            <ButtonComponent
              text="Đăng nhập"
              type="primary"
              onPress={handleSubmit} 
            />

            <RowComponent>
              <TextComponent text="Nếu bạn chưa có tài khoản." />
              <ButtonComponent
                text=" Đăng kí ngay!"
                type="text"
                onPress={signUpHandle}
                textStyles={{
                  fontSize: 16,
                  color: colors.primary,
                  fontWeight: 'bold',
                }}
              />
            </RowComponent>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default LoginScreen;

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
