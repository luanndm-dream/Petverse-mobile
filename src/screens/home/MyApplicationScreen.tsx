import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import useLoading from '@/hook/useLoading';
import {useAppSelector} from '@/redux';
import {apiGetMyApplicationByUserId} from '@/api/apiApplication';
import {apiGetPetServices} from '@/api/apiPetServices';

// Định nghĩa lại colors để UI đẹp hơn
const enhancedColors = {
  ...colors,
  primary: '#6366F1',
  green: '#10B981',
  orange: '#F59E0B',
  red: '#EF4444',
  dark: '#1F2937',
  grey: '#6B7280',
  lightGrey: '#F3F4F6',
  background: '#F9FAFB',
};

const MyApplicationScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const [myApplication, setMyApplication] = useState<any>(null);
  const [petServices, setPetServices] = useState<any>();

  const serviceColorMap: {[key: number]: string} = {
    1: enhancedColors.primary,
    2: enhancedColors.green,
    3: enhancedColors.orange,
    4: enhancedColors.red,
  };

  useEffect(() => {
    showLoading();
    apiGetPetServices().then((res: any) => {
      if (res.statusCode === 200) {
        setPetServices(res?.data?.items);
        hideLoading();
      } else {
        hideLoading();
      }
    });
    apiGetMyApplicationByUserId(userId).then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setMyApplication(res.data);
      } else {
        console.log('Lấy dữ liệu application thất bại');
        hideLoading();
      }
    });
  }, [userId]);

  const renderStatus = (status: number) => {
    switch (status) {
      case 1:
        return (
          <View style={styles.statusContainer}>
            <IconButtonComponent name="clock" size={20} color={enhancedColors.orange} />
            <Text style={[styles.status, styles.processing]}>Đang xử lý</Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.statusContainer}>
            <IconButtonComponent name="check-circle" size={20} color={enhancedColors.green} />
            <Text style={[styles.status, styles.approved]}>Đã phê duyệt</Text>
          </View>
        );
      case -1:
        return (
          <View style={styles.statusContainer}>
            <IconButtonComponent name="cancel" size={20} color={enhancedColors.red} />
            <Text style={[styles.status, styles.canceled]}>Đã huỷ</Text>
          </View>
        );
      default:
        return (
          <View style={styles.statusContainer}>
            <IconButtonComponent name="help-circle" size={20} color={enhancedColors.grey} />
            <Text style={[styles.status, styles.unknown]}>Không xác định</Text>
          </View>
        );
    }
  };

  if (!myApplication) {
    return null;
  }

  return (
    <Container
      title="Đơn của tôi"
      isScroll={true}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={enhancedColors.dark}
          onPress={goBack}
        />
      }>
      <SectionComponent styles={styles.mainSection}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: myApplication.avatar}} style={styles.avatar} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{myApplication.name}</Text>
            <View style={styles.infoRow}>
              <IconButtonComponent name="map-marker" size={16} color={enhancedColors.grey} />
              <Text style={styles.text}>{myApplication.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconButtonComponent name="phone" size={16} color={enhancedColors.grey} />
              <Text style={styles.text}>{myApplication.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconButtonComponent name="information-variant" size={16} color={enhancedColors.grey} />
              <Text style={styles.text}>{myApplication.description}</Text>
            </View>
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái đơn</Text>
          {renderStatus(myApplication.status)}
        </View>

        {/* Cancel Reason */}
        {myApplication.status === -1 && myApplication.cancelReason && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lý do huỷ</Text>
            <View style={styles.reasonCard}>
              <IconButtonComponent name="alert-circle" size={20} color={enhancedColors.red} />
              <Text style={styles.reasonText}>{myApplication.cancelReason}</Text>
            </View>
          </View>
        )}

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ đã đăng ký</Text>
          <View style={styles.servicesContainer}>
            {myApplication.applicationPetServices.map((service: any, index: number) => {
              const matchedService = petServices?.find(
                (item: any) => item.id === service.petServiceId,
              );
              const backgroundColor = serviceColorMap[service.petServiceId] || enhancedColors.grey;

              return (
                <View
                  key={index}
                  style={[styles.serviceItem, {backgroundColor}]}>
                  <Text style={styles.serviceText}>
                    {matchedService ? matchedService.name : `Dịch vụ ${service.petServiceId}`}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Certifications Section */}
        {myApplication.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giấy chứng nhận</Text>
            <View style={styles.certificationsGrid}>
              {myApplication.certifications.map((certification: string, index: number) => (
                <View key={index} style={styles.certImageWrapper}>
                  <Image
                    source={{uri: certification}}
                    style={styles.certificationImage}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </SectionComponent>
    </Container>
  );
};

export default MyApplicationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: enhancedColors.background,
  },
  mainSection: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: enhancedColors.white,
    borderRadius: 16,
    shadowColor: enhancedColors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: enhancedColors.primary,
  },
  infoContainer: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: enhancedColors.dark,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: enhancedColors.grey,
    marginLeft: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: enhancedColors.dark,
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: enhancedColors.white,
    padding: 12,
    borderRadius: 12,
    shadowColor: enhancedColors.dark,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  processing: {
    color: enhancedColors.orange,
  },
  approved: {
    color: enhancedColors.green,
  },
  canceled: {
    color: enhancedColors.red,
  },
  unknown: {
    color: enhancedColors.grey,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center', // Căn giữa theo chiều dọc
    justifyContent: 'center', // Căn giữa theo chiều ngang
    padding: 16,
    backgroundColor: `${enhancedColors.red}10`,
    borderRadius: 12,
  },
  reasonText: {
    flex: 1,
    marginLeft: 12,
    color: enhancedColors.dark,
    fontSize: 14,
    fontWeight: 'bold'
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  serviceItem: {
    margin: 6,
    padding: 12,
    borderRadius: 12,
    minWidth: '45%',
    shadowColor: enhancedColors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceText: {
    color: enhancedColors.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  certificationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  certImageWrapper: {
    margin: 6,
    width: '45%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: enhancedColors.lightGrey,
    shadowColor: enhancedColors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});