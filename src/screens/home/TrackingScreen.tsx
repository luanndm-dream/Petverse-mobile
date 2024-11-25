import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {apiGetAppointmentByAppointmentId} from '@/api/apiAppoinment';
import useLoading from '@/hook/useLoading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import VideoPlayer from 'react-native-video-player';

const {width} = Dimensions.get('window');

const TrackingScreen = () => {
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const {appointmentId, appointmentType} = route.params;
  const roleName = useAppSelector(state => state.auth.roleName);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number | null>(
    null,
  );
  const [selectedTrackings, setSelectedTrackings] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedScheduleId, setSelectedScheduleId] = useState();

  useFocusEffect(
    useCallback(() => {
      showLoading();
      apiGetAppointmentByAppointmentId(
        appointmentId,
        appointmentType === 1 ? 1 : undefined,
      ).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          // Xử lý thêm ngày vào trackings
          const processedSchedules = res.data.schedules.map(
            (schedule: any) => ({
              ...schedule,
              records: schedule.records.map((record: any) => ({
                ...record,
                trackings: record.trackings.map((tracking: any) => ({
                  ...tracking,
                  date: schedule.date, // Gắn ngày tương ứng
                })),
              })),
            }),
          );
  
          setAppointmentData({...res.data, schedules: processedSchedules});
  
          setSelectedDateIndex(0); // Auto-select first date
          if (
            processedSchedules[0] &&
            processedSchedules[0].records.length > 0
          ) {
            const firstRecord = processedSchedules[0].records[0];
            setSelectedRecordIndex(0);
            setSelectedTrackings(firstRecord.trackings || []);
            setSelectedScheduleId(firstRecord.scheduleId); // Gán scheduleId mặc định
          }
        } else {
          console.log('get appointment detail failed', res);
        }
      });
    }, []),
  );

  const isDayComplete = (records: any[]) =>
    records.every(record => record?.trackings && record?.trackings.length > 0);

  const renderDateItem = ({item, index}: {item: any; index: number}) => {
    const [day, month] = item.date.split('/');
    const isSelected = selectedDateIndex === index;
    const dayComplete = isDayComplete(item.records);

    return (
      <TouchableOpacity
        style={[styles.dateItem, isSelected && styles.dateItemSelected]}
        onPress={() => {
          setSelectedDateIndex(index);
          if (item.records.length > 0) {
            setSelectedRecordIndex(0); // Auto chọn record đầu tiên
            setSelectedTrackings(item.records[0].trackings || []); // Trackings của record đầu tiên
            setSelectedScheduleId(item.records[0].scheduleId); // Cập nhật ScheduleId tương ứng
          } else {
            setSelectedRecordIndex(null);
            setSelectedTrackings([]);
          }
        }}
        >
        <View style={styles.dateContent}>
          <Text style={[styles.dayText, isSelected && styles.selectedText]}>
            {day}
          </Text>
          <Text style={[styles.monthText, isSelected && styles.selectedText]}>
            Th.{month}
          </Text>
          {dayComplete && (
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color={isSelected ? colors.white : colors.green}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderImageSlider = () => (
    <View style={styles.imageSliderContainer}>
      {selectedTrackings?.length > 0 ? (
        <>
          <FlatList
            data={selectedTrackings}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              const isVideo = item.type === 1;
              return (
                <View style={styles.mediaWrapper}>
                  <Text style={styles.dateText}>{item.date || 'Không xác định'}</Text>
                  {/* Hiển thị ngày */}
                  {isVideo ? (
                    <VideoPlayer
                      video={{uri: item.url}}
                      videoWidth={width}
                      videoHeight={300}
                      pauseOnPress
                      thumbnail={require('../../assets/images/BannerVideo.png')}
                      style={styles.videoPlayer}
                    />
                  ) : (
                    <Image source={{uri: item.url}} style={styles.image} />
                  )}
                  <View style={styles.imageOverlay} />
                </View>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            onScroll={event => {
              const pageIndex = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setActiveSlide(pageIndex);
            }}
          />
          <View style={styles.paginationContainer}>
            {selectedTrackings.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, {opacity: index === activeSlide ? 1 : 0.3}]}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.noImageContainer}>
          <IconButtonComponent name="image-off" size={40} color={colors.grey} />
          <TextComponent text="Chưa có báo cáo" styles={styles.noReportText} />
        </View>
      )}
    </View>
  );

  const renderRecords = (records: any[]) => (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>Tiến trình theo dõi</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recordsContainer}>
        {records.map((record, index) => {
          const hasTracking = record.trackings && record.trackings.length > 0;
          const isSelected = selectedRecordIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.recordTimeContainer,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : hasTracking
                    ? colors.green
                    : colors.grey,
                },
              ]}
              onPress={() => {
                // console.log(record)
                setSelectedScheduleId(record.scheduleId);
                setSelectedRecordIndex(index);
                setSelectedTrackings(record.trackings || []); // Update trackings when record is selected
                setActiveSlide(0); // Reset active slide on record change
              }}>
              <View style={styles.timeIcon}>
                <IconButtonComponent
                  name="clock"
                  size={16}
                  color={colors.white}
                />
              </View>
              <Text style={styles.recordTimeText}>{record.time}</Text>
              <Text style={styles.recordDescription}>{record.description}</Text>
              {hasTracking && (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={colors.white}
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const handleReportAction = (scheduleId: number) => {
    console.log(scheduleId);
    if (roleName === 'PetCenter') {
      navigation.navigate(STACK_NAVIGATOR_SCREENS.UPDATETRACKINGSCREEN, {
        scheduleId: scheduleId,
      });
    } else if (roleName === 'Customer') {
      console.log('Report báo cáo cho khung giờ này');
      // Thực hiện hành động report báo cáo cho Customer
    }
  };

  if (!appointmentData) return null;

  const selectedDateData = appointmentData.schedules[selectedDateIndex];
  const allRecordsHaveImages =
    selectedDateData &&
    selectedDateData.records.every(
      (record: any) => record.trackings && record.trackings.length > 0,
    );

  return (
    <>
      <Container
        title="Báo cáo theo dõi"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          {renderImageSlider()}

          <View style={styles.contentContainer}>
            <FlatList
              data={appointmentData.schedules}
              horizontal
              renderItem={renderDateItem}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            />

            {selectedDateData && renderRecords(selectedDateData.records)}
          </View>
        </ScrollView>
      </Container>
      {selectedRecordIndex !== null &&
        selectedDateData &&
        roleName === 'PetCenter' &&
        !selectedDateData.records[selectedRecordIndex].trackings.length && (
          <View style={styles.buttonContainer}>
            <ButtonComponent
              text="Tạo báo cáo"
              color={colors.primary}
              type="primary"
              onPress={() => handleReportAction(selectedScheduleId as never)}
            />
          </View>
        )}
    </>
  );
};

export default TrackingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 10,
  },
  dateList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  dateItem: {
    width: 65,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    borderRadius: 15,
    backgroundColor: colors.white,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContent: {
    alignItems: 'center',
  },
  dateItemSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 22,
    color: colors.dark,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 13,
    color: colors.grey,
    marginTop: 4,
  },
  selectedText: {
    color: colors.white,
  },
  imageSliderContainer: {
    height: 300,
    backgroundColor: colors.grey4,
  },
  imageWrapper: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey4,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
    marginHorizontal: 4,
  },
  timelineContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  recordsContainer: {
    marginTop: 8,
  },
  recordTimeContainer: {
    marginRight: 12,
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
    elevation: 3,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  timeIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  recordTimeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordDescription: {
    color: colors.white,
    fontSize: 13,
    marginTop: 4,
    opacity: 0.9,
  },
  noReportText: {
    textAlign: 'center',
    color: colors.grey,
    fontSize: 16,
    marginTop: 8,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  buttonContainer: {
    paddingVertical: 16,
    backgroundColor: colors.white,
  },

  videoPlayer: {
    width: width,
    height: 280,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white, // Sử dụng màu trắng để nổi bật trên hình ảnh
    textAlign: 'center',
    position: 'absolute',
    top: 10, // Đặt text sát cạnh dưới của hình ảnh
    zIndex: 2, // Đảm bảo text nằm trên cùng
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Thêm nền mờ cho text để dễ đọc
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4, // Làm bo góc cho nền text
  },
  mediaWrapper: {
    width: width,
    height: 300,
    position: 'relative',
    alignItems: 'center', // Căn giữa text và media
  },
});
