import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from 'src/styles/globalStyles';
import TextComponent from './TextComponent';

type Props = {
  children: ReactNode;
  title?: string;
  back?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  isScroll?: boolean;
  titlePosition?: 'center'
};

const Container = (props: Props) => {
  const {children, title, back, left, right, isScroll} = props;
  return (
    <SafeAreaView style={[globalStyles.container]}>
      {(back || left || title || right) && (
        <View
          style={[
            styles.row,
            {
              backgroundColor: 'orange',
              paddingHorizontal: 16,
              paddingVertical: 12,
            },
          ]}>
          {back && <TextComponent text="Back" />}
          {left && !back && <TextComponent text="Left" />}
          <View style={[{paddingHorizontal: 16, flex: 1, alignItems: 'center'}]}>
            {title && <TextComponent text={title} type='bigTitle' />}
          </View>
          {right && right}
        </View>
      )}
      {!isScroll && isScroll !== false ? (
        <ScrollView style={[globalStyles.container]}>{children}</ScrollView>
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
  },
});
