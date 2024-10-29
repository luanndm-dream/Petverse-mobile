import {colors} from '@/constants/colors';
import React, {RefAttributes, forwardRef, memo, useMemo, useRef} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface WheelPickerProps {
  index?: any;
  data?: any;
  onChange: (currentDate: any, currentIndex: any) => void;
  itemHeight?: number;
}
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const WheelPicker: React.FC<WheelPickerProps & RefAttributes<FlatList<any>>> =
  forwardRef((props, ref) => {
    const {index, data, onChange, itemHeight = 50} = props;
    const visibleRest = 2;
    const containerHeight = itemHeight * (1 + visibleRest * 2);
    const wheelData = [null, null, ...data, null, null];

    const translationY = useSharedValue(0);
    const canMomentum = useRef(false);

    const getItemLayout = (data?: any, index?: any) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });

    const offsets = useMemo(
      () => [...Array(wheelData.length)].map((x, i) => i * itemHeight),
      [wheelData, itemHeight],
    );

    const scrollHandler = useAnimatedScrollHandler(
      (event: {contentOffset: {y: number}}) => {
        translationY.value = event.contentOffset.y;
      },
    );

    const onMomentumScrollBegin = () => {
      canMomentum.current = true;
    };

    const onMomentumScrollEnd = () => {
      if (canMomentum.current) {
        canMomentum.current = false;
        let offset = translationY.value;
        let currenIndex = Math.round(offset / itemHeight);
        const currentData = data[currenIndex]?.value;
        onChange?.(currentData, currenIndex);
      }
    };

    const WheelItem = memo(({item, index}: {item: any; index: number}) => {
      const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
          translationY.value,
          [
            (index - 2) * itemHeight,
            (index - 1) * itemHeight,
            index * itemHeight,
            (index + 1) * itemHeight,
            (index + 2) * itemHeight,
          ],
          [0.82, 0.9, 1.05, 0.9, 0.82],
          Extrapolate.CLAMP,
        );

        const opacity = interpolate(
          translationY.value,
          [
            (index - 2) * itemHeight,
            (index - 1) * itemHeight,
            index * itemHeight,
            (index + 1) * itemHeight,
            (index + 2) * itemHeight,
          ],
          [0.4, 0.7, 1.2, 0.7, 0.4],
          Extrapolate.CLAMP,
        );

        return {
          transform: [{scale}],
          opacity,
        };
      });

      // Kiểm tra nếu item là trung tâm, đặt màu đen (colors.dark), ngược lại dùng màu xám
      const textColor = index === visibleRest + 2 ? colors.dark : '#394960';

      return (
        <Animated.View style={animatedStyle}>
          <Text
            key={index}
            style={[styles.label, {height: itemHeight, color: textColor}]}>
            {item?.label}
          </Text>
        </Animated.View>
      );
    });

    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.container, {height: containerHeight}]}>
            <View style={[styles.indicator, {height: itemHeight}]} />
          </View>
          <View style={[styles.animatedContainer, {height: containerHeight}]}>
            <AnimatedFlatList
              ref={ref}
              initialScrollIndex={index}
              snapToInterval={itemHeight}
              snapToOffsets={offsets}
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={wheelData}
              renderItem={({item, index}: {item: any; index: any}) => (
                <WheelItem index={index - visibleRest} item={item} />
              )}
              getItemLayout={getItemLayout}
              onScroll={scrollHandler}
              onMomentumScrollBegin={onMomentumScrollBegin}
              onMomentumScrollEnd={onMomentumScrollEnd}
              keyExtractor={(item: any, index: number) => index.toString()}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  });

export default WheelPicker;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  animatedContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    borderRadius: 4,
    marginHorizontal: 18,
    backgroundColor: '#F6F7F8',
    marginBottom: 20,
    width: '90%',
  },
  label: {
    textAlign: 'center',
    width: '100%',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
