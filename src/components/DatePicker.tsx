import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import moment from 'moment';
import {Modalize} from 'react-native-modalize';
import ButtonComponent from './ButtonComponent';
import WheelPicker from './WheelPicker';
import { colors } from '@/constants/colors';

interface Props {
  value?: string;
  defaultValue?: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
  isVisible?: boolean;
}
const DatePicker = (props: Props) => {
  const {onConfirm, value, defaultValue, isVisible, onCancel} = props;
  const modalizeRef = useRef<Modalize>();

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

  const days = () => {
    let data = [];
    for (let i = 1; i <= 31; i++) {
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
    for (let i = 1900; i < 2100; i++) {
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
      console.log(' value is Valid', value);
      return value;
    }else{
      // console.log('value input invalid')
    }
    if (defaultValue && moment(defaultValue).isValid()) return defaultValue;
    return new Date();
  };

  const date = defaultDate();

  let month = useRef(moment(date).format('MM'));
  let day = useRef(moment(date).format('DD'));
  let year = useRef(moment(date).format('YYYY'));

  const monthIndex = months().findIndex(e => e.value === month.current);
  const dayIndex = days().findIndex(e => e.value === day.current);
  const yearIndex = years().findIndex(e => e.value === year.current);

  const checkDate = () => {
    const dayInMonths = moment(
      `${year.current}-${month.current}`,
      'YYYY-MM',
    ).daysInMonth();
    if (Number(day.current) > dayInMonths) {
      dayRef.current?.scrollToIndex({
        animated: false,
        index: dayInMonths - 1,
      });
    }
  };

  const onMonthChange = (value: string, index?: number) => {
    month.current = value.toString();
    checkDate();
  };
  const onDayChange = (value: string, index?: number) => {
    day.current = value.toString();
    checkDate();
  };
  const onYearChange = (value: string, index?: number) => {
    year.current = value.toString();
    checkDate();
  };

  return (
    <Modalize
      ref={modalizeRef}
      onClose={() => {
        onCancel?.();
      }}
      adjustToContentHeight

      >
         <ScrollView scrollEnabled={false}>
      <View
        style={{
          backgroundColor: 'white',
          bottom: 0,
          //   flex: 1,
          //   position: 'absolute',
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
            data={days()}
            index={dayIndex}
            onChange={onDayChange}
            // onScrollBeginDrag={() => {
            //   onBeginDrag("day");
            // }}
            // onScrollEndDrag={() => {
            //   onEndDrag("day");
            // }}
          />
          <WheelPicker
            ref={monthRef}
            data={months()}
            index={monthIndex}
            onChange={onMonthChange}
            // onScrollBeginDrag={() => {
            //   onBeginDrag("month");
            // }}
            // onScrollEndDrag={() => {
            //   onEndDrag("month");
            // }}
          />

          <WheelPicker
            ref={yearRef}
            data={years()}
            index={yearIndex}
            onChange={onYearChange}
            // onScrollBeginDrag={() => {
            //   onBeginDrag("year");
            // }}
            // onScrollEndDrag={() => {
            //   onEndDrag("year");
            // }}
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
