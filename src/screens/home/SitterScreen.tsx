import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Container,
  IconButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Filter, SearchNormal, SearchNormal1} from 'iconsax-react-native';

const SitterScreen = () => {
  const {goBack, navigate} = useCustomNavigation();

  return (
    <Container
      title="Sitter"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <SectionComponent>
        <RowComponent>
          <View style={{flex: 1}}>
            <InputComponent
              onChange={(val: string) => {}}
              value={''}
              placeholder="Nhập tên Sitter..."
              iconLeft={<SearchNormal1 size={24} color={colors.grey} />}
            />
          </View>
          <SpaceComponent width={10} />
          <Filter size={30} color={colors.grey} style={styles.iconContainer} />
        </RowComponent>
      </SectionComponent>
    </Container>
  );
};

export default SitterScreen;

const styles = StyleSheet.create({
  searchTextContainer: {
    width: '80%',
  },
  iconContainer: {
    marginBottom: 15,
    height: 'auto',
  },
});
