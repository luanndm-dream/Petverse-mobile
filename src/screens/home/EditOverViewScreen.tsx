import React, {useCallback, useState, useEffect} from 'react';
import {StyleSheet, View, Switch, TouchableOpacity} from 'react-native';
import {
  ButtonComponent,
  Container,
  DropdownPicker,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from '@/redux';
import {apiGetJobByPetCenterId, apiUpdateJob} from '@/api/apiJob';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Keyboard} from 'react-native';
import {SelectModel} from '@/models/SelectModel';
import useLoading from '@/hook/useLoading';
import {apiGetPetSpecies} from '@/api/apiPet';
import Toast from 'react-native-toast-message';

const EditOverViewScreen = () => {
  const {goBack} = useCustomNavigation();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [jobData, setJobData] = useState<any>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [spicies, setSpicies] = useState<SelectModel[]>([]);
  const {showLoading, hideLoading} = useLoading();

  useEffect(() => {
    showLoading();
    apiGetPetSpecies().then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        const items: SelectModel[] = [];
        res?.data?.items.forEach((item: any) => {
          items.push({
            label: item.name,
            value: item.id,
          });
        });
        setSpicies(items);
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      apiGetJobByPetCenterId(petCenterId as never).then((res: any) => {
        //console.log(res);
        if (res.statusCode === 200) {
          setJobData(res.data);
        } else {
          console.log('Lấy dữ liệu job của center thất bại');
        }
      });
    }, [petCenterId]),
  );

  const formik = useFormik({
    initialValues: {
      description: '',
      haveCamera: false,
      havePhoto: false,
      haveTransport: false,
      speciesId: undefined,
    },
    validationSchema: Yup.object().shape({
      description: Yup.string().required('Mô tả không được để trống'),
      speciesId: Yup.array()
        .min(1, 'Vui lòng chọn ít nhất một loài thú cưng') // Ít nhất 1 giá trị
        .required('Loài thú cưng là bắt buộc'),
    }),
    enableReinitialize: true,
    onSubmit: values => {
        console.log(values)
      showLoading();
      apiUpdateJob(
        jobData.id,
        values.description,
        values.havePhoto,
        values.haveCamera,
        values.haveTransport,
        values.speciesId,
      ).then((res: any) => {
        if(res.statusCode === 200){
            hideLoading();
        Toast.show({
          type: 'success',
          text1: 'Chỉnh sửa thành công',
          text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
        });
        goBack();
      } else {
        hideLoading();
        Toast.show({
          type: 'error',
          text1: 'Chỉnh sửa thất bại',
          text2: `Xảy ra lỗi khi chỉnh sửa ${res.message}`,
        });
        }
      });
    },
  });

  useEffect(() => {
    if (jobData) {
      const selectedSpecies =
        jobData.speciesJobs?.map((item: any) => item.id) || [];
      formik.setValues({
        description: jobData.description || '',
        haveCamera: jobData.haveCamera || false,
        havePhoto: jobData.havePhoto || false,
        haveTransport: jobData.haveTransport || false,
        speciesId: selectedSpecies,
      });
    }
  }, [jobData]);
  useEffect(() => {
    if (jobData) {
      const hasChanged =
        JSON.stringify(formik.values) !==
        JSON.stringify({
          description: jobData.description || '',
          haveCamera: jobData.haveCamera || false,
          havePhoto: jobData.havePhoto || false,
          haveTransport: jobData.haveTransport || false,
          speciesId: jobData.speciesJobs?.map((item: any) => item.id) || [],
        });
      setIsChanged(hasChanged);
    }
  }, [formik.values, jobData]);

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
    setIsChanged(true);
  };

  const ToggleOption = ({
    label,
    value,
    onValueChange,
    icon,
  }: {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    icon: string;
  }) => (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleLabelContainer}>
        <Icon
          name={icon}
          size={24}
          color={colors.primary}
          style={styles.toggleIcon}
        />
        <TextComponent text={label} styles={styles.toggleLabel} />
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.grey,
          true: colors.primary,
        }}
        thumbColor={value ? colors.white : colors.grey}
      />
    </View>
  );

  return (
    <>
      <Container
        title="Tổng quan trung tâm"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          <View
            style={styles.cardContainer}
            onTouchStart={() => Keyboard.dismiss()}>
            <TextComponent text="Mô tả trung tâm" type="title" />
            <InputComponent
              value={formik.values.description}
              onChange={text => handleInputChange('description', text)}
              placeholder="Nhập mô tả về trung tâm của bạn"
              multiline
              allowClear
            />
            {formik.errors.description && (
              <TextComponent
                text={formik.errors.description}
                color={colors.red}
                styles={styles.errorText}
              />
            )}

            <View style={styles.divider} />
            <TextComponent text="Loài thú cưng" type="title" />
            <DropdownPicker
              values={spicies}
              selected={formik.values.speciesId}
              multible
              onSelect={(selectedSpecies: string | string[]) => {
                console.log('Selected Species:', selectedSpecies);
                formik.setFieldValue('speciesId', selectedSpecies || null); 
                // setIsChanged(true);
              }}
              placeholder="Chọn giống"
            />
            {formik.errors.speciesId && formik.touched.speciesId && (
              <TextComponent
                text={formik.errors.speciesId}
                color={colors.red}
                styles={styles.errorText}
              />
            )}
            <View style={styles.divider} />
            <TextComponent text="Dịch vụ hỗ trợ" type="title" />
            <ToggleOption
              label="Hỗ trợ camera"
              value={formik.values.haveCamera}
              onValueChange={value => handleInputChange('haveCamera', value)}
              icon="camera-outline"
            />

            <ToggleOption
              label="Hỗ trợ chụp ảnh"
              value={formik.values.havePhoto}
              onValueChange={value => handleInputChange('havePhoto', value)}
              icon="image-outline"
            />

            <ToggleOption
              label="Hỗ trợ vận chuyển"
              value={formik.values.haveTransport}
              onValueChange={value => handleInputChange('haveTransport', value)}
              icon="truck-outline"
            />
          </View>
        </SectionComponent>
      </Container>

      <ButtonComponent
        text="Chỉnh sửa"
        type="primary"
        disable={!isChanged}
        onPress={formik.handleSubmit}
        //   style={styles.submitButton}
      />
    </>
  );
};

export default EditOverViewScreen;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: colors.grey,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    marginBottom: 12,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey4,
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 16,
  },
  submitButton: {
    borderRadius: 12,
  },
});
