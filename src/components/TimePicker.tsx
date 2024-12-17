import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
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
}

const TimePicker = (props: Props) => {
  const {onConfirm, value, defaultValue, isVisible, onCancel} = props;
  const modalizeRef = useRef<Modalize>();

  useEffect(() => {
    if (isVisible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [isVisible]);

  const hours = () => {
    let data = [];
    for (let i = 0; i < 24; i++) {
      const formattedHour = i < 10 ? `0${i}` : i.toString();
      data.push({
        label: formattedHour,
        value: formattedHour,
      });
    }
    return data;
  };

  const minutes = () => {
    let data = [];
    for (let i = 0; i < 60; i++) {
      const formattedMinute = i < 10 ? `0${i}` : i.toString();
      data.push({
        label: formattedMinute,
        value: formattedMinute,
      });
    }
    return data;
  };

  const hourRef: any = useRef();
  const minuteRef: any = useRef();

  const defaultTime = () => {
    return value || defaultValue || '00:00';
  };

  const time = defaultTime();
  let hour = useRef(time.split(':')[0]);
  let minute = useRef(time.split(':')[1]);

  const hourIndex = hours().findIndex(e => e.value === hour.current);
  const minuteIndex = minutes().findIndex(e => e.value === minute.current);

  const onHourChange = (value: string) => {
    hour.current = value;
  };
  
  const onMinuteChange = (value: string) => {
    minute.current = value;
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
        <View style={styles.pickerContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.title}>Giờ</Text>
            <Text style={styles.title}>Phút</Text>
          </View>

          <View style={styles.contentText}>
            <WheelPicker
              ref={hourRef}
              data={hours()}
              index={hourIndex}
              onChange={onHourChange}
            />
            <WheelPicker
              ref={minuteRef}
              data={minutes()}
              index={minuteIndex}
              onChange={onMinuteChange}
            />
          </View>

          <View style={styles.buttonContainer}>
            <ButtonComponent
              text="Chọn"
              type="primary"
              onPress={() => {
                const timeOutput = `${hour.current}:${minute.current}`;
                onConfirm?.(timeOutput);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </Modalize>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
    pickerContainer: {
      backgroundColor: 'white',
      borderRadius: 10,
      width: '100%',
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    //   marginHorizontal: ,
    paddingHorizontal: 88,
      paddingTop: 10,
    },
    title: {
      fontSize: 25,
      color: colors.primary,
      fontWeight: 'bold',
      textAlign: 'center', // Căn giữa text
    },
    contentText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20, // Thêm padding ngang để căn giữa picker
    },
    buttonContainer: {
      paddingHorizontal: 13,
      paddingVertical: 10,
    },
  });