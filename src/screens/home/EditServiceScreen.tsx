import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
  TimePicker,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {globalStyles} from '@/styles/globalStyles';
import {
  apiGetPetCenterServiceByPetServiceId,
  apiUpdatePetCenterService,
} from '@/api/apiPetCenterService';
import Toast from 'react-native-toast-message';
import useLoading from '@/hook/useLoading';

const EditServiceScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const {petCenterServiceId, name} = route?.params?.service;
  const [serviceData, setServiceData] = useState<any>(null);
  const [isTimePickerVisible, setIsTimePickerVisible] =
    useState<boolean>(false);
  const [selectedScheduleIndex, setSelectedScheduleIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      showLoading();
      try {
        const res: any = await apiGetPetCenterServiceByPetServiceId(
          petCenterServiceId,
        );
        if (res.statusCode === 200) {
          setServiceData(res.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Lỗi tải dữ liệu',
            text2: 'Không thể tải thông tin dịch vụ',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Có lỗi xảy ra khi tải dữ liệu',
        });
      } finally {
        hideLoading();
      }
    };
    fetchServiceData();
  }, [petCenterServiceId]);

  const formatVND = (value: string | number) => {
    if (!value || isNaN(Number(value))) return '';
    return Number(value)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      price: serviceData?.price?.toString() || '',
      description: serviceData?.description || '',
      schedule: serviceData?.schedule || [],
    },
    validationSchema: Yup.object().shape({
      price: Yup.number()
        .min(1, 'Giá phải lớn hơn hoặc bằng 1')
        .max(10000000, 'Giá phải nhỏ hơn hoặc bằng 10,000,000')
        .required('Giá là bắt buộc'),
      description: Yup.string()
        .min(5, 'Mô tả phải lớn hơn 5 chữ')
        .required('Mô tả là bắt buộc'),
      schedule: Yup.array()
        .of(
          Yup.object().shape({
            description: Yup.string()
              .required('Mô tả là bắt buộc')
              .min(5, 'Mô tả phải lớn hơn 5 chữ'),
            time: Yup.string().required('Thời gian là bắt buộc'),
          }),
        )
        .required(),
    }),
    onSubmit: async values => {
      console.log('Values on Submit:', values);
      showLoading();
      try {
        const res: any = await apiUpdatePetCenterService(
          petCenterServiceId,
          values.price,
          values.description,
          serviceData.type,
          values.schedule,
        );
        if (res.statusCode === 200) {
          Toast.show({
            type: 'success',
            text1: 'Chỉnh sửa thành công',
            text2: 'Thông tin dịch vụ đã được cập nhật!',
          });
          goBack();
        } else {
          Toast.show({
            type: 'error',
            text1: 'Chỉnh sửa thất bại',
            text2: `Lỗi: ${res.message}`,
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Có lỗi xảy ra khi chỉnh sửa dịch vụ',
        });
      } finally {
        hideLoading();
      }
    },
  });

  const handleTimeConfirm = (time: string): void => {
    if (selectedScheduleIndex !== null) {
      const updatedSchedule = [...formik.values.schedule];
      updatedSchedule[selectedScheduleIndex].time = time;
      formik.setFieldValue('schedule', updatedSchedule);
    }
    setIsTimePickerVisible(false);
  };

  const handleDescriptionChange = (text: string, index: number) => {
    // Clone mảng schedule để giữ tính bất biến
    const updatedSchedule = [...formik.values.schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], description: text };
  
    // Cập nhật giá trị trong Formik
    formik.setFieldValue('schedule', updatedSchedule);
  };

  const handleDeleteSchedule = (index: number) => {
    const updatedSchedule = formik.values.schedule.filter(
      (_: any, i: any) => i !== index,
    );
    formik.setFieldValue('schedule', updatedSchedule);
  };

  const renderScheduleItem = ({item, index}: {item: any; index: number}) => (
    <View style={styles.scheduleItem}>
      <View style={styles.scheduleInfo}>
        <TextComponent
          text={`⏰ ${item.time}`}
          type="title"
          color={colors.primary}
          styles={{marginBottom: 8}}
        />
        <InputComponent
          onChange={text => handleDescriptionChange(text, index)}
          value={item.description}
          placeholder="Nhập mô tả"
          multiline
          allowClear
          // styles={styles.descriptionInput}
        />
        {formik.errors.schedule?.[index]?.description && (
          <Text style={globalStyles.errorText}>
            {formik.errors.schedule[index].description}
          </Text>
        )}
      </View>
      <View style={styles.scheduleActions}>
        <IconButtonComponent
          name="clock-edit-outline"
          size={20}
          color={colors.primary}
          onPress={() => {
            setSelectedScheduleIndex(index);
            setIsTimePickerVisible(true);
          }}
        />
        <IconButtonComponent
          name="delete-outline"
          size={20}
          color={colors.red}
          onPress={() => handleDeleteSchedule(index)}
        />
      </View>
    </View>
  );

  if (!serviceData) return null;
  return (
    <>
      <Container
        isScroll
        title={name}
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
            text={serviceData.type === 0 ? 'Giá (theo giờ)' : 'Giá (theo case)'}
            required
            type="title"
          />
          <InputComponent
            placeholder="Giá dịch vụ"
            onChange={value => {
              const numericValue = value.replace(/[^0-9]/g, '');
              formik.setFieldValue(
                'price',
                numericValue ? Number(numericValue) : 0,
              );
              formik.handleChange('price')(numericValue);
            }}
            value={formik.values.price ? formatVND(formik.values.price) : ''}
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

          <TextComponent text="Khung giờ làm việc" required type="title" />
          <FlatList
            scrollEnabled={false}
            data={formik.values.schedule}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderScheduleItem}
          />
        </SectionComponent>
      </Container>
      <ButtonComponent
        disable={!formik.isValid || !formik.dirty}
        text="Cập nhật"
        type="primary"
        onPress={formik.handleSubmit}
      />
      <TimePicker
        defaultValue={
          selectedScheduleIndex !== null
            ? formik.values.schedule[selectedScheduleIndex]?.time
            : undefined
        }
        onCancel={() => setIsTimePickerVisible(false)}
        onConfirm={handleTimeConfirm}
        isVisible={isTimePickerVisible}
      />
    </>
  );
};

export default EditServiceScreen;

const styles = StyleSheet.create({
  scheduleItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleInfo: {
    flex: 1,
    marginRight: 8,
  },
  scheduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 16,
    marginTop: 16,
  },
  descriptionInput: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.grey4,
    borderRadius: 8,
    backgroundColor: colors.grey2,
    color: colors.dark,
  },
});
