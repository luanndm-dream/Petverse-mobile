import {FlatList, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  Container,
  FeatureItem,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {homeFeatureData} from '@/data/homeFeature';

const HomeScreen = () => {
  return (
    <Container>
      <SectionComponent>
        <RowComponent styles={styles.header}>
          <RowComponent>
            <TextComponent text="Xin chào" />
            <TextComponent text=", Lò văn" type="title" />
          </RowComponent>
          <IconButtonComponent
            name="chat"
            color={colors.white}
            backgroundColor={colors.primary}
          />
        </RowComponent>
        <ImageBackground
          source={require('../../assets/images/Banner.png')}
          style={styles.banner}
          resizeMode="cover"
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent text="Tính năng nổi bật" type="title" />
        <FlatList
          data={homeFeatureData}
          keyExtractor={item => item.id.toString()}
          horizontal
          contentContainerStyle = {styles.contentContainer}
          renderItem={({item}) => (
            <FeatureItem name={item.name} svgIcon={item.svg} />
          )}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent text='Dịch vụ nổi bật' type='title'/>
        
      </SectionComponent>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
  },
  contentContainer: {
    paddingVertical: 6,
    justifyContent: 'space-between',
    flex: 1
  }
});
