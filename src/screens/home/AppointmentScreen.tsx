import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import {
  ButtonComponent,
  Container,
  DatePicker,
  IconButtonComponent,
  PopupComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
  TimePicker,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useAppSelector} from '@/redux';
import {globalStyles} from '@/styles/globalStyles';
import {
  AddSquare,
  ArrowDown2,
  ArrowSwapVertical,
  CloseCircle,
  Pet,
  Trash,
} from 'iconsax-react-native';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {apiGetPetByUserId} from '@/api/apiPet';
import useLoading from '@/hook/useLoading';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {ageFormatter} from '@/utils/AgeFormatter';
import {useFormik} from 'formik';
import {
  apiCreateBreedAppointment,
  apiCreateServiceAppointment,
} from '@/api/apiAppoinment';
import firestore from '@react-native-firebase/firestore';
import { addAppointmentInBreedingToFirestore } from '@/services/firestoreFunction';

const AppointmentScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const {petCenterServiceId, petCenterServiceName, type, price} = route.params;
  const {goBack, navigate} = useCustomNavigation();
  const userId = useAppSelector(state => state.auth.userId);
  const [isVisibleFromModal, setIsVisibleFromModal] = useState(false);
  const [isVisibleToModal, setIsVisibleToModal] = useState(false);
  const [isVisibleFromTimeModal, setIsVisibleFromTimeModal] = useState(false);
  const [isVisibleToTimeModal, setIsVisibleToTimeModal] = useState(false);
  const [petModal, setPetModal] = useState(false);
  const [myPet, setMyPet] = useState<any>();
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(price);
  const [scheduleData, setScheduleData] = useState([]);
  const modalPetRef = useRef<Modalize>();
  const historyBreed = useAppSelector(state => state.breedHistory.items);
  const [isPopup, setIsPopup] = useState(false);
  const [isAgree, setIsAgree] = useState(false);

  useEffect(() => {
    if (selectedPet) {
      const isMatched = historyBreed.some(
        (history: any) =>
          history.centerBreedId === petCenterServiceId &&
          history.petId === selectedPet.id,
      );

      if (isMatched) {
        setIsPopup(true);
      } else {
        setIsPopup(false);
        setIsAgree(false);
      }
    }
  }, [selectedPet, petCenterServiceId, historyBreed]);

  const handleScheduleData = (timeSlots: any) => {
    setScheduleData(timeSlots);
  };

  const handleDeleteSchedule = (index: number) => {
    const newScheduleData = [...scheduleData];
    newScheduleData.splice(index, 1);
    setScheduleData(newScheduleData);
  };

  useFocusEffect(
    useCallback(() => {
      apiGetPetByUserId(userId).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          setMyPet(res.data.items);
        } else {
          hideLoading();
          console.log('load my pet fail', res);
        }
      });
    }, [userId]),
  );

  const handleToDateConfirm = (date: any) => {
    const fromDate = moment(formik.values.fromDate, 'DD/MM/YYYY');
    const selectedToDate = moment(date, 'DD/MM/YYYY');

    if (fromDate.isAfter(selectedToDate)) {
      alert('Đến ngày phải lớn hơn hoặc bằng Từ ngày.');
    } else {
      formik.setFieldValue('toDate', date);
      setIsVisibleToModal(false);
    }
  };
  const handleToTimeConfirm = (time: any) => {
    const fromDateTime = moment(
      `${formik.values.fromDate} ${formik.values.fromTime}`,
      'DD/MM/YYYY HH:mm',
    );
    const toDateTime = moment(
      `${formik.values.toDate} ${time}`,
      'DD/MM/YYYY HH:mm',
    );

    // Kiểm tra cùng ngày và thời gian
    if (
      formik.values.fromDate === formik.values.toDate &&
      toDateTime.isBefore(fromDateTime)
    ) {
      alert('Đến giờ phải lớn hơn Từ giờ nếu là cùng một ngày.');
    } else {
      formik.setFieldValue('toTime', time);
      setIsVisibleToTimeModal(false);
    }
  };

  
  const validationSchema = Yup.object().shape({
    petId: Yup.string().required('Vui lòng chọn thú cưng'),
    fromDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
    fromTime: Yup.string().required('Chọn giờ'),
    toDate: Yup.lazy(value =>
      type === 1
        ? Yup.string().required('Vui lòng chọn ngày kết thúc')
        : Yup.string().notRequired(),
    ),
    toTime: Yup.lazy(value =>
      type === 1
        ? Yup.string().required('Chọn giờ')
        : Yup.string().notRequired(),
    ),
  });

  const formik = useFormik({
    initialValues: {
      petId: '',
      fromDate: '',
      fromTime: '',
      toDate: '',
      toTime: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      let startTime = '';
      let endTime = '';

      if (values.fromDate && values.fromTime) {
        switch (type) {
          case 0:
            // Cố ý gán startTime và endTime bằng nhau
            startTime = `${values.fromDate} ${values.fromTime}`;
            endTime = `${values.fromDate} ${values.fromTime}`;
            break;
          case 1:
            startTime = `${values.fromDate} ${values.fromTime}`;
            endTime = `${values.toDate} ${values.toTime}`;
            break;
        }
      }
      const formattedScheduleData = scheduleData.map(({time, description}) => ({
        time,
        description,
      }));
      showLoading();
      console.log(petCenterServiceName);
      if (petCenterServiceName.includes('phối')) {
        apiCreateBreedAppointment(
          userId,
          petCenterServiceId,
          selectedPet.id,
          price,
          startTime,
          endTime,
        ).then((res: any) => {
          if (res.statusCode === 200) {
            if (isAgree) {
              addAppointmentInBreedingToFirestore(
                res.data.id,
                res.data.userId,
                res.data.petId,
              );
            }
            hideLoading();
            Toast.show({
              type: 'success',
              text1: 'Đặt lịch phối giống thành công',
              text2: 'Petverse chúc bạn và thú cưng thật nhiều sức khoẻ!',
            });
            navigate(STACK_NAVIGATOR_SCREENS.HOMESCREEN);
          } else {
            hideLoading();
            Toast.show({
              type: 'error',
              text1: 'Đặt lịch phối giống thất bại',
              text2: `Xảy ra lỗi ${res.message}`,
            });
          }
        });
      } else {
        apiCreateServiceAppointment(
          userId,
          selectedPet.id,
          petCenterServiceId,
          calculatedPrice,
          startTime,
          endTime,
          formattedScheduleData,
        ).then((res: any) => {
          if (res.statusCode === 200) {
            hideLoading();
            Toast.show({
              type: 'success',
              text1: 'Đặt lịch dịch vụ thành công',
              text2: 'Petverse chúc bạn và thú cưng thật nhiều sức khoẻ!',
            });
            navigate(STACK_NAVIGATOR_SCREENS.HOMESCREEN);
          } else {
            hideLoading();
            Toast.show({
              type: 'error',
              text1: 'Đặt lịch thất bại',
              text2: `Xảy ra lỗi ${res.message}`,
            });
          }
        });
      }
    },
  });
  useEffect(() => {
    if (petModal && modalPetRef) {
      modalPetRef.current?.open();
    } else {
      modalPetRef.current?.close();
    }
  }, [petModal]);

  useEffect(() => {
    const updatePrice = () => {
      if (
        type === 1 &&
        formik.values.fromDate &&
        formik.values.toDate &&
        formik.values.fromTime &&
        formik.values.toTime
      ) {
        const fromDateTime = moment(
          `${formik.values.fromDate} ${formik.values.fromTime}`,
          'DD/MM/YYYY HH:mm',
        );
        const toDateTime = moment(
          `${formik.values.toDate} ${formik.values.toTime}`,
          'DD/MM/YYYY HH:mm',
        );
        const totalHours = toDateTime.diff(fromDateTime, 'hours');
        setCalculatedPrice(totalHours * price);
      } else {
        setCalculatedPrice(price);
      }
    };
    updatePrice();
  }, [
    formik.values.fromDate,
    formik.values.toDate,
    formik.values.fromTime,
    formik.values.toTime,
    type,
    price,
  ]);

  const formattedPrice = new Intl.NumberFormat('vi-VN').format(calculatedPrice);

  useFocusEffect(
    useCallback(() => {
      apiGetPetByUserId(userId).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          setMyPet(res.data.items);
        } else {
          hideLoading();
          console.log('load my pet fail', res);
        }
      });
    }, [userId]),
  );

  return (
    <>
      <Container
        title={`Đặt lịch ${petCenterServiceName}`}
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        {isAgree && (
          <View style={styles.warningContainer}>
            <RowComponent justify="space-between">
              <TextComponent
                text="Lưu ý: Bạn đã đồng ý đặt lịch phối giống với thú cưng có thể dẫn đến cận huyết."
                styles={styles.warningText}
              />
            </RowComponent>
          </View>
        )}
        <SectionComponent>
          <RowComponent justify="space-between">
            <TextComponent text="Dịch vụ" type="title" />
            <TextComponent
              text={petCenterServiceName}
              styles={{
                paddingHorizontal: 24,
                backgroundColor: colors.white,
                borderRadius: 6,
                paddingVertical: 8,
                fontWeight: 'bold',
              }}
            />
          </RowComponent>

          <TextComponent text="Chọn thú cưng" type="title" />
          {selectedPet ? (
            <TouchableOpacity
              style={styles.selectedPetContainer}
              onPress={() => setPetModal(true)}>
              <Image
                source={{uri: selectedPet.avatar}}
                style={styles.selectedPetImage}
                defaultSource={require('../../assets/images/DefaultPetAvatar.jpg')}
              />
              <View style={styles.overlayContainer}>
                <TextComponent
                  text={selectedPet.name}
                  styles={styles.petNameOverlay}
                />
              </View>
              <TouchableOpacity
                style={styles.removePetButton}
                onPress={() => {
                  setSelectedPet(null);
                  formik.setFieldValue('petId', '');
                }}>
                <CloseCircle size={20} color={colors.red} variant="Bold" />
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setPetModal(true)}>
              <Pet size={32} color={colors.primary} variant="Bulk" />
              <TextComponent
                text="Chọn thú cưng"
                styles={{
                  fontSize: 12,
                  color: colors.primary,
                  marginTop: 4,
                }}
              />
            </TouchableOpacity>
          )}
          {formik.errors.petId && formik.touched.petId && (
            <TextComponent
              text={formik.errors.petId}
              styles={{color: colors.red}}
            />
          )}

          <TextComponent text="Từ ngày" type="title" />
          <RowComponent justify="space-between">
            <View style={{flexDirection: 'column', width: '70%'}}>
              <RowComponent
                styles={[
                  globalStyles.inputContainer,
                  {justifyContent: 'space-between'},
                ]}
                onPress={() => setIsVisibleFromModal(true)}>
                <TextComponent
                  text={formik.values.fromDate || 'Chọn ngày bắt đầu'}
                />
                <ArrowDown2 size={22} color={colors.grey} />
              </RowComponent>
              {formik.errors.fromDate && formik.touched.fromDate && (
                <TextComponent
                  text={formik.errors.fromDate}
                  styles={{color: colors.red}}
                />
              )}
            </View>

            <View style={{flexDirection: 'column', width: '30%'}}>
              <RowComponent
                styles={[
                  globalStyles.inputContainer,
                  {justifyContent: 'space-between'},
                ]}
                onPress={() => setIsVisibleFromTimeModal(true)}>
                <TextComponent text={formik.values.fromTime || 'Thời gian'} />
                <ArrowDown2 size={22} color={colors.grey} />
              </RowComponent>
              {formik.errors.fromTime && formik.touched.fromTime && (
                <TextComponent
                  text={formik.errors.fromTime}
                  styles={{color: colors.red}}
                />
              )}
            </View>
          </RowComponent>

          {type === 1 && (
            <>
              <ArrowSwapVertical
                size={30}
                color={colors.primary}
                variant="TwoTone"
                style={{alignSelf: 'center'}}
              />
              <TextComponent text="Đến ngày" type="title" />
              <RowComponent justify="space-between">
                <View style={{flexDirection: 'column', width: '70%'}}>
                  <RowComponent
                    styles={[
                      globalStyles.inputContainer,
                      {justifyContent: 'space-between'},
                    ]}
                    onPress={() => setIsVisibleToModal(true)}>
                    <TextComponent
                      text={formik.values.toDate || 'Chọn ngày kết thúc'}
                    />
                    <ArrowDown2 size={22} color={colors.grey} />
                  </RowComponent>
                  {formik.errors.toDate && formik.touched.toDate && (
                    <TextComponent
                      text={formik.errors.toDate}
                      styles={{color: colors.red}}
                    />
                  )}
                </View>

                <View style={{flexDirection: 'column', width: '30%'}}>
                  <RowComponent
                    styles={[
                      globalStyles.inputContainer,
                      {justifyContent: 'space-between'},
                    ]}
                    onPress={() => setIsVisibleToTimeModal(true)}>
                    <TextComponent text={formik.values.toTime || 'Thời gian'} />
                    <ArrowDown2 size={22} color={colors.grey} />
                  </RowComponent>
                  {formik.errors.toTime && formik.touched.toTime && (
                    <TextComponent
                      text={formik.errors.toTime}
                      styles={{color: colors.red}}
                    />
                  )}
                </View>
              </RowComponent>
              <RowComponent justify="flex-start">
                <TextComponent text="Tạo lịch theo dõi?" type="title" />
                <IconButtonComponent
                  name="plus-circle"
                  color={colors.primary}
                  onPress={() =>
                    navigation.navigate(
                      STACK_NAVIGATOR_SCREENS.SCHEDULESCREEN,
                      {
                        onGoBack: handleScheduleData,
                        scheduleData,
                      },
                    )
                  }
                />
              </RowComponent>
              {scheduleData.length > 0 && (
                <View>
                  {scheduleData.map((item: any, index) => (
                    <View key={index} style={styles.scheduleItem}>
                      <TextComponent
                        text={`${item.time} - ${item.description}`}
                      />
                      <TouchableOpacity
                        onPress={() => handleDeleteSchedule(index)}
                        style={styles.deleteButton}>
                        <Trash size={20} color={colors.red} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </SectionComponent>
        <View style={{flex: 1}} />
        <RowComponent
          justify="flex-end"
          styles={{marginRight: 24, marginBottom: 6}}>
          <TextComponent text="Giá tiền: " />
          <TextComponent text={`${formattedPrice} VNĐ`} type="title" />
        </RowComponent>
        <ButtonComponent
          text="Đặt lịch"
          type="primary"
          disable={!formik.isValid || !formik.dirty}
          onPress={formik.handleSubmit}
        />
      </Container>

      <Portal>
        <Modalize
          ref={modalPetRef}
          adjustToContentHeight
          onClose={() => setPetModal(false)}
          modalStyle={styles.modalContainer}
          HeaderComponent={
            <RowComponent styles={styles.header}>
              <TextComponent text="Chọn thú cưng" styles={styles.headerTitle} />
              <View style={styles.addButton}>
                <AddSquare
                  size={30}
                  color={colors.primary}
                  onPress={() => {
                    navigate(STACK_NAVIGATOR_SCREENS.ADDPETSCREEN);
                    setPetModal(false);
                  }}
                />
              </View>
            </RowComponent>
          }>
          {myPet ? (
            <ScrollView style={styles.scrollContainer}>
              {myPet.map((pet: any) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCard}
                  onPress={() => {
                    setSelectedPet(pet);
                    formik.setFieldValue('petId', pet.id);
                    setPetModal(false);
                  }}>
                  <Image
                    source={{uri: pet.avatar}}
                    style={styles.petImage}
                    defaultSource={require('../../assets/images/DefaultPetAvatar.jpg')}
                  />
                  <View style={styles.petInfoContainer}>
                    <TextComponent text={pet.name} styles={styles.petName} />
                    <View style={styles.petDetailsRow}>
                      <TextComponent
                        text={`${pet.gender === 2 ? '♀️' : '♂️'} • ${
                          pet.weight
                        }kg`}
                        styles={styles.petDetails}
                      />
                      <TextComponent
                        text={ageFormatter(pet.birthDate)}
                        styles={styles.petAge}
                      />
                    </View>
                    {pet.sterilized ? (
                      <View style={styles.sterilizedBadge}>
                        <TextComponent
                          text="Đã triệt sản"
                          styles={styles.sterilizedText}
                        />
                      </View>
                    ) : (
                      <View style={styles.notSterilizedBadge}>
                        <TextComponent
                          text="Chưa triệt sản"
                          styles={styles.notSterilizedText}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <TextComponent
                text="Bạn chưa có thú cưng nào, vui lòng thêm thú cưng"
                styles={styles.emptyText}
              />
              <ButtonComponent
                text="Thêm thú cưng"
                type="link"
                onPress={() => {
                  navigate(STACK_NAVIGATOR_SCREENS.ADDPETSCREEN);
                  setPetModal(false);
                }}
              />
            </View>
          )}
        </Modalize>
      </Portal>

      <DatePicker
        isVisible={isVisibleFromModal}
        onCancel={() => setIsVisibleFromModal(false)}
        onConfirm={date => {
          formik.setFieldValue('fromDate', date);
          setIsVisibleFromModal(false);
        }}
      />

      <DatePicker
        isVisible={isVisibleToModal}
        onCancel={() => setIsVisibleToModal(false)}
        onConfirm={handleToDateConfirm}
      />

      <TimePicker
        isVisible={isVisibleFromTimeModal}
        onCancel={() => setIsVisibleFromTimeModal(false)}
        onConfirm={time => {
          formik.setFieldValue('fromTime', time);
          setIsVisibleFromTimeModal(false);
        }}
      />

      <TimePicker
        isVisible={isVisibleToTimeModal}
        onCancel={() => setIsVisibleToTimeModal(false)}
        onConfirm={handleToTimeConfirm}
      />
      <PopupComponent
        description="Có thể dẫn đến cận huyết, do thú cưng và giống đã từng phối với nhau."
        iconColor={colors.yellow}
        iconName="alert-circle"
        isVisible={isPopup}
        leftTitle="Huỷ"
        onClose={() => setIsPopup(false)}
        onLeftPress={() => setIsPopup(false)}
        title="Cảnh báo cận huyết"
        onRightPress={() => {
          setIsPopup(false);
          setIsAgree(true);
        }}
        rightTitle="Vẫn đặt lịch"
        buttonLeftColor={colors.grey}
        buttonRightColor={colors.red}
      />
    </>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({
  pickerContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey,
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  selectedPetContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
  selectedPetImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePetButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 2,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  petNameOverlay: {
    color: colors.white,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalContainer: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    right: 10,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  petCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  petInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  petDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sterilizedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  sterilizedText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  notSterilizedBadge: {
    backgroundColor: colors.grey4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  notSterilizedText: {
    fontSize: 12,
    color: colors.dark,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginBottom: 12,
    textAlign: 'center',
    color: '#666666',
  },
  petDetails: {
    fontSize: 14,
    color: '#666666',
    marginRight: 12,
  },
  petAge: {
    fontSize: 14,
    color: '#666666',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 4,
  },
  deleteButton: {
    padding: 4,
  },
  warningContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFA39E',
    marginVertical: 8,
  },
  warningText: {
    color: '#D4380D',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
});
