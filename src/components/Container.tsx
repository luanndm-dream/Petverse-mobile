import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, { ReactNode } from 'react';
import { globalStyles } from 'src/styles/globalStyles';
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
  const { children, title, left, right, isScroll, onLeftPress, onRightPress } = props;

  return (
    <SafeAreaView style={[globalStyles.container]}>
      {(left || title || right) && (
        <View style={[styles.row, { paddingHorizontal: 16, paddingVertical: 12 }]}>
          {left && (
            <TouchableOpacity onPress={onLeftPress} style={styles.iconContainer}>
              <View>{left}</View>
            </TouchableOpacity>
          )}

          <View style={[styles.titleContainer]}>
            {title && <TextComponent text={title} type="bigTitle" />}
          </View>

          {right && (
            <TouchableOpacity onPress={onRightPress}>
              <View>{right}</View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {!isScroll && isScroll !== false ? (
        <ScrollView style={[globalStyles.container]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[globalStyles.center]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    left: 8,
  },
  titleContainer: {
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center', // Căn giữa tiêu đề
  },
});