import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {Modalize} from 'react-native-modalize';
import ButtonComponent from './ButtonComponent';
import WheelPicker from './WheelPicker';
import {colors} from '@/constants/colors';

interface Props {
  value?: string;
  defaultValue?: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
  isVisible?: boolean;
  maxDateNow?: boolean;
  minDateNow?: boolean;
}

const DatePicker = (props: Props) => {
  const {
    onConfirm,
    value,
    defaultValue,
    isVisible,
    onCancel,
    maxDateNow,
    minDateNow,
  } = props;
  const modalizeRef = useRef<Modalize>();
  const today = moment();

  useEffect(() => {
    if (isVisible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [isVisible]);

  const months = () => {
    let data = [
      {label: '01', value: '01'},
      {label: '02', value: '02'},
      {label: '03', value: '03'},
      {label: '04', value: '04'},
      {label: '05', value: '05'},
      {label: '06', value: '06'},
      {label: '07', value: '07'},
      {label: '08', value: '08'},
      {label: '09', value: '09'},
      {label: '10', value: '10'},
      {label: '11', value: '11'},
      {label: '12', value: '12'},
    ];
    return data;
  };

  const getDaysInMonth = (yearVal: string, monthVal: string) => {
    return moment(`${yearVal}-${monthVal}`, 'YYYY-MM').daysInMonth();
  };

  const generateDays = (yearVal: string, monthVal: string) => {
    const maxDays = getDaysInMonth(yearVal, monthVal);
    let data = [];
    for (let i = 1; i <= maxDays; i++) {
      const formattedDay = i < 10 ? `0${i}` : i.toString();
      data.push({
        label: formattedDay,
        value: formattedDay,
      });
    }
    return data;
  };

  const years = () => {
    let data = [];
    const currentYear = moment().year();
    const startYear = minDateNow ? currentYear : 1900; // Nếu minDateNow, bắt đầu từ năm hiện tại
    const endYear = maxDateNow ? currentYear : 2100;

    for (let i = startYear; i <= endYear; i++) {
      data.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return data;
  };

  const monthRef: any = useRef();
  const dayRef: any = useRef();
  const yearRef: any = useRef();

  const defaultDate = () => {
    if (value && moment(value).isValid()) {
      if (maxDateNow && moment(value).isAfter(today)) {
        return today.toDate();
      }
      return value;
    }
    if (defaultValue && moment(defaultValue).isValid()) {
      if (maxDateNow && moment(defaultValue).isAfter(today)) {
        return today.toDate();
      }
      return defaultValue;
    }
    return new Date();
  };

  const date = defaultDate();

  let month = useRef(moment(date).format('MM'));
  let day = useRef(moment(date).format('DD'));
  let year = useRef(moment(date).format('YYYY'));

  // State để quản lý danh sách ngày
  const [daysList, setDaysList] = useState(() =>
    generateDays(year.current, month.current),
  );

  const monthIndex = months().findIndex(e => e.value === month.current);
  const yearIndex = years().findIndex(e => e.value === year.current);
  const dayIndex = Math.min(
    daysList.findIndex(e => e.value === day.current),
    daysList.length - 1,
  );

  const checkDate = () => {
    const selectedDate = moment(
      `${year.current}-${month.current}-${day.current}`,
      'YYYY-MM-DD',
    );

    // Nếu có maxDateNow
    if (maxDateNow && selectedDate.isAfter(today)) {
      year.current = today.format('YYYY');
      month.current = today.format('MM');
      day.current = today.format('DD');
    }

    // Nếu có minDateNow
    if (minDateNow && selectedDate.isBefore(today)) {
      year.current = today.format('YYYY');
      month.current = today.format('MM');
      day.current = today.format('DD');
    }

    // Update vị trí cho từng picker
    yearRef.current?.scrollToIndex({
      animated: true,
      index: years().findIndex(e => e.value === year.current),
    });
    monthRef.current?.scrollToIndex({
      animated: true,
      index: months().findIndex(e => e.value === month.current),
    });

    const newDays = generateDays(year.current, month.current);
    setDaysList(newDays);

    setTimeout(() => {
      dayRef.current?.scrollToIndex({
        animated: true,
        index: newDays.findIndex(e => e.value === day.current),
      });
    }, 0);

    // Kiểm tra và điều chỉnh số ngày hợp lệ
    const maxDays = getDaysInMonth(year.current, month.current);
    const currentDayNum = parseInt(day.current);

    if (currentDayNum > maxDays) {
      day.current = maxDays.toString().padStart(2, '0');
      const updatedDays = generateDays(year.current, month.current);
      setDaysList(updatedDays);

      setTimeout(() => {
        dayRef.current?.scrollToIndex({
          animated: true,
          index: updatedDays.findIndex(e => e.value === day.current),
        });
      }, 0);
    }
  };

  const updateDaysList = () => {
    const newDays = generateDays(year.current, month.current);
    setDaysList(newDays);
  };

  const onMonthChange = (value: string, index?: number) => {
    month.current = value.toString();
    updateDaysList();
    checkDate();
  };

  const onDayChange = (value: string, index?: number) => {
    day.current = value.toString();
    checkDate();
  };

  const onYearChange = (value: string, index?: number) => {
    year.current = value.toString();
    updateDaysList();
    checkDate();
  };

  return (
    <Modalize
      ref={modalizeRef}
      onClose={() => {
        onCancel?.();
      }}
      adjustToContentHeight>
      <ScrollView scrollEnabled={false}>
        <View
          style={{
            backgroundColor: 'white',
            bottom: 0,
            width: '100%',
            borderRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 35,
              paddingTop: 10,
            }}>
            <Text style={styles.title}>Ngày</Text>
            <Text style={styles.title}>Tháng</Text>
            <Text style={styles.title}>Năm</Text>
          </View>

          <View style={styles.contentText}>
            <WheelPicker
              ref={dayRef}
              data={daysList}
              index={dayIndex}
              onChange={onDayChange}
            />
            <WheelPicker
              ref={monthRef}
              data={months()}
              index={monthIndex}
              onChange={onMonthChange}
            />
            <WheelPicker
              ref={yearRef}
              data={years()}
              index={yearIndex}
              onChange={onYearChange}
            />
          </View>
          <View style={{paddingHorizontal: 13, paddingVertical: 10}}>
            <ButtonComponent
              text="Chọn"
              type="primary"
              onPress={() => {
                const dateOutput = `${day.current}/${month.current}/${year.current}`;
                onConfirm?.(dateOutput);
                modalizeRef.current?.close();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Modalize>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    color: colors.primary,
    fontWeight: 'bold',
  },
  contentText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItem: 'center',
  },
});
