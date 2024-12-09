import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
} from 'react-native';
import React, {useState} from 'react';
import {
  AddImageComponent,
  ButtonComponent,
  Container,
  DatePicker,
  IconButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useRoute} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {AddCircle, ArrowDown2} from 'iconsax-react-native';
import {globalStyles} from '@/styles/globalStyles';
import {apiCreatePetVaccinated} from '@/api/apiPetVaccinated';
import {mediaUpload} from '@/utils/mediaUpload';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const AddVaccineScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const {petId, petBirthDate, vaccineName, vaccineId} = route.params;
  const [isVisible, setIsVisible] = useState(false);
  const [certificates, setCertificates] = useState<string>();
  const [date, setDate] = useState<any>();
  const formik: any = useFormik({
    initialValues: {
      vaccineName: vaccineName || '',
      vaccinationDate: '',
      certificates: [],
    },
    validationSchema: Yup.object().shape({
      vaccineName: Yup.string()
        .required('Tên vaccine không được để trống')
        .min(3, 'Tên vaccine phải lớn hơn 3 ký tự')
        .max(60, 'Tên vaccine chỉ tối đa 60 kí tự'),
      vaccinationDate: Yup.string().required('Ngày tiêm vaccine là bắt buộc'),
      certificates: Yup.array()
        .of(Yup.string())
        .min(1, 'Giấy chứng nhận là bắt buộc'),
    }),
    onSubmit: values => {
        showLoading()
        console.log(vaccineId)
      apiCreatePetVaccinated(
        petId,
        values.vaccineName,
        values.certificates,
        values.vaccinationDate,
        vaccineId
      ).then((res: any) => {
        if (res.statusCode === 200) {
            hideLoading();
            Toast.show({
              type: 'success',
              text1: 'Thêm vaccine đã tiêm thành công',
              text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
            });
            goBack();
          } else {
            hideLoading();
            Toast.show({
              type: 'error',
              text1: 'Thêm vaccine đã tiêm thất bại',
              text2: `Xảy ra lỗi ${res.message}`,
            });
          }
      });
    },
  });

  const handleAddCertificate = (paths: string) => {
    setCertificates(paths);
    formik.setFieldValue('certificates', paths);
  };

  return (
    <>
      <Container
        title="Thêm vaccine đã tiêm"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          {/* Tên vaccine */}
          <TextComponent text="Tên vaccine" required type="title" />
          <InputComponent
            placeholder="Nhập tên vaccine"
            onChange={formik.handleChange('vaccineName')}
            value={formik.values.vaccineName}
            onBlur={formik.handleBlur('vaccineName')}
            allowClear={vaccineName? false: true}
            isEdit={vaccineName? false: true}
          />
          {formik.errors.vaccineName && formik.touched.vaccineName && (
            <Text style={globalStyles.errorText}>
              {formik.errors.vaccineName}
            </Text>
          )}

          {/* Giấy chứng nhận tiêm */}
          <TextComponent text="Giấy chứng nhận tiêm" required type="title" />

          <AddImageComponent
            onSelected={(val: any) => handleAddCertificate(val)}
            maxItem={1}
          />
          {formik.errors.certificates && formik.touched.certificates && (
            <Text style={globalStyles.errorText}>
              {formik.errors.certificates}
            </Text>
          )}

          {/* Ngày tiêm vaccine */}
          <TextComponent text="Ngày tiêm vaccine" required type="title" />
          <RowComponent
            styles={[
              globalStyles.inputContainer,
              {justifyContent: 'space-between'},
            ]}
            onPress={() => setIsVisible(!isVisible)}>
            <TextComponent
              text={
                formik.values.vaccinationDate
                  ? formik.values.vaccinationDate
                  : 'Chọn ngày tiêm vaccine'
              }
              color={formik.values.vaccinationDate ? colors.dark : colors.grey}
            />
            <ArrowDown2 size={22} color={colors.grey} />
          </RowComponent>
          {formik.errors.vaccinationDate && formik.touched.vaccinationDate && (
            <Text style={globalStyles.errorText}>
              {formik.errors.vaccinationDate}
            </Text>
          )}
        </SectionComponent>
        {/* Nút lưu */}
      </Container>
      <ButtonComponent
        text="Lưu"
        type="primary"
        onPress={formik.handleSubmit}
      />
      <DatePicker
        onCancel={() => setIsVisible(false)}
        onConfirm={date => {
          formik.setFieldValue('vaccinationDate', date);
          setIsVisible(false);
        }}
        isVisible={isVisible}
        maxDateNow
        minDateValue={petBirthDate}
      />
    </>
  );
};

export default AddVaccineScreen;

const styles = StyleSheet.create({
  certificateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 12,
  },
  addCertificateButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey4,
  },
  certificateWrapper: {
    position: 'relative',
    marginRight: 12,
    marginBottom: 12,
  },
  certificateImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
});
