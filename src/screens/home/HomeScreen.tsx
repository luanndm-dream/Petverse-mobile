import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Container,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';

const HomeScreen = () => {
  return (
    <Container>
      <SectionComponent>
        <RowComponent styles={styles.header}>
          <RowComponent>
            <TextComponent text="Xin chào" />
            <TextComponent text=", Lò văn" type="title" />
          </RowComponent>
          <IconButtonComponent name='chat' color={colors.white} backgroundColor={colors.primary} />
        </RowComponent>
        <ImageBackground 
          source={require('../../assets/images/Banner.png')} 
          style={styles.banner} 
          resizeMode="cover"
        />
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
});