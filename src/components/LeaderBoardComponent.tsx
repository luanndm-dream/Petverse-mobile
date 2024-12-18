import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  FadeInRight,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {fontFamilies} from '@/constants/fontFamilies';
import {colors} from '@/constants/colors';
import {apiGetTop5PetCenter} from '@/api/apiPetCenter';

type PlaceProps = {
  center: {
    name: string;
    averageRate: number;
    avatar: string;
  };
  index: number;
  onFinish?: (() => void) | null;
  anim: SharedValue<number>;
  highestRate: number;
};

const avatarSize = 26;
const spacing = 4;
const stagger = 300;

function Place({center, index, onFinish, anim, highestRate}: PlaceProps) {
  const stylez = useAnimatedStyle(() => {
    const backgroundColor =
    center.averageRate === highestRate
      ? '#FFC300' // Màu vàng cho Top 1
      : center.averageRate >= highestRate - 0.5
      ? '#4AAEE2' // Màu xanh dương nhạt cho Top 2
      : center.averageRate >= highestRate - 1
      ? '#9987eb' // Màu xanh da trời cho Top 3
      : colors.grey4; // Màu xám cho các trung tâm khác

    return {
      height: interpolate(
        anim.value,
        [0, 1],
        [
          avatarSize + spacing,
          Math.max(avatarSize, center.averageRate * 16 + spacing),
        ],
      ),
      backgroundColor,
    };
  });

  const textStylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(anim.value, [0, 0.2, 1], [0, 0, 1]),
    };
  });

  return (
    <Animated.View
      style={{alignItems: 'center', paddingHorizontal: 12}}
      entering={FadeInRight.delay(stagger * index)
        .springify()
        .damping(80)
        .stiffness(200)
        .withCallback(finished => {
          'worklet';
          if (finished && onFinish) {
            runOnJS(onFinish)();
          }
        })}>
      <Animated.Text
        style={[
          {fontSize: 14, fontFamily: fontFamilies.bold, color: colors.white},
          textStylez,
        ]}>
        {center.averageRate.toFixed(1)}
      </Animated.Text>
      <Animated.View
        style={[
          {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: avatarSize,
            height: avatarSize,
          },
          stylez,
        ]}>
        <View
          style={{
            width: avatarSize,
            aspectRatio: 1,
          }}>
          <Image
            source={{uri: center.avatar}}
            style={{
              flex: 1,
              borderRadius: avatarSize,
              aspectRatio: 1,
            }}
          />
        </View>
      </Animated.View>
      
      <Text
        style={{
          fontSize: 6,
          fontFamily: fontFamilies.regular,
          color: colors.white,
          marginTop: 2,
          fontWeight: 'bold'
        }}
        numberOfLines={2}
        ellipsizeMode="tail">
        {center.name}
      </Text>
    </Animated.View>
  );
}

const LeaderBoardComponent = () => {
  const anim = useSharedValue(0);
  const [centers, setCenters] = useState([]);

  const now = new Date();
  let year = now.getFullYear();
  let prevMonth = now.getMonth();
  if (prevMonth === 0) {
    prevMonth = 12; // Tháng 12
    year -= 1; // Năm trước đó
  }

  useEffect(() => {
    apiGetTop5PetCenter(prevMonth, year).then((res: any) => {
      if (res.data?.topPetCenterDatas) {
        // Cập nhật danh sách centers
        setCenters(res.data.topPetCenterDatas);
      }
    });
  }, []);

  // Xử lý khi chưa có dữ liệu
  if (centers.length === 0) {
    return (
      <View style={{alignSelf: 'center', marginTop: 20}}>
        <Text style={{color: colors.grey}}>Loading...</Text>
      </View>
    );
  }

  const highestRate = Math.max(
    ...centers.map((center: any) => center.averageRate),
  );

  return (
    <View style={{alignSelf: 'center'}}>
      <View
        style={{
          flexDirection: 'row',
          gap: spacing,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: 110,
        }}>
        {centers.map((center: any, index) => (
          <Place
            key={index}
            center={{
              name: center.name,
              averageRate: center.averageRate,
              avatar: center.avatar,
            }}
            index={index}
            anim={anim}
            highestRate={highestRate}
            onFinish={
              index === centers.length - 1
                ? () => {
                    anim.value = 1;
                    // console.log('Finished', index);
                  }
                : null
            }
          />
        ))}
      </View>
    </View>
  );
};

export default LeaderBoardComponent;

const styles = StyleSheet.create({});
