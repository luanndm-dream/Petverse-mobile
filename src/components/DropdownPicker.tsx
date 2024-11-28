import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SelectModel} from '@/models/SelectModel';
import TextComponent from './TextComponent';
import RowComponent from './RowComponent';
import {ArrowDown2} from 'iconsax-react-native';
import {colors} from '@/constants/colors';
import {globalStyles} from '@/styles/globalStyles';
import {Modalize} from 'react-native-modalize';
import {Host, Portal} from 'react-native-portalize';
import ButtonComponent from './ButtonComponent';
import {fontFamilies} from '@/constants/fontFamilies';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SpaceComponent from './SpaceComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IconButtonComponent from './IconButtonComponent';
import {
  CatIcon,
  DoctorIcon,
  DogIcon,
  PetBoardingIcon,
  PetGroomingIcon,
  PetTrainingIcon,
} from '@/assets/svgs';
interface Props {
  label?: string;
  values: SelectModel[];
  selected?: string | string[];
  onSelect: (value: string | string[]) => void;
  placeholder: string;
  multible?: boolean;
  canPress?: boolean;
}
const DropdownPicker = (props: Props) => {
  const {
    onSelect,
    values,
    label,
    selected,
    multible,
    placeholder,
    canPress = true,
  } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const modalizeRef = useRef<Modalize>();

  // console.log(values)
  const getIcon = (label: string) => {
    let width = 30;
    let height = 30;

    switch (label) {
      case 'Trông thú':
        return <PetBoardingIcon width={width} height={height} />;
      case 'Dịch vụ spa':
        return <PetGroomingIcon width={width} height={height} />;
      case 'Huấn luyện':
        return <PetTrainingIcon width={width} height={height} />;
      case 'Bác sĩ thú y':
          return <DoctorIcon width={width} height={height} />;
      case 'Chó':
        return <DogIcon width={width} height={height} />;
      case 'Mèo':
        return <CatIcon width={width} height={height} />;
      default:
        return null;
    }
  };

  const selectItemHandel = (id: string) => {
    if (selectedItems.includes(id)) {
      const data = [...selectedItems];
      const index = selectedItems.findIndex(element => element === id);

      if (index !== -1) {
        data.splice(index, 1);
      }
      setSelectedItems(data);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  useEffect(() => {
    if (multible) {
      onSelect(selectedItems);
    }
  }, [multible, selectedItems]);

  useEffect(() => {
    if (isVisible && selected && selected?.length > 0) {
      setSelectedItems(selected as string[]);
    }
  }, [isVisible, selected]);
  useEffect(() => {
    if (isVisible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [isVisible]);

  const renderSelectedItem = (id: string) => {
    const item = values.find(element => element.value === id);
    return item ? (
      <RowComponent key={id} styles={styles.selectedItem}>
        {getIcon(item.label)}
        <TextComponent text={item.label} color={colors.primary} />
        <IconButtonComponent
          name="close"
          size={18}
          color={colors.text}
          onPress={() => selectItemHandel(id)}
        />
      </RowComponent>
    ) : null;
  };
  const renderServiceItem = (item: SelectModel) => {
    // console.log(item.value)
    return (
      <RowComponent
        key={item.value}
        styles={styles.itemContainer}
        onPress={
          multible
            ? () => selectItemHandel(item.value)
            : () => {
                setSelectedItems([item.value]);
                onSelect(item.value), modalizeRef.current?.close();
              }
        }>
        <View style={{marginRight: 20}}>{getIcon(item.label)}</View>
        <TextComponent
          text={item.label}
          flex={1}
          font={
            selectedItems?.includes(item.value)
              ? fontFamilies.medium
              : fontFamilies.regular
          }
          color={
            selectedItems.includes(item.value) ? colors.primary : colors.text
          }
        />
        {selectedItems.includes(item.value) && (
          <MaterialCommunityIcons
            name="check-underline-circle-outline"
            size={22}
            color={colors.primary}
          />
        )}
      </RowComponent>
    );
  };
  return (
    <View>
      {label && <TextComponent text={label} styles={{marginBottom: 8}} />}
      <RowComponent
        styles={[
          globalStyles.inputContainer,
          {backgroundColor: canPress ? colors.white : colors.grey4},
        ]}
        onPress={() => {
          canPress && setIsVisible(true);
        }}>
        <RowComponent
          styles={{flex: 1, flexWrap: 'wrap', justifyContent: 'flex-start'}}>
          {selectedItems.length > 0 ? (
            selectedItems.map(item => renderSelectedItem(item))
          ) : (
            <TextComponent text={placeholder} />
          )}
        </RowComponent>
        <ArrowDown2 size={22} color={colors.grey} />
      </RowComponent>
      <Portal>
        <Modalize
          ref={modalizeRef}
          onClose={() => setIsVisible(false)}
          handlePosition="inside"
          adjustToContentHeight
          FooterComponent={
            multible && (
              <View style={{paddingBottom: 10}}>
                <ButtonComponent
                  type="primary"
                  text="Xác nhận"
                  onPress={() => {
                    onSelect(selectedItems), modalizeRef.current?.close();
                  }}
                />
              </View>
            )
          }>
          <View
            style={{paddingTop: 30, marginBottom: 10, paddingHorizontal: 20}}>
            {values.map(item => renderServiceItem(item))}
          </View>
        </Modalize>
      </Portal>
    </View>
  );
};

export default DropdownPicker;

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 12,
  },
  selectedItem: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    padding: 4,
    marginBottom: 8,
    marginRight: 8,
    borderRadius: 8,
  },
});
