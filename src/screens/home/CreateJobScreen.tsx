import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { useAppSelector } from '@/redux';
import { apiGetPetCenterByPetCenterId } from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { globalStyles } from '@/styles/globalStyles';
import { apiGetPetSpecies } from '@/api/apiPet';
import { SelectModel } from '@/models/SelectModel';
import { apiCreateJob } from '@/api/apiJob';
import Toast from 'react-native-toast-message';

const CreateJobScreen = () => {
  const { navigate, goBack } = useCustomNavigation();
  const { showLoading, hideLoading } = useLoading();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [servicesRegisted, setServicesRegisted] = useState([]);
  const [species, setSpecies] = useState<SelectModel[]>([]);
  const [priceErrors, setPriceErrors] = useState<string[]>([]);
  const [priceValues, setPriceValues] = useState<string[]>([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string| string[]>([])
  useEffect(() => {
    showLoading();
    apiGetPetCenterByPetCenterId(petCenterId as never).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setServicesRegisted(res?.data?.petCenterServices);
        setPriceValues(res?.data?.petCenterServices.map(() => ''));
        setPriceErrors(res?.data?.petCenterServices.map(() => ''));
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

  const handlePriceChange = (value: string, index: number) => {
    const newValues = [...priceValues];
    const newErrors = [...priceErrors];

    // Giới hạn số lượng ký tự tối đa là 10 và chỉ cho phép nhập số
    if (/^\d{0,10}$/.test(value)) {
      newValues[index] = value;
      newErrors[index] = value.trim() === '' 
        ? 'Giá là bắt buộc' 
        : (value.length > 10 ? 'Giá là bắt buộc' : '');
    } else {
      newErrors[index] = 'Tối đa 10 chữ số';
    }

    setPriceValues(newValues);
    setPriceErrors(newErrors);
  };

  const validateAllPrices = () => {
    const errors = priceValues.map(value => 
      value.trim() === '' 
      ? 'Giá là bắt buộc' 
      : (value.length > 10 ? 'Bắt buộc & tối đa 10 chữ số' : '')
    );
    setPriceErrors(errors);
    return errors.every(error => error === '');
  };

  const getPetCenterServiceData = () => {
    return servicesRegisted.map((service: any, index: number) => ({
      id: service.petCenterServiceId,
      price: parseInt(priceValues[index], 10) || 0,
      type: service.name === 'Huấn luyện' || service.name === 'Trông thú' ? 1 : 0,
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
        .oneOf([true, false], 'Có phương tiện di chuyển/nhận ship phải được chọn')
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
    const petCenterService = getPetCenterServiceData();
  
    if (allPricesValid && Object.keys(formik.errors).length === 0) {
      apiCreateJob(petCenterId as never,
        formik.values.description,
        formik.values.hasImage,
        formik.values.hasCamera,
        formik.values.hasTransport,
        selectedSpeciesId,
        petCenterService
        ).then((res: any)=>{
          console.log(res)
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
        })
    } else {
      console.log('Có lỗi trong form, vui lòng kiểm tra lại');
    }
  };

  const renderPriceItem = ({ item, index }: any) => (
    <View style={styles.priceItem}>
      <RowComponent>
      <TextComponent text={item.name} color={colors.dark} />
      {item.name === 'Bác sĩ thú y' && <TextComponent text='/trường hợp' type='title'/>}
      </RowComponent>
      <View>
        <RowComponent>
      <TextInput
        placeholder="Nhập giá..."
        style={[styles.inputContainer, priceErrors[index] ? styles.errorInput : null]}
        keyboardType="numeric"
        value={priceValues[index]}
        onChangeText={value => handlePriceChange(value, index)}
      />
      <TextComponent text=' VND' type='title'/>
      </RowComponent>
      {priceErrors[index] && (
        <Text style={globalStyles.errorText}>{priceErrors[index]}</Text>
      )}
      </View>
      
    </View>
  );

  return (
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

        <TextComponent text="Mô tả trung tâm" type="title" />
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
        <DropdownPicker
          values={species}
          multible
          onSelect={(selectedScpecies: string | string[]) => {
            setSelectedSpeciesId(selectedScpecies)
            formik.setFieldValue('speciesId', selectedScpecies);
          }}
          placeholder="Chọn thú"
        />
        {formik.errors.speciesId && formik.touched.speciesId && (
          <Text style={globalStyles.errorText}>{formik.errors.speciesId}</Text>
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

        <TextComponent text="Có Camera quan sát?" type="title" />
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
          <Text style={globalStyles.errorText}>{formik.errors.hasCamera}</Text>
        )}

        <TextComponent text="Có phương tiện di chuyển/nhận ship?" type="title" />
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
      <ButtonComponent
        text="Tạo"
        type="primary"
        styles={{ marginVertical: 12 }}
        onPress={handleSubmit}
      />
    </Container>
  );
};

export default CreateJobScreen;

const styles = StyleSheet.create({
  inputContainer: {
    height: 36,
    paddingHorizontal: 24,
    marginVertical: 3,
    backgroundColor: colors.white,
    borderRadius: 8,
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
});