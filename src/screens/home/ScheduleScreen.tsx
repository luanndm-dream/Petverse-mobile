import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Container,
  IconButtonComponent,
  ButtonComponent,
  TimePicker,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {RowComponent} from '@/components';
import {useNavigation, useRoute} from '@react-navigation/native';

interface TimeSlot {
  id: string;
  time: string;
  description: string;
}

const ScheduleScreen: React.FC = () => {
  const route = useRoute<any>();
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation();
  const [isTimePickerVisible, setIsTimePickerVisible] =
    useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const handleTimeConfirm = (time: string): void => {
    setSelectedTime(time);
    setIsTimePickerVisible(false);
  };

  

  const handleAddTimeSlot = (): void => {
    if (!selectedTime) {
      Alert.alert('Thông báo', 'Vui lòng chọn giờ');
      return;
    }
    if (!description) {
      Alert.alert('Thông báo', 'Vui lòng nhập mô tả');
      return;
    }

    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      time: selectedTime,
      description,
    };

    setTimeSlots(prevSlots => [...prevSlots, newTimeSlot]);
    setSelectedTime('');
    setDescription('');
  };

  const handleDeleteTimeSlot = (id: string): void => {
    console.log('Deleting slot with id:', id); // Thêm log để debug
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa khung giờ này?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setTimeSlots(prevSlots => {
            const newSlots = prevSlots.filter(slot => slot.id !== id);
            console.log('New slots after deletion:', newSlots); // Thêm log để debug
            return newSlots;
          });
        },
      },
    ]);
  };
  const handleGoBackWithData = (): void => {
    const onGoBack = route.params?.onGoBack;
    if (onGoBack) {
      onGoBack(timeSlots); // Gọi callback với dữ liệu timeSlots
    }
    navigation.goBack();
  };

  useEffect(() => {
    const existingData = route.params?.scheduleData;
    if (existingData && existingData.length > 0 && timeSlots.length === 0) {
      setTimeSlots(existingData); // Giữ lại dữ liệu đã có nếu có
    }
  }, [route.params, timeSlots.length]);

  const renderTimeSlot = ({item}: {item: TimeSlot}): React.ReactElement => (
    <View style={styles.timeSlotItem}>
      <RowComponent justify="space-between">
        <View style={styles.timeContainer}>
          <IconButtonComponent name="clock" size={20} color={colors.primary} />
          <TextComponent
            text={item.time}
            type="title"
            styles={styles.timeText}
          />
        </View>

        <IconButtonComponent
          name="trash-can"
          size={20}
          color={colors.red}
          onPress={() => handleDeleteTimeSlot(item.id)}
        />
      </RowComponent>
      <View style={styles.descriptionContainer}>
        <TextComponent
          text={item.description}
          styles={styles.descriptionText}
        />
      </View>
    </View>
  );

  return (
    <>
      <Container
        title="Tạo lịch theo dõi"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
              onPress={handleGoBackWithData}
          />
        }>
        <View style={styles.formContainer}>
          <View style={styles.inputSection}>
            <TextComponent
              text="Giờ theo dõi"
              type="title"
              styles={styles.labelText}
            />
            <View style={styles.inputRow}>
              <TouchableOpacity
                style={[styles.input, selectedTime ? styles.inputFilled : null]}
                onPress={() => setIsTimePickerVisible(true)}>
                <TextComponent
                  text={selectedTime || 'Chọn giờ'}
                  styles={[
                    styles.timeText,
                    !selectedTime && styles.placeholderText,
                  ]}
                />
              </TouchableOpacity>
              <IconButtonComponent
                name="clock"
                size={24}
                color={colors.primary}
                onPress={() => setIsTimePickerVisible(true)}
              />
            </View>

            <TextComponent
              text="Mô tả"
              type="title"
              styles={styles.labelText}
            />
            <TextInput
              style={[
                styles.descriptionInput,
                description ? styles.inputFilled : null,
              ]}
              placeholder="Nhập mô tả"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor={colors.grey}
            />

            <ButtonComponent
              text="Thêm khung giờ"
              type="primary"
              onPress={handleAddTimeSlot}
              styles={styles.addButton}
            />
          </View>

          <View style={styles.listContainer}>
            <FlatList
              data={timeSlots}
              keyExtractor={item => item.id}
              renderItem={renderTimeSlot}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <IconButtonComponent
                    name="calendar"
                    size={40}
                    color={colors.grey}
                  />
                  <TextComponent
                    text="Chưa có khung giờ nào được thêm"
                    styles={styles.emptyText}
                  />
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </Container>
      <TimePicker
        isVisible={isTimePickerVisible}
        onCancel={() => setIsTimePickerVisible(false)}
        onConfirm={handleTimeConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labelText: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  inputFilled: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  timeText: {
    color: colors.dark,
    fontSize: 16,
    textAlignVertical: 'center',
  },
  placeholderText: {
    color: colors.grey,
  },
  clockIcon: {
    padding: 8,
  },
  descriptionInput: {
    height: 100,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 8,
  },
  addButton: {
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  timeSlotItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButton: {
    padding: 8,
  },
  descriptionContainer: {
    paddingLeft: 28,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.grey,
    marginTop: 12,
    fontSize: 16,
  },
});

export default ScheduleScreen;
