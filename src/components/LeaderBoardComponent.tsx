import {Image, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  FadeInRight,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {fontFamilies} from '@/constants/fontFamilies';
import {colors} from '@/constants/colors';
import {Crown} from 'iconsax-react-native';
import { useIsFocused } from '@react-navigation/native';

const centers = [
  {
    name: 'Center 1',
    rate: 5,
  },
  {
    name: 'Center 2',
    rate: 3.5,
  },
  {
    name: 'Center 3',
    rate: 4,
  },
  {
    name: 'Center 4',
    rate: 4.5,
  },
  {
    name: 'Center 5',
    rate: 2.8,
  },
];

type PlaceProps = {
  center: (typeof centers)[0];
  index: number;
  onFinish?: (() => void) | null;
  anim: SharedValue<number>;
  highestRate: number;
};

const avatarSize = 26;
const spacing = 4;
const stagger = 300;
const order = [3, 1, 0, 2, 4];
const sortedByRate = [...centers].sort((a, b) => b.rate - a.rate);

const finalSortedCenters = order.map(index => sortedByRate[index]);



function Place({center, index, onFinish, anim, highestRate}: PlaceProps) {
  const _anim = useDerivedValue(() => {
    return withDelay(
      stagger * index,
      withSpring(anim.value, {
        damping: 80,
        stiffness: 200,
      }),
    );
  });

  const stylez = useAnimatedStyle(() => {
    let backgroundColor;

    if (center.rate === highestRate) {
      backgroundColor = '#FFC300'; 
    } else if (center.rate === sortedByRate[1]?.rate) {
      backgroundColor = '#4A90E2';
    } else if (center.rate === sortedByRate[2]?.rate) {
      backgroundColor = '#907aa5';
    } else {
      backgroundColor = colors.grey4; 
    }

    return {
      height: interpolate(
        anim.value,
        [0, 1],
        [
          avatarSize + spacing,
          Math.max(avatarSize, center.rate * 16 + spacing),
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

  const crownStylez = useAnimatedStyle(() => {
    return {
      opacity: center.rate === highestRate ? anim.value : 0,
      transform: [
        {
          translateY: interpolate(anim.value, [0, 1], [-20, 0]),
        },
      ],
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
        {center.rate}
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
            source={{uri: `https://i.pravatar.cc/150?u=user_${center.name}`}}
            style={{
              flex: 1,
              borderRadius: avatarSize,
              aspectRatio: 1,
            }}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
}
const LeaderBoardComponent = () => {
  const anim = useSharedValue(0);
  return (
    <View style={{alignSelf: 'center'}}>
      <View
        style={{
          flexDirection: 'row',
          gap: spacing,
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          height: 100,
        }}>
        {finalSortedCenters.map((center, index) => (
          <Place
            key={index}
            center={center}
            index={index}
            anim={anim}
            highestRate={sortedByRate[0]?.rate}
            onFinish={
              index === finalSortedCenters.length - 1
                ? () => {
                    anim.value = 1;
                    console.log('Finished', index);
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
