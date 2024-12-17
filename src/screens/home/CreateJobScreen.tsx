import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  Container,
  DropdownPicker,
  IconButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useCustomNavigation} from '@/utils/navigation';
import {useAppSelector} from '@/redux';
import {apiGetPetCenterByPetCenterId} from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {globalStyles} from '@/styles/globalStyles';
import {apiGetPetSpecies} from '@/api/apiPet';
import {SelectModel} from '@/models/SelectModel';
import {apiCreateJob} from '@/api/apiJob';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';

const CreateJobScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [servicesRegisted, setServicesRegisted] = useState([]);
  const [species, setSpecies] = useState<SelectModel[]>([]);
  const [priceErrors, setPriceErrors] = useState<string[]>([]);
  const [priceValues, setPriceValues] = useState<string[]>([]);
  const [capacityValues, setCapacityValues] = useState<string[]>([]);
  const [capacityErrors, setCapacityErrors] = useState<string[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | string[]>(
    [],
  );
  const [serviceSchedules, setServiceSchedules] = useState<any>({});
  useEffect(() => {
    showLoading();
    apiGetPetCenterByPetCenterId(petCenterId as never).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setServicesRegisted(res?.data?.petCenterServices);
        setPriceValues(res?.data?.petCenterServices.map(() => ''));
        setPriceErrors(res?.data?.petCenterServices.map(() => ''));
        setCapacityValues(res?.data?.petCenterServices.map(() => '')); // Thêm sức chứa
        setCapacityErrors(res?.data?.petCenterServices.map(() => '')); // Thêm lỗi sức chứa
      }
    });
  }, []);

  useEffect(() => {
    apiGetPetSpecies().then((res: any) => {
      showLoading();
      if (res.statusCode === 200) {
        hideLoading();
        const items: SelectModel[] = [];
        res?.data?.items?.forEach((item: any) => {
          items.push({
            label: item?.name ? item?.name : 'Không xác định',
            value: item?.id,
          });
        });
        setSpecies(items);
      }
    });
  }, []);
  const handleDeleteTimeSlot = (serviceId: number, timeSlotId: string) => {
    setServiceSchedules((prevSchedules: any) => {
      const updatedSchedules = prevSchedules[serviceId]?.filter(
        (slot: any) => slot.id !== timeSlotId,
      );

      return {
        ...prevSchedules,
        [serviceId]: updatedSchedules, // Cập nhật lại danh sách cho serviceId cụ thể
      };
    });
  };
  const handleCapacityChange = (value: string, index: number) => {
    const newValues = [...capacityValues];
    const newErrors = [...capacityErrors];

    // Loại bỏ dấu chấm
    const rawValue = value.replace(/\./g, '');

    // Kiểm tra chỉ cho phép số và tối đa 3 chữ số
    if (/^\d{0,3}$/.test(rawValue)) {
      newValues[index] = rawValue; // Không cần format vì là số nhỏ
      newErrors[index] =
        rawValue.trim() === ''
          ? 'Sức chứa là bắt buộc'
          : rawValue.length > 3
          ? 'Tối đa 3 chữ số'
          : '';
    } else {
      newErrors[index] = 'Tối đa 3 chữ số';
    }

    setCapacityValues(newValues);
    setCapacityErrors(newErrors);
  };

  const validateAllCapacities = () => {
    const errors = capacityValues.map(value =>
      value.trim() === ''
        ? 'Sức chứa là bắt buộc'
        : value.length > 3
        ? 'Tối đa 3 chữ số'
        : '',
    );
    setCapacityErrors(errors);
    return errors.every(error => error === '');
  };

  const handlePriceChange = (value: string, index: number) => {
    const newValues = [...priceValues];
    const newErrors = [...priceErrors];

    // Loại bỏ dấu chấm
    const rawValue = value.replace(/\./g, '');

    // Kiểm tra chỉ cho phép số và tối đa 8 chữ số
    if (/^\d{0,8}$/.test(rawValue)) {
      const formattedValue = formatPrice(rawValue); // Format lại giá trị
      newValues[index] = formattedValue;
      newErrors[index] =
        rawValue.trim() === ''
          ? 'Giá là bắt buộc'
          : rawValue.length > 8
          ? 'Tối đa 8 chữ số'
          : '';
    } else {
      newErrors[index] = 'Tối đa 8 chữ số';
    }

    setPriceValues(newValues);
    setPriceErrors(newErrors);
  };

  // Hàm định dạng giá trị theo phần nghìn
  const formatPrice = (value: string): string => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const validateAllPrices = () => {
    const errors = priceValues.map(value =>
      value.trim() === ''
        ? 'Giá là bắt buộc'
        : value.replace(/\./g, '').length > 8
        ? 'Tối đa 8 chữ số'
        : '',
    );
    setPriceErrors(errors);
    return errors.every(error => error === '');
  };

  const getPetCenterServiceData = () => {
    return servicesRegisted.map((service: any, index: number) => ({
      id: service.petCenterServiceId,
      price: parseInt(priceValues[index].replace(/\./g, ''), 10) || 0,
      capacity: parseInt(capacityValues[index].replace(/\./g, ''), 10) || 0,
      schedule:
        serviceSchedules[service.petCenterServiceId]?.map((schedule: any) => ({
          time: schedule.time,
          description: schedule.description,
        })) || [], // Nếu không có lịch, trả về mảng rỗng
      type:
        service.name === 'Huấn luyện' || service.name === 'Trông thú' ? 1 : 0,
    }));
  };

  const formik = useFormik({
    initialValues: {
      description: '',
      hasImage: false,
      hasCamera: false,
      hasTransport: false,
      speciesId: [],
    },
    validationSchema: Yup.object().shape({
      description: Yup.string()
        .min(10, 'Mô tả phải có ít nhất 10 ký tự')
        .max(500, 'Mô tả không được vượt quá 500 ký tự')
        .required('Mô tả là bắt buộc'),
      hasImage: Yup.boolean()
        .oneOf([true, false], 'Hỗ trợ báo cáo bằng ảnh phải được chọn')
        .required('Bắt buộc phải chọn hỗ trợ báo cáo bằng ảnh'),
      hasCamera: Yup.boolean()
        .oneOf([true, false], 'Có Camera quan sát phải được chọn')
        .required('Bắt buộc phải chọn có Camera quan sát'),
      hasTransport: Yup.boolean()
        .oneOf(
          [true, false],
          'Có phương tiện di chuyển/nhận ship phải được chọn',
        )
        .required('Bắt buộc phải chọn phương tiện di chuyển/nhận ship'),
      speciesId: Yup.array()
        .min(1, 'Ít nhất phải chọn một loại vật nuôi')
        .required('Bắt buộc phải chọn ít nhất một loại vật nuôi'),
    }),
    onSubmit: val => {
      const allPricesValid = validateAllPrices();
      if (allPricesValid) {
        console.log('Form submitted successfully with:', val, priceValues);
      } else {
        console.log('Vui lòng điền giá cho tất cả các dịch vụ trước khi gửi.');
      }
    },
  });

  const handleSubmit = () => {
    formik.handleSubmit();
    const allPricesValid = validateAllPrices();
    const allCapacitiesValid = validateAllCapacities();
    const petCenterService = getPetCenterServiceData();

    if (
      allPricesValid &&
      allCapacitiesValid &&
      Object.keys(formik.errors).length === 0
    ) {
      showLoading();
      // console.log(JSON.stringify(petCenterService, null, 2));
      apiCreateJob(
        petCenterId as never,
        formik.values.description,
        formik.values.hasImage,
        formik.values.hasCamera,
        formik.values.hasTransport,
        selectedSpeciesId,
        petCenterService,
      ).then((res: any) => {
        console.log(res);
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Tạo công việc thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Tạo công việc thất bại',
            text2: `Xảy ra lỗi ${res.message}`,
          });
        }
      });
    } else {
      console.log('Có lỗi trong form, vui lòng kiểm tra lại');
    }
  };

  const handleScheduleReturn = (serviceId: number, scheduleData: any) => {
    setServiceSchedules((prevSchedules: any) => ({
      ...prevSchedules,
      [serviceId]: scheduleData,
    }));
  };
  const addScheduleHandle = (serviceId: number) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.SCHEDULESCREEN, {
      serviceId,
      scheduleData: serviceSchedules[serviceId] || [],
      onGoBack: (scheduleData: any) =>
        handleScheduleReturn(serviceId, scheduleData),
    });
  };

  const renderPriceItem = ({item, index}: any) => (
    <View style={styles.serviceCard}>
      <RowComponent justify="flex-start">
        <TextComponent text={item.name} type="title" color={colors.primary} />
        {item.name === 'Bác sĩ thú y' || item.name === 'Dịch vụ spa' ? (
          <TextComponent text="(lần)" color={colors.red} type="title" />
        ) : (
          <TextComponent text="(giờ)" color={colors.red} type="title" />
        )}
      </RowComponent>
      <RowComponent justify="space-between" styles={styles.inputRow}>
        <View style={styles.inputGroup}>
          <TextComponent text="Giá dịch vụ" />
          <TextInput
            placeholder="Nhập giá..."
            style={[
              styles.inputContainer,
              priceErrors[index] ? styles.errorInput : styles.defaultBorder,
            ]}
            keyboardType="numeric"
            value={priceValues[index]}
            onChangeText={value => handlePriceChange(value, index)}
            placeholderTextColor={colors.grey}
          />
          <View style={styles.errorContainer}>
            {priceErrors[index] ? (
              <Text style={globalStyles.errorText}>{priceErrors[index]}</Text>
            ) : (
              <Text style={styles.placeholderError}></Text>
            )}
          </View>
        </View>
        <View style={styles.inputGroup}>
          <TextComponent text="Sức chứa" />
          <TextInput
            placeholderTextColor={colors.grey}
            placeholder="Nhập sức chứa..."
            style={[
              styles.inputContainer,
              priceErrors[index] ? styles.errorInput : styles.defaultBorder,
            ]}
            keyboardType="numeric"
            value={capacityValues[index]}
            onChangeText={value => handleCapacityChange(value, index)}
          />
          <View style={styles.errorContainer}>
            {capacityErrors[index] ? (
              <Text style={globalStyles.errorText}>
                {capacityErrors[index]}
              </Text>
            ) : (
              <Text style={styles.placeholderError}></Text>
            )}
          </View>
        </View>
      </RowComponent>

      {(item.name === 'Trông thú' || item.name === 'Huấn luyện') && (
        <>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={() => addScheduleHandle(item.petCenterServiceId)}>
            <MaterialCommunityIcons
              name="calendar-plus"
              size={20}
              color={colors.white}
            />
            <TextComponent
              text="Thêm khung giờ"
              color={colors.white}
              styles={{marginLeft: 8}}
            />
          </TouchableOpacity>
          {serviceSchedules[item.petCenterServiceId]?.length > 0 && (
            <View style={styles.scheduleContainer}>
              {serviceSchedules[item.petCenterServiceId].map(
                (schedule: any, i: number) => (
                  <RowComponent
                    key={i}
                    justify="space-between"
                    styles={styles.scheduleItem}>
                    <TextComponent
                      text={`${schedule.time} - ${schedule.description}`}
                      color={colors.dark}
                    />
                    <IconButtonComponent
                      name="trash-can"
                      size={20}
                      color={colors.red}
                      onPress={() =>
                        handleDeleteTimeSlot(
                          item.petCenterServiceId,
                          schedule.id,
                        )
                      }
                    />
                  </RowComponent>
                ),
              )}
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <>
      <Container
        isScroll
        title="Tạo công việc"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          <TextComponent
            text="Lưu ý mọi thông tin bạn khai báo khi tạo công việc sẽ ảnh hưởng đến quá trình đánh giá dịch vụ của bạn"
            type="description"
            required
          />

          <TextComponent text="Mô tả công việc" type="title" required />
          <InputComponent
            onChange={formik.handleChange('description')}
            value={formik.values.description}
            onBlur={formik.handleBlur('description')}
            placeholder="Mô tả về trung tâm của bạn"
            multiline
            allowClear
            maxLength={500}
          />
          {formik.errors.description && formik.touched.description && (
            <Text style={globalStyles.errorText}>
              {formik.errors.description}
            </Text>
          )}
          <TextComponent text="Loại thú cưng" type="title" required />
          <DropdownPicker
            values={species}
            multible
            onSelect={(selectedScpecies: string | string[]) => {
              setSelectedSpeciesId(selectedScpecies);
              formik.setFieldValue('speciesId', selectedScpecies || null);
            }}
            placeholder="Chọn thú"
            formik={formik}
            validateField="speciesId"
          />
          {formik.errors.speciesId && formik.touched.speciesId && (
            <Text style={globalStyles.errorText}>
              {formik.errors.speciesId}
            </Text>
          )}
          <TextComponent text="Giá dịch vụ" type="title" />
          <FlatList
            scrollEnabled={false}
            data={servicesRegisted}
            renderItem={renderPriceItem}
            keyExtractor={(item: any) => item.petCenterServiceId.toString()}
          />
          <TextComponent text="Có hỗ trợ báo cáo bằng ảnh?" type="title" />
          <RowComponent justify="space-between" styles={styles.checkboxRow}>
            <TouchableOpacity
              onPress={() => formik.setFieldValue('hasImage', true)}
              style={[
                styles.checkboxContainer,
                formik.values.hasImage === true && styles.selected,
              ]}>
              <TextComponent text="Có" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => formik.setFieldValue('hasImage', false)}
              style={[
                styles.checkboxContainer,
                formik.values.hasImage === false && styles.selected,
              ]}>
              <TextComponent text="Không" size={16} />
            </TouchableOpacity>
          </RowComponent>
          {formik.errors.hasImage && formik.touched.hasImage && (
            <Text style={globalStyles.errorText}>{formik.errors.hasImage}</Text>
          )}

          <TextComponent text="Có camera quan sát?" type="title" />
          <RowComponent justify="space-between" styles={styles.checkboxRow}>
            <TouchableOpacity
              onPress={() => formik.setFieldValue('hasCamera', true)}
              style={[
                styles.checkboxContainer,
                formik.values.hasCamera === true && styles.selected,
              ]}>
              <TextComponent text="Có" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => formik.setFieldValue('hasCamera', false)}
              style={[
                styles.checkboxContainer,
                formik.values.hasCamera === false && styles.selected,
              ]}>
              <TextComponent text="Không" size={16} />
            </TouchableOpacity>
          </RowComponent>
          {formik.errors.hasCamera && formik.touched.hasCamera && (
            <Text style={globalStyles.errorText}>
              {formik.errors.hasCamera}
            </Text>
          )}

          <TextComponent
            text="Có phương tiện di chuyển/nhận ship?"
            type="title"
          />
          <RowComponent justify="space-between" styles={styles.checkboxRow}>
            <TouchableOpacity
              onPress={() => formik.setFieldValue('hasTransport', true)}
              style={[
                styles.checkboxContainer,
                formik.values.hasTransport === true && styles.selected,
              ]}>
              <TextComponent text="Có" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => formik.setFieldValue('hasTransport', false)}
              style={[
                styles.checkboxContainer,
                formik.values.hasTransport === false && styles.selected,
              ]}>
              <TextComponent text="Không" size={16} />
            </TouchableOpacity>
          </RowComponent>
          {formik.errors.hasTransport && formik.touched.hasTransport && (
            <Text style={globalStyles.errorText}>
              {formik.errors.hasTransport}
            </Text>
          )}
        </SectionComponent>
      </Container>
      <ButtonComponent
        text="Tạo"
        type="primary"
        styles={{marginVertical: 12}}
        onPress={handleSubmit}
      />
    </>
  );
};

export default CreateJobScreen;

const styles = StyleSheet.create({
  inputContainer: {
    height: 36,
    paddingHorizontal: 12,
    marginVertical: 3,
    backgroundColor: colors.white,
    borderRadius: 8,
    color: colors.dark,
    borderColor: colors.grey4,
  },
  checkboxRow: {
    alignItems: 'center',
    marginVertical: 14,
  },
  checkboxContainer: {
    width: '45%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.grey,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selected: {
    backgroundColor: colors.secondary,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  errorInput: {
    borderColor: colors.red,
    borderWidth: 1,
  },
  defaultBorder: {
    borderColor: colors.grey4,
    borderWidth: 1, // Viền mặc định khi không có lỗi
  },

  timeSlotRow: {
    marginBottom: 8,
    alignItems: 'center',
  },
  serviceCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    marginTop: 12,
  },
  inputGroup: {
    width: '48%',
  },
  scheduleButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scheduleContainer: {
    marginTop: 16,

    borderRadius: 8,
    padding: 8,
  },
  scheduleItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  errorContainer: {
    minHeight: 20, // Chiều cao cố định để giữ khoảng cách
    justifyContent: 'center', // Căn giữa nếu có lỗi
  },
  placeholderError: {
    color: 'transparent', // Dùng để giữ vị trí nhưng không hiển thị
  },
});
