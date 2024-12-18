import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {Container, IconButtonComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useAppSelector} from '@/redux';
import {apiGetMyAppointment} from '@/api/apiAppoinment';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';

interface Appointment {
  createdDate: string;
  endTime: string;
  id: string;
  petCenterId: string;
  petId: number;
  startTime: string;
  status: number;
  type: number;
  updatedDate: string | null;
  userId: string;
}

const PAGE_SIZE = 10;

const MyAppointmentScreen = () => {
  const {goBack} = useCustomNavigation();
  const userId = useAppSelector(state => state.auth.userId);
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const roleName = useAppSelector(state => state.auth.roleName);
  const navigation = useNavigation<any>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const onPressItemHandle = (appointmentId: string, type: number, petCenterId: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.MYAPPOINTMENTDETAILSCREEN, {
      appointmentId: appointmentId,
      appointmentType: type,
      petCenterId: petCenterId
    });
  };
  const fetchAppointments = async (pageNumber = 1, shouldRefresh = false) => {
    if (loading) return;

    setLoading(true);
 
    //console.log(roleName)
    try {
      const id = roleName === 'Customer' ? userId : petCenterId;
      const response = await apiGetMyAppointment(
        roleName as never,
        PAGE_SIZE,
        id as never,
      );
      const sortedData = response.data.items.sort(
        (a: Appointment, b: Appointment) =>
          moment(b.createdDate, 'DD/MM/YYYY HH:mm').valueOf() -
          moment(a.createdDate, 'DD/MM/YYYY HH:mm').valueOf(),
      );

      if (shouldRefresh) {
        setAppointments(sortedData);
      } else {
        setAppointments(prevAppointments => {
          const existingIds = new Set(prevAppointments.map(item => item.id));
          const newItems = sortedData.filter(
            (item: any) => !existingIds.has(item.id),
          );
          return [...prevAppointments, ...newItems];
        });
      }

      setHasMore(response.data.items.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      fetchAppointments(1, true);
    }, [userId, petCenterId]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments(1, true);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAppointments(nextPage, false);
    }
  }, [currentPage, hasMore, loading]);

  useEffect(() => {
    fetchAppointments(1, true);
  }, [roleName, userId, petCenterId]);

  const renderAppointmentItem = useCallback(({item}: {item: Appointment}) => {
    const isBreeding = item.type === 1;

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => onPressItemHandle(item.id, item.type, item.petCenterId)}>
        <View
          style={[
            styles.typeBadge,
            {backgroundColor: isBreeding ? colors.yellow : colors.primary},
          ]}>
          <Text style={styles.typeBadgeText}>
            {isBreeding ? 'Phối giống' : 'Dịch vụ'}
          </Text>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>Bắt đầu:</Text>
            <Text style={styles.timeText}>{item.startTime}</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.label}>Kết thúc:</Text>
            <Text style={styles.timeText}>{item.endTime}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.label}>Trạng thái:</Text>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: getStatusColor(item.status)},
              ]}>
              <Text style={styles.statusText}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

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

  return (
    <Container
      title="Lịch hẹn của tôi"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          loading && !refreshing ? (
            <ActivityIndicator style={styles.loader} />
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có lịch hẹn nào</Text>
          </View>
        )}
      />
    </Container>
  );
};

export default MyAppointmentScreen;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    gap: 16,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  typeBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  appointmentDetails: {
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 80,
    fontSize: 14,
    color: colors.grey,
  },
  timeText: {
    fontSize: 14,
    color: colors.dark,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey,
  },
});
