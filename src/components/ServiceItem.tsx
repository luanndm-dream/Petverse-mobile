import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import {colors} from '@/constants/colors';

interface Props {
  name: string;
  svg: React.ComponentType<any>;
  screen?: string;
}

const ServiceItem = (props: Props) => {
  const {name, svg: IconComponent} = props;
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.icon}>
        <IconComponent height={24} width={24} />
      </View>
      <TextComponent text={name} styles={styles.text} />
    </TouchableOpacity>
  );
};

export default ServiceItem;

const styles = StyleSheet.create({
  container: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    marginBottom: 5,
  },
  text: {
    textAlign: 'center',
    color: colors.primary
  },
});