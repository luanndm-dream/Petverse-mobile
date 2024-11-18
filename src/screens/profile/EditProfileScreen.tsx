import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import useLoading from '@/hook/useLoading';
import {useAppSelector} from '@/redux';
import {apiGetUserByUserId, apiUpdateUser} from '@/api/apiUser';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {genderOptions} from '@/constants/app';
import Toast from 'react-native-toast-message';

const EditProfileScreen = () => {
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const {goBack, navigate} = useCustomNavigation();
  const [userData, setUserData] = useState<any>();

  const [initialValues, setInitialValues] = useState({
    fullName: '',
    gender: '',
    address: '',
    phoneNumber: '',
  });
  
  // Trong useEffect, khi lấy được data:
  useEffect(() => {
    showLoading();
    apiGetUserByUserId(userId).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setUserData(res.data);
        const values = {
          fullName: res.data.fullName || '',
          gender: res.data.gender || '',
          address: res.data.address || '',
          phoneNumber: res.data.phoneNumber || '',
        };
        setInitialValues(values);
        formik.setValues(values);
      } else {
        hideLoading();
        console.log('lấy dữ lieu user thât bại');
      }
    });
  }, [userId]);
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .required('Họ tên là bắt buộc'),

    gender: Yup.number()
      .oneOf([1, 2, 3], 'Giới tính phải là 1, 2 hoặc 3')
      .required('Giới tính là bắt buộc'),

    address: Yup.string()
      .min(10, 'Địa chỉ phải có ít nhất 10 ký tự')
      .required('Địa chỉ là bắt buộc'),

    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Số điện thoại phải gồm đúng 10 chữ số')
      .required('Số điện thoại là bắt buộc'),
  });
  const formik = useFormik({
    initialValues: {
      fullName: '',
      gender: '',
      address: '',
      phoneNumber: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: val => {
      showLoading()
      apiUpdateUser(userId, val.fullName, Number(val.gender), val.address, val.phoneNumber).then((res: any)=>{
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Thay đổi thông tin thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack()
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Thay đổi thông tin thất bại',
            text2: `Xảy ra lỗi khi thay đổi thông tin ${res.error}`,
          });
        }
      })
    },
  });
  const hasChanges = () => {
    return (
      formik.values.fullName !== initialValues.fullName ||
      formik.values.gender !== initialValues.gender ||
      formik.values.address !== initialValues.address ||
      formik.values.phoneNumber !== initialValues.phoneNumber
    );
  };

  return (
    <>
      <Container
        title="Thông tin cá nhân"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          <TextComponent text="Họ và tên" type="title" required />
          <InputComponent
            onChange={formik.handleChange('fullName')}
            value={formik.values.fullName}
            allowClear
            onBlur={formik.handleBlur('fullName')}
            placeholder="Họ và tên"
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <TextComponent text={formik.errors.fullName} color="red" />
          )}
          <TextComponent text="Giới tính" type="title" required />
          <View style={styles.genderContainer}>
            {genderOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.genderOption,
                  Number(formik.values.gender) === option.id &&
                    styles.selectedGender,
                ]}
                onPress={() => formik.setFieldValue('gender', option.id)}>
                <TextComponent
                  text={option.label}
                  styles={[
                    styles.genderText,
                    Number(formik.values.gender) === option.id &&
                      styles.selectedGenderText,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          {formik.touched.gender && formik.errors.gender && (
            <TextComponent text={formik.errors.gender} color="red" />
          )}
          <TextComponent text="Địa chỉ" type="title" required />
          <InputComponent
            onChange={formik.handleChange('address')}
            value={formik.values.address}
            allowClear
            maxLength={200}
            multiline
            placeholder="Địa chỉ"
          />
          {formik.touched.address && formik.errors.address && (
            <TextComponent text={formik.errors.address} color="red" />
          )}
          <TextComponent text="Số điện thoại" type="title" required />
          <InputComponent
            onChange={formik.handleChange('phoneNumber')}
            value={formik.values.phoneNumber}
            placeholder="Số điện thoại"
            type="numeric"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <TextComponent text={formik.errors.phoneNumber} color="red" />
          )}
        </SectionComponent>
      </Container>
      <ButtonComponent
        text="Thay đổi"
        type="primary"
        onPress={formik.handleSubmit} 
        disable={!hasChanges() || !formik.isValid}
      />
    </>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  genderOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  selectedGender: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  genderText: {
    color: colors.dark,
  },
  selectedGenderText: {
    color: colors.white,
  },
});
