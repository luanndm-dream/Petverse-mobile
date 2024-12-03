import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container, IconButtonComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { apiGetTransactionByUserId } from '@/api/apiPayment';
import { useAppSelector } from '@/redux';
import useLoading from '@/hook/useLoading';

const TransactionItem = ({ item }: any) => {
  const getStatusColor = (status: number) => {
    return status === 1 ? colors.red : colors.green;
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Chưa thanh toán' : 'Đã thanh toán';
  };

  const formatAmount = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.orderCode}>#{item.orderCode}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.date}>{item.createdDate}</Text>
        <Text
          style={[
            styles.amount,
            {
              color: item.status === 1 ? colors.grey : item.isMinus ? colors.red : colors.green,
            },
          ]}
        >
          {item.status === 1 ? '' : item.isMinus ? '-' : '+'}
          {formatAmount(item.amount)}
        </Text>
      </View>
    </View>
  );
};

const TransactionHistoryScreen = () => {
  const userId = useAppSelector((state) => state.auth.userId);
  const { goBack } = useCustomNavigation();
  const { showLoading, hideLoading } = useLoading();
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 15;

  const fetchTransactions = async (currentPage = 1, isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoadingMore(true);
  
    try {
      const res: any = await apiGetTransactionByUserId(userId, PAGE_SIZE, currentPage);
      if (res.statusCode === 200) {
        const sortedData = res.data.items.sort((a: any, b: any) => {
          // Chuyển đổi string ngày tháng sang Date object
          const [dateA, timeA] = a.createdDate.split(' ');
          const [dayA, monthA, yearA] = dateA.split('/');
          const fullDateA = `${yearA}-${monthA}-${dayA} ${timeA}`;
  
          const [dateB, timeB] = b.createdDate.split(' ');
          const [dayB, monthB, yearB] = dateB.split('/');
          const fullDateB = `${yearB}-${monthB}-${dayB} ${timeB}`;
  
          return new Date(fullDateB).getTime() - new Date(fullDateA).getTime();
        });
  
        if (isRefreshing) {
          setTransactionData(sortedData);
        } else {
          setTransactionData((prevData) => [...prevData, ...sortedData]);
        }
  
        setHasMore(res.data.items.length >= PAGE_SIZE);
      } else {
        console.log('Lấy giao dịch thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi lấy giao dịch:', error);
    } finally {
      if (isRefreshing) setRefreshing(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    showLoading();
    fetchTransactions(page).finally(hideLoading);
  }, [page]);

  const handleRefresh = () => {
    setPage(1);
    fetchTransactions(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderItem = ({ item }: any) => <TransactionItem item={item} />;

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Không có giao dịch nào</Text>
    </View>
  );

  return (
    <>
      <Container
        title="Lịch sử thanh toán"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <FlatList
          data={transactionData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </Container>
    </>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: colors.grey,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.grey,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
});