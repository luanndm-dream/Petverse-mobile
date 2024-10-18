import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SelectModel} from '@/models/SelectModel';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import { ArrowDown2 } from 'iconsax-react-native';
import { colors } from '@/constants/colors';
import { globalStyles } from '@/styles/globalStyles';
interface Props {
  label?: string;
  values: SelectModel[];
  selected?: string | string[];
  onSelect: (value: string) => void;
}
const DropdownPicker = (props: Props) => {
  const {onSelect, values, label, selected} = props;
  return (
    <View style={{marginBottom: 14}}>
      {label && <TextComponent text={label} styles={{marginBottom: 8}} />}
      <RowComponent styles={globalStyles.inputContainer} onPress={()=>{}}>
        <RowComponent styles={{flex: 1}}>
            <Text>Select</Text>
        </RowComponent>
        <ArrowDown2 size={22} color={colors.grey}/>
      </RowComponent>
    </View>
  );
};

export default DropdownPicker;

const styles = StyleSheet.create({});
