import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useAppSelector} from '@/redux';
import {apiGetAppointmentByStatus} from '@/api/apiAppoinment';
import {useRoute} from '@react-navigation/native';
import useLoading from '@/hook/useLoading';
import {
  Container,
  IconButtonComponent,
  TextComponent,
  RowComponent,
  SectionComponent,
} from '@/components';
import {useCustomNavigation} from '@/utils/navigation';
import {colors} from '@/constants/colors';

const AppointmentStatusScreen = () => {
  const roleName = useAppSelector(state => state.auth.roleName);
  const id = useAppSelector(state =>
    roleName === 'Customer' ? state.auth.userId : state.auth.petCenterId,
  );
  const route = useRoute<any>();
  const {goBack} = useCustomNavigation();
  const {status, title} = route.params;
  const [appointments, setAppointments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 50;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusColor = (statusCode: number) => {
    switch (statusCode) {
      case 0:
        return colors.yellow; // Đang chờ
      case 1:
        return colors.primary; // Đã nhận
      case 2:
        return colors.green; // Hoàn thành
      case 3:
        return colors.red; // Từ chối
      default:
        return colors.grey;
    }
  };

  const getStatusText = (statusCode: number) => {
    switch (statusCode) {
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

  const fetchAppointments = async (resetPage = false) => {
    const currentPage = resetPage ? 1 : page;
    if (resetPage) {
      setIsRefreshing(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const res: any = await apiGetAppointmentByStatus(
        roleName,
        id as never,
        status,
        PAGE_SIZE,
        currentPage,
      );
      if (res.statusCode === 200) {
        const newAppointments = res.data.items;
        setAppointments(prev =>
          resetPage ? newAppointments : [...prev, ...newAppointments],
        );
        setHasMoreData(newAppointments.length === PAGE_SIZE);
      }
    } catch (error) {
      setError('Không thể tải danh sách cuộc hẹn. Vui lòng thử lại sau.');
      console.log('Error fetching appointments:', error);
    } finally {
      if (resetPage) setIsRefreshing(false);
      else setIsLoadingMore(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !error) {
      setPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMoreData, error]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    fetchAppointments(true);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  const renderAppointmentItem = ({item}: {item: any}) => {
    return (
      <View style={styles.card}>
        <RowComponent justify="space-between" styles={styles.headerRow}>
          <View style={styles.customerInfo}>
            <Text style={styles.label}>Khách hàng</Text>
            <TextComponent text={item.userName} size={16} font="bold" />
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Tổng tiền</Text>
            <TextComponent
              text={formatCurrency(item.amount)}
              size={16}
              color={colors.primary}
              font="bold"
            />
          </View>
        </RowComponent>

        <View style={styles.divider} />

        <View style={styles.contentContainer}>
          <RowComponent justify="space-between" styles={styles.row}>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Trung tâm</Text>
              <TextComponent text={item.centerName} size={14} />
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Trạng thái</Text>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: getStatusColor(item.status)},
                ]}>
                <TextComponent
                  text={getStatusText(item.status)}
                  size={12}
                  color={colors.white}
                />
              </View>
            </View>
          </RowComponent>

          <RowComponent justify="space-between" styles={styles.row}>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Bắt đầu</Text>
              <TextComponent text={item.startTime} size={14} />
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Kết thúc</Text>
              <TextComponent text={item.endTime} size={14} />
            </View>
          </RowComponent>

          <View style={styles.row}>
            <Text style={styles.label}>Ngày tạo</Text>
            <TextComponent
              text={item.createdDate}
              size={14}
              color={colors.grey}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <TextComponent
        text="Chưa có cuộc hẹn nào"
        size={16}
        color={colors.grey}
        styles={styles.emptyText}
      />
    </View>
  );

  const renderErrorComponent = () => (
    <View style={styles.errorContainer}>
      <TextComponent
        text={error || 'Đã có lỗi xảy ra'}
        size={16}
        color={colors.red}
        styles={styles.errorText}
      />
      <IconButtonComponent
        name="refresh-ccw"
        size={24}
        color={colors.primary}
        onPress={handleRefresh}
      />
    </View>
  );

  return (
    <Container
      title={title}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
     >
      <View style={{backgroundColor: colors.white, flex: 1}}>
        <FlatList
          data={appointments}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderAppointmentItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            !isRefreshing && !error ? renderEmptyComponent : null
          }
          ListFooterComponent={
            <>
              {isLoadingMore && (
                <ActivityIndicator
                  color={colors.primary}
                  style={styles.loadingIndicator}
                />
              )}
              {error && renderErrorComponent()}
            </>
          }
        />
        </View>
    </Container>
  );
};

export default AppointmentStatusScreen;

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    marginBottom: 12,
  },
  customerInfo: {
    flex: 2,
  },
  amountContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey4,
    marginVertical: 12,
  },
  contentContainer: {
    gap: 12,
  },
  row: {
    marginTop: 8,
  },
  infoColumn: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingIndicator: {
    marginVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
