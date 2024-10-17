import {FlatList, ImageBackground, Platform, StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
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
import {serviceData} from '@/data/servicesData';
import ServiceItem from '@/components/ServiceItem';
import {useCustomNavigation} from '@/utils/navigation';
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions";
const HomeScreen = () => {
  const {goBack, navigate} = useCustomNavigation();

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CAMERA 
          : PERMISSIONS.ANDROID.CAMERA;
        
        const result = await check(permission);
        
        if (result === RESULTS.DENIED) {
          // Yêu cầu quyền camera
          const requestResult = await request(permission);
          if (requestResult !== RESULTS.GRANTED) {
            // Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền camera để sử dụng tính năng này');
          }
        }
      } catch (error) {
        console.error('Lỗi khi yêu cầu quyền camera: ', error);
      }
    };
  
    requestCameraPermission();
  }, []);

  const onPressFeature = (screen: string) => {
    navigate(screen);
  };
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
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={false}
          renderItem={({item}) => (
            <FeatureItem
              name={item.name}
              svgIcon={item.svg}
              onPress={() => onPressFeature(item.screen)}
            />
          )}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent text="Dịch vụ nổi bật" type="title" />
        <FlatList
          scrollEnabled={false}
          data={serviceData}
          keyExtractor={item => item.id.toString()}
          numColumns={4}
          columnWrapperStyle={{
            justifyContent:
              serviceData.length % 4 === 0 ? 'space-between' : 'flex-start',
            paddingVertical: 6,
          }}
          renderItem={({item}) => (
            <ServiceItem name={item.name} svg={item.svg} />
          )}
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
  contentContainer: {
    paddingVertical: 6,
    justifyContent: 'space-between',
    flex: 1,
  },
});
