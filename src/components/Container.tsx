import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from 'src/styles/globalStyles';
import TextComponent from './TextComponent';

type Props = {
  children: ReactNode;
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  isScroll?: boolean;
  titlePosition?: 'center';
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

const Container = (props: Props) => {
  const {
    children,
    title,
    left,
    right,
    isScroll = false,
    onLeftPress,
    onRightPress,
  } = props;

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        
        <View style={[globalStyles.container]}>
          {(left || title || right) && (
            <View
              style={[
                styles.row,
                {paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6},
              ]}>
              {left && (
                <TouchableOpacity
                  onPress={onLeftPress}
                  style={styles.iconLeftContainer}>
                 {left}
                </TouchableOpacity>
              )}

              <View style={[styles.titleContainer]}>
                {title && <TextComponent text={title} type="bigTitle" />}
              </View>

              {right && (
                <TouchableOpacity
                  onPress={onRightPress}
                  style={styles.iconRightContainer}>
                  <View>{right}</View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Sử dụng chung style cho cả ScrollView và View */}
          {isScroll ? (
            <ScrollView
              style={[globalStyles.container]}
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          ) : (
            <View style={[globalStyles.container]}>{children}</View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeftContainer: {
    position: 'absolute',
    left: 8,
  },
  iconRightContainer: {
    position: 'absolute',
    right: 8,
  },
  titleContainer: {
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center', // Căn giữa tiêu đề
  },
});
