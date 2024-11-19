import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
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
} from 'react-native-reanimated';
import {fontFamilies} from '@/constants/fontFamilies';
import {colors} from '@/constants/colors';
import {Crown} from 'iconsax-react-native';

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
    rate: 2,
  },
];

type PlaceProps = {
  center: (typeof centers)[0];
  index: number;
  onFinish?: (() => void) | null;
  anim: SharedValue<number>;
  highestRate: number;
};

const avatarSize = 28;
const spacing = 4;
const stagger = 300;

const sortedCenters = [...centers].sort((a, b) => b.rate - a.rate);
const highestRate = sortedCenters[0]?.rate;
// const secondHighestRate = sortedCenters[1]?.rate;

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
    const backgroundColor = center.rate === highestRate ? 'gold' : colors.grey4;

    return {
      height: interpolate(
        anim.value,
        [0, 1],
        [
          avatarSize + spacing,
          Math.max(avatarSize, center.rate * 15 + spacing),
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
        style={[{fontSize: 14, fontFamily: fontFamilies.bold}, textStylez]}>
        {center.rate}
      </Animated.Text>
      {center.rate === highestRate && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -20,
            },
            crownStylez,
          ]}>
          <Crown size="24" variant="Bold" color="gold" />
        </Animated.View>
      )}
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
        {centers.map((center, index) => (
          <Place
            key={index}
            center={center}
            index={index}
            anim={anim}
            highestRate={highestRate}
            onFinish={
              index === centers.length - 1
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
