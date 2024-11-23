import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  ButtonComponent,
  RowComponent,
  PopupComponent,
  InputComponent,
  TextComponent,
} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {
  apiGetAppointmentByAppointmentId,
  apiGetUserBreedAppointmentHistory,
  apiUpdateAppointmentByAppointmentId,
} from '@/api/apiAppoinment';
import {useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';
import firestore from '@react-native-firebase/firestore';

const MyAppointmentDetailScreen = () => {
  const userId = useAppSelector(state => state.auth.userId);
  const route = useRoute<any>();
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const {appointmentId, appointmentType, petCenterId} = route.params;
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const roleName = useAppSelector(state => state.auth.roleName);
  const [isVisible, setIsVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [popupAction, setPopupAction] = useState<string | null>(null);
  const [inBreedingIds, setInbreedingIds] = useState<string[]>([]);
  const [isInBreeding, setIsInBreeding] = useState(false);
  const fetchDocumentIds = async () => {
    try {
      const snapshot = await firestore().collection('inbreeding').get();
      const documentIds = snapshot.docs.map(doc => doc.id); // Lấy tất cả ID của document
      console.log('Document IDs:', documentIds);
      return documentIds;
    } catch (error) {
      console.error('Error fetching document IDs:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadDocumentIds = async () => {
      const ids = await fetchDocumentIds();
      setInbreedingIds(ids);
    };

    loadDocumentIds();
  }, []);

  useEffect(() => {
    const checkAppointmentIdInDocumentIds = () => {
      if (inBreedingIds.includes(appointmentId)) {
        setIsInBreeding(true);
      } else {
        setIsInBreeding(false);
      }
    };

    if (inBreedingIds.length > 0) {
      checkAppointmentIdInDocumentIds();
    }
  }, [inBreedingIds, appointmentId]);

  const getPopupContent = (action: string) => {
    switch (action) {
      case 'warning':
        return {
          title: 'Cảnh báo cận huyết',
          description:
            'Lịch hẹn này có thể dẫn đến cận huyết vì thú cưng đã từng phối giống với loại giống này trước đây. Bạn có chắc chắn muốn tiếp tục?',
          iconName: 'alert-circle',
          iconColor: colors.yellow,
          hasInput: false,
          leftTitle: 'Huỷ',
          rightTitle: 'Xác nhận',
          buttonLeftColor: colors.grey,
          buttonRightColor: colors.red,
          onLeftPress: () => setIsVisible(false),
          onRightPress: () => {
            setIsVisible(false);
            processAcceptAppointment();
          },
        };
      case 'report':
        return {
          title: 'Báo cáo',
          description: 'Bạn muốn báo cáo về dịch vụ này?',
          iconName: 'alert-octagon',
          iconColor: colors.red,
          hasInput: false,
          leftTitle: 'Huỷ',
          rightTitle: 'Xác nhận',
          buttonLeftColor: colors.grey,
          buttonRightColor: colors.red,
          onLeftPress: () => setIsVisible(false),
          onRightPress: () => onReportHandle(),
          reason: null,
        };
      case 'cancel':
        return {
          title: 'Huỷ lịch hẹn',
          description: 'Bạn muốn huỷ lịch hẹn này?',
          iconName: 'help-circle',
          iconColor: colors.red,
          hasInput: true,
          leftTitle: 'Huỷ',
          rightTitle: 'Xác nhận',
          onLeftPress: () => setIsVisible(false),
          onRightPress: () => {
            console.log('Huỷ || Từ chối lịch hẹn');
            onRejectHandle();
          },
          reason: (
            <View>
              <InputComponent
                onChange={val => setCancelReason(val)}
                value={cancelReason}
                maxLength={50}
                multiline
                placeholder="Lý do"
              />
            </View>
          ),
        };
      default:
        return {
          title: 'Thông báo',
          description: 'Thao tác này không được hỗ trợ.',
          iconName: 'alert-circle',
          iconColor: colors.grey,
          hasInput: false,
          leftTitle: 'Đóng',
          rightTitle: '',
          onLeftPress: () => setIsVisible(false),
          onRightPress: null,
          reason: null,
        };
    }
  };
  const currentPopupContent = popupAction ? getPopupContent(popupAction) : null;

  useEffect(() => {
    showLoading();
    apiGetAppointmentByAppointmentId(
      appointmentId,
      appointmentType === 1 ? 1 : undefined,
    ).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setAppointmentData(res.data);
      } else {
        hideLoading();
      }
    });
  }, []);

  const onAcceptHandle = () => {
    if (isInBreeding) {
      // Hiển thị Popup cảnh báo nếu là lịch cận huyết
      openPopup('warning');
    } else {
      // Thực hiện nhận lịch nếu không phải cận huyết
      processAcceptAppointment();
    }
  };

  const processAcceptAppointment = () => {
    showLoading();
    apiUpdateAppointmentByAppointmentId(appointmentId, 1).then((res: any) => {
      console.log(res);
      if (res.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Nhận lịch thành công',
          text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
        });
        // Gọi lại API để cập nhật UI
        apiGetAppointmentByAppointmentId(
          appointmentId,
          appointmentType === 1 ? 1 : undefined,
        )
          .then((res: any) => {
            if (res.statusCode === 200) {
              setAppointmentData(res.data);
            }
            hideLoading();
          })
          .catch(() => {
            hideLoading();
          });
      } else {
        hideLoading();
        setIsVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Nhận lịch thất bại',
          text2: `Xảy ra lỗi khi đăng kí ${res.message}`,
        });
      }
    });
  };

  const openPopup = (action: string) => {
    setPopupAction(action);
    setIsVisible(true);
  };
  const onRejectHandle = () => {
    showLoading();
    apiUpdateAppointmentByAppointmentId(appointmentId, 3, cancelReason).then(
      (res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          setIsVisible(false);
          Toast.show({
            type: 'success',
            text1: 'Huỷ lịch thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          setIsVisible(false);
          Toast.show({
            type: 'error',
            text1: 'Huỷ lịch thất bại',
            text2: `Xảy ra lỗi khi đăng kí ${res.message}`,
          });
        }
      },
    );
  };
  const onCompleteHandle = () => {
    showLoading();
    apiUpdateAppointmentByAppointmentId(appointmentId, 2).then((res: any) => {
      if (res.statusCode === 200) {
        Toast.show({
          type: 'success',
          text1: 'Hoàn thành lịch thành công',
          text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
        });
        // Gọi lại API để cập nhật UI
        apiGetAppointmentByAppointmentId(
          appointmentId,
          appointmentType === 1 ? 1 : undefined,
        )
          .then((res: any) => {
            if (res.statusCode === 200) {
              setAppointmentData(res.data);
            }
            hideLoading();
          })
          .catch(() => {
            hideLoading();
          });
      } else {
        hideLoading();
        setIsVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Hoàn thành lịch thất bại',
          text2: `Xảy ra lỗi khi đăng kí ${res.message}`,
        });
      }
    });
  };

  const onReportHandle = () => {
    console.log('report');
    navigation.navigate(STACK_NAVIGATOR_SCREENS.REPORTSCREEN, {
      appointmentId,
      petCenterId,
    });
    setIsVisible(false);
    // pushNotification([userId, petCenterId, managerId], {
    //   title: 'Báo cáo dịch vụ',
    //   message: 'Thiếu report',
    //   appointmentId: appointmentId,
    //   sender: userId,
    //   status: 1
    // });
  };
  const trackingHandle = () => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.TRACKINGSCREEN, {
      appointmentId: appointmentId,
      appointmentType: appointmentType,
    });
  };
  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return 'Đang chờ';
      case 1:
        return 'Đã nhận';
      case 2:
        return 'Hoàn thành';
      case 3:
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  const getStatusColor = (status: number): string => {
    switch (status) {
      case 0:
        return colors.orange;
      case 1:
        return colors.primary;
      case 2:
        return colors.green;
      case 3:
        return colors.red;
      default:
        return colors.grey;
    }
  };

  const renderButtons = () => {
    const {status} = appointmentData;

    if (appointmentType === 0) {
      // Logic cho appointmentType là 0 (Dịch vụ thông thường)
      if (status === 0) {
        // Khi chưa nhận đơn
        if (roleName === 'petCenter') {
          return (
            <RowComponent styles={{paddingHorizontal: 40}}>
              <ButtonComponent
                text="Từ chối"
                type="primary"
                color={colors.red}
                onPress={() => openPopup('cancel')}
              />
              <ButtonComponent
                text="Nhận lịch"
                type="primary"
                onPress={onAcceptHandle}
              />
            </RowComponent>
          );
        } else if (roleName === 'customer') {
          return (
            <ButtonComponent
              text="Hủy lịch hẹn"
              type="primary"
              color={colors.red}
              styles={styles.singleButton}
              onPress={() => openPopup('cancel')}
            />
          );
        }
      } else if (status === 1) {
        // Khi đã nhận đơn
        if (roleName === 'petCenter') {
          return (
            <RowComponent styles={{paddingHorizontal: 40}}>
              <ButtonComponent
                text="Tạo theo dõi"
                type="primary"
                onPress={trackingHandle}
              />
              <ButtonComponent
                text="Hoàn thành"
                type="primary"
                color={colors.green}
                onPress={onCompleteHandle}
              />
            </RowComponent>
          );
        } else if (roleName === 'customer') {
          return (
            <RowComponent styles={{paddingHorizontal: 40}}>
              <ButtonComponent
                text="Xem báo cáo"
                type="primary"
                onPress={trackingHandle}
              />
              <ButtonComponent
                text="Report"
                type="primary"
                color={colors.red}
                onPress={() => openPopup('report')}
              />
            </RowComponent>
          );
        }
      } else if (status === 2) {
        // Khi hoàn thành
        if (roleName === 'petCenter') {
          return (
            <ButtonComponent
              text="Xem lại báo cáo"
              type="primary"
              onPress={trackingHandle}
              styles={styles.singleButton}
            />
          );
        } else if (roleName === 'customer') {
          return (
            <RowComponent styles={{paddingHorizontal: 40}}>
              <ButtonComponent
                text="Xem báo cáo"
                type="primary"
                onPress={trackingHandle}
              />
              <ButtonComponent
                text="Report"
                type="primary"
                color={colors.red}
                onPress={() => openPopup('report')}
              />
            </RowComponent>
          );
        }
      }
    } else if (appointmentType === 1) {
      // Logic cho appointmentType là 1 (Phối giống)
      if (status === 0) {
        // Khi chưa nhận đơn
        if (roleName === 'petCenter') {
          return (
            <RowComponent styles={{paddingHorizontal: 40}}>
              <ButtonComponent
                text="Từ chối"
                type="primary"
                color={colors.red}
                onPress={() => openPopup('cancel')}
              />
              <ButtonComponent
                text="Nhận lịch"
                type="primary"
                onPress={onAcceptHandle}
              />
            </RowComponent>
          );
        } else if (roleName === 'customer') {
          return (
            <ButtonComponent
              text="Hủy lịch hẹn"
              type="primary"
              color={colors.red}
              styles={styles.singleButton}
              onPress={() => openPopup('cancel')}
            />
          );
        }
      } else if (status === 1) {
        // Khi đã nhận đơn
        if (roleName === 'petCenter') {
          return (
            <ButtonComponent
              text="Hoàn thành"
              type="primary"
              color={colors.green}
              styles={styles.singleButton}
              onPress={onCompleteHandle}
            />
          );
        } else if (roleName === 'customer') {
          return (
            <ButtonComponent
              text="Report"
              type="primary"
              color={colors.red}
              onPress={() => openPopup('report')}
              styles={styles.singleButton}
            />
          );
        }
      } else if (status === 2) {
        // Khi hoàn thành
        if (roleName === 'customer') {
          return (
            <ButtonComponent
              text="Report"
              color={colors.red}
              type="primary"
              onPress={() => openPopup('report')}
              styles={styles.singleButton}
            />
          );
        }
      }
    }

    return null;
  };

  if (!appointmentData) {
    return (
      <Container
        title="Chi tiết lịch hẹn"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy cuộc hẹn</Text>
        </View>
      </Container>
    );
  }

  return (
    <>
      <Container
        title="Chi tiết lịch hẹn"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        {isInBreeding && (
          <View style={styles.warningContainer}>
            <RowComponent justify="space-between">
              <TextComponent
                text="Lưu ý: Đây là lịch hẹn có thể gây ra tình trạng cận huyết do thú cưng đã tưng phối giống với loại giống này!"
                styles={styles.warningText}
              />
            </RowComponent>
          </View>
        )}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Dịch vụ:</Text>
          <Text style={styles.value}>
            {appointmentType === 1 ? 'Phối giống' : 'Dịch vụ thú cưng'}
          </Text>

          <Text style={styles.label}>Ngày bắt đầu:</Text>
          <Text style={styles.value}>{appointmentData.startTime}</Text>

          <Text style={styles.label}>Ngày kết thúc:</Text>
          <Text style={styles.value}>{appointmentData.endTime}</Text>

          <Text style={styles.label}>Trạng thái:</Text>
          <Text
            style={[
              styles.value,
              {color: getStatusColor(appointmentData.status)},
            ]}>
            {getStatusText(appointmentData.status)}
          </Text>

          <Text style={styles.label}>Pet Center ID:</Text>
          <Text style={styles.value}>{appointmentData.petCenterId}</Text>

          <Text style={styles.label}>User ID:</Text>
          <Text style={styles.value}>{appointmentData.userId}</Text>
        </View>
      </Container>
      <View style={styles.buttonContainer}>{renderButtons()}</View>
      <PopupComponent
        title={currentPopupContent?.title || ''}
        description={currentPopupContent?.description || ''}
        iconName={currentPopupContent?.iconName || 'alert-circle'}
        iconColor={currentPopupContent?.iconColor || colors.grey}
        hasInput={currentPopupContent?.hasInput || false}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        leftTitle={currentPopupContent?.leftTitle || 'Huỷ'}
        rightTitle={currentPopupContent?.rightTitle || ''}
        buttonLeftColor={currentPopupContent?.buttonLeftColor}
        buttonRightColor={currentPopupContent?.buttonRightColor}
        onLeftPress={
          currentPopupContent?.onLeftPress || (() => setIsVisible(false))
        }
        onRightPress={
          currentPopupContent?.onRightPress || (() => setIsVisible(false))
        }
        reason={currentPopupContent?.reason}
      />
    </>
  );
};

export default MyAppointmentDetailScreen;

const styles = StyleSheet.create({
  detailContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  singleButton: {
    width: '100%',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.grey,
    textAlign: 'center',
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
