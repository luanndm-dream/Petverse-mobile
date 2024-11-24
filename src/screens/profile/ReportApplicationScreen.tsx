import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container, IconButtonComponent, TextComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useAppSelector} from '@/redux';
import {apiGetMyReportById} from '@/api/apiReport';
import useLoading from '@/hook/useLoading';
import { useNavigation } from '@react-navigation/native';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';

const {width} = Dimensions.get('window');

interface ReportItem {
  id: number;
  title: string;
  reason: string;
  status: 0 | 1 | 2;
  createdDate?: string;
  updatedDate?: string;
  reportImages?: {url: string}[];
}

const STATUS_LABELS: Record<number, string> = {
  0: 'Đang xử lý',
  1: 'Đã phê duyệt',
  2: 'Đã từ chối',
};

const STATUS_COLORS: Record<number, string> = {
  0: '#FFB74D', 
  1: '#66BB6A', 
  2: '#EF5350', 
};

const ReportApplicationScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const roleName = useAppSelector(state => state.auth.roleName);
  const id = useAppSelector(state =>
    roleName === 'Customer' ? state.auth.userId : state.auth.petCenterId,
  );

  useEffect(() => {
    showLoading();
    apiGetMyReportById(id as never, roleName).then((res: any) => {
      if (res.statusCode === 200) {
        setReportData(res.data.items);
        hideLoading();
      } else {
        console.log('Lấy dữ liệu thất bại');
        hideLoading();
      }
    });
  }, [id, roleName]);

  const onPressItem = (item: ReportItem) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.REPORTAPPLICATIONDETAIL,{
      reportId: item.id
    });
  };

  const renderItem = ({ item }: { item: ReportItem }) => {
    const statusColor = STATUS_COLORS[item.status];
    const statusLabel = STATUS_LABELS[item.status];
  
    const isVideo =
      item.reportImages &&
      item.reportImages.length > 0 &&
      item.reportImages[0].url.includes('.mp4');
  
    const thumbnail = isVideo
      ? require('../../assets/images/BannerVideo.png')
      : item.reportImages && item.reportImages.length > 0
      ? { uri: item.reportImages[0].url }
      : require('../../assets/images/DefaultAvatar.jpg');
  
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPressItem(item)}
        activeOpacity={0.9}>
        <View style={styles.cardHeader}>
          <View style={styles.imageContainer}>
            <Image source={thumbnail} style={styles.image} />
          </View>
          <View style={styles.headerInfo}>
            <TextComponent text={item.title} type="title" styles={styles.title} />
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <TextComponent text={statusLabel} styles={styles.statusText} />
            </View>
          </View>
        </View>
        <View style={styles.reasonContainer}>
          <TextComponent
            text={`Lý do: ${item.reason}`}
            type="description"
            styles={styles.reason}
          />
        </View>
        <View style={styles.cardContent}>
          <TextComponent text={`Ngày tạo: ${item.createdDate}`} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
     
      <TextComponent
        text="Không có báo cáo nào"
        type="title"
        // styles={styles.emptyText}
      />
    </View>
  );

  return (
    <Container
      title="Đơn báo cáo của tôi"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <FlatList
        data={reportData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent()}
      />
    </Container>
  );
};

export default ReportApplicationScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grey2,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 15,
    color: colors.grey,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.dark,
    flexShrink: 1,
    marginBottom: 6,
  },
  cardContent: {
    padding: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  reasonContainer: {
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  reason: {
    fontSize: 15,
    color: colors.dark,
    lineHeight: 20,
    textAlign: 'left',
    flex: 1,
    marginTop: 12,
  },
});