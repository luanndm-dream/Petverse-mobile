import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  ButtonComponent,
  RowComponent,
  PopupComponent,
  InputComponent,
} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {
  apiGetAppointmentByAppointmentId,
  apiUpdateAppointmentByAppointmentId,
} from '@/api/apiAppoinment';
import {useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const MyAppointmentDetailScreen = () => {
  const route = useRoute<any>();
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const {appointmentId, appointmentType} = route.params;
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const roleName = useAppSelector(state => state.auth.roleName);
  const [isVisible, setIsVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  
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
    showLoading();
    apiUpdateAppointmentByAppointmentId(appointmentId, 1).then((res: any) => {
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
        ).then((res: any) => {
          if (res.statusCode === 200) {
            setAppointmentData(res.data);
          }
          hideLoading();
        }).catch(() => {
          hideLoading();
        });
      } else {
        hideLoading();
        setIsVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Nhận lịch thất bại',
          text2: `Xảy ra lỗi khi đăng kí ${res.error}`,
        });
      }
    });
  };

  const onRejectHandle = () => {
    showLoading()
    apiUpdateAppointmentByAppointmentId(appointmentId,3, cancelReason).then(
      (res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          setIsVisible(false)
          Toast.show({
            type: 'success',
            text1: 'Huỷ lịch thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          setIsVisible(false)
          Toast.show({
            type: 'error',
            text1: 'Huỷ lịch thất bại',
            text2: `Xảy ra lỗi khi đăng kí ${res.error}`,
          });
        }
        
      },
    );
  };
  const onCompleteHandle = () => {
    showLoading()
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
        ).then((res: any) => {
          if (res.statusCode === 200) {
            setAppointmentData(res.data);
          }
          hideLoading();
        }).catch(() => {
          hideLoading();
        });
      } else {
        hideLoading();
        setIsVisible(false);
        Toast.show({
          type: 'error',
          text1: 'Hoàn thành lịch thất bại',
          text2: `Xảy ra lỗi khi đăng kí ${res.error}`,
        });
      }
    });
  }

  const onReportHandle = () => {
    console.log('report')
  }
  const trackingHandle = () => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.TRACKINGSCREEN, {
      appointmentId: appointmentId,
      appointmentType: appointmentType
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
                onPress={() => {
                  setIsVisible(!isVisible);
                }}
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
              onPress={() => {
                setIsVisible(!isVisible);
              }}
            />
          );
        }
      } else if (status === 1) {
        // Khi đã nhận đơn
        if (roleName === 'petCenter') {
          return (
            <RowComponent styles={{paddingHorizontal: 40}}>
              <ButtonComponent
                text="Báo cáo"
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
                onPress={onReportHandle}
          
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
                onPress={onReportHandle}
             
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
                onPress={() => {
                  setIsVisible(!isVisible);
                }}
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
              onPress={() => {
                setIsVisible(!isVisible);
              }}
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
              onPress={trackingHandle}
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
              onPress={trackingHandle}
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
        title="Huỷ lịch hẹn"
        description="Bạn muốn huỷ lịch hẹn này?"
        iconColor={colors.red}
        iconName="help-circle"
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        leftTitle="Huỷ"
        rightTitle="Xác nhận"
        reason={
          <View>
            <InputComponent
              onChange={val => setCancelReason(val)}
              value={cancelReason}
              maxLength={50}
              multiline
              placeholder="Lý do"
            />
          </View>
        }
        onLeftPress={() => setIsVisible(false)}
        onRightPress={onRejectHandle}
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
});
