import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  ButtonComponent,
  RowComponent,
} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {apiGetAppointmentByAppointmentId} from '@/api/apiAppoinment';
import {useAppSelector} from '@/redux';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';

const MyAppointmentDetailScreen = () => {
  const route = useRoute<any>();
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation<any>()
  const {appointmentId, appointmentType} = route.params;
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const roleName = useAppSelector(state => state.auth.roleName);

  useEffect(() => {
    apiGetAppointmentByAppointmentId(appointmentId).then((res: any) => {
      setAppointmentData(res.data);
    });
  }, []);
  
  const trackingHandle = () => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.TRACKINGSCREEN, {
      appointmentId: appointmentId
    })
  }

  const renderButtons = () => {
    const {status} = appointmentData;

    if (status === 0) {
      if (roleName === 'petCenter') {
        return (
          <RowComponent styles={{paddingHorizontal: 40}}>
            <ButtonComponent
              text="Từ chối"
              type="primary"
              color={colors.red}
              onPress={() => {
                /* Xử lý từ chối */
              }}
            />
            <ButtonComponent
              text="Nhận lịch"
              type="primary"
              onPress={() => {
                /* Xử lý nhận lịch */
              }}
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
              /* Xử lý hủy lịch hẹn */
            }}
          />
        );
      }
    }

    if (status === 1) {
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
              onPress={() => {
                /* Xử lý hoàn thành */
              }}
            />
           </RowComponent>
        );
      } else if (roleName === 'customer') {
        return (
          <ButtonComponent
            text="Xem báo cáo"
            type="primary"
            styles={styles.singleButton}
            onPress={trackingHandle}
          />
        );
      }
    }

    if (status === 2 && roleName === 'customer') {
      return (
        <ButtonComponent
          text="Đánh giá"
          type="primary"
          styles={styles.singleButton}
          onPress={() => {
            /* Xử lý đánh giá */
          }}
        />
      );
    }

    return null;
  };

  if (!appointmentData) {
    return null;
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
    </>
  );
};

export default MyAppointmentDetailScreen;

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
    paddingHorizontal: 16, // Thêm padding ngang
  },
  singleButton: {
    width: '100%', // Button sẽ chiếm full width
  },
  multipleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }

});
