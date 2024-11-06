import {
  FlatList,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Container,
  FeatureItem,
  IconButtonComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {homeFeatureData as initialFeatureData} from '@/data/homeFeature';
import {serviceData} from '@/data/servicesData';
import ServiceItem from '@/components/ServiceItem';
import {useCustomNavigation} from '@/utils/navigation';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {apiGetUserByUserId} from '@/api/apiUser';
import {useAppSelector} from '@/redux';
import useLoading from '@/hook/useLoading';
import {apigetRole} from '@/api/apiRole';
import {WorkProfileIcon} from '@/assets/svgs';
import { useNavigation } from '@react-navigation/native';
// đảm bảo import icon đúng

const HomeScreen = () => {
  const {goBack, navigate} = useCustomNavigation();
  const navigation = useNavigation<any>()
  const {hideLoading, showLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const [userData, setUserData] = useState();
  const [roles, setRoles] = useState([]);
  const [homeFeatureData, setHomeFeatureData] = useState(initialFeatureData); // Chuyển thành state

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const permission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA;

        const result = await check(permission);

        if (result === RESULTS.DENIED) {
          const requestResult = await request(permission);
          if (requestResult !== RESULTS.GRANTED) {
            console.log('Quyền truy cập bị từ chối');
          }
        }
      } catch (error) {
        console.error('Lỗi khi yêu cầu quyền camera: ', error);
      }
    };

    requestCameraPermission();
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        showLoading();

        // Lấy thông tin user
        const userResponse: any = await apiGetUserByUserId(userId);
        if (userResponse.statusCode === 200) {
          setUserData(userResponse.data);

          // Lấy danh sách roles
          const roleResponse: any = await apigetRole();
          if (roleResponse.statusCode === 200) {
            const roles = roleResponse?.data?.items;
            setRoles(roles);

            // Tìm role PetCenter
            const petCenterRole = roles.find(
              (role: any) => role.name === 'PetCenter',
            );
            // Check match roleId
            const isPetCenter = userResponse.data.roleId === petCenterRole?.id;

            const workFeature = {
              id: 5,
              name: 'Làm việc',
              svg: WorkProfileIcon,
              screen: STACK_NAVIGATOR_SCREENS.WORKPROFILESCREEN,
            };

            setHomeFeatureData(prevData => {
              const hasWorkFeature = prevData.some(
                feature => feature.name === 'Làm việc',
              );

              if (isPetCenter && !hasWorkFeature) {
                return [...prevData, workFeature];
              }

              if (!isPetCenter && hasWorkFeature) {
                return prevData.filter(feature => feature.name !== 'Làm việc');
              }

              return prevData;
            });
          }
        } else {
          console.log('Lấy thông tin user thất bại');
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        hideLoading();
      }
    };

    initializeData();
  }, [userId]); // Chỉ phụ thuộc vào userId

  const onPressFeature = (screen: string) => {
    navigate(screen);
  };
  const handleServicePress = (id: number, name: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETCENTERSERVICESCREEN, {
      idService: id,
      nameService: name
    })
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
            onPress={() => navigate(STACK_NAVIGATOR_SCREENS.LISTCHATSCREEN)}
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
          numColumns={4}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingVertical: 6,
          }}
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
            <ServiceItem
              name={item.name}
              svg={item.svg}
              id={item.id}
              onPress={() => handleServicePress(item.id, item.name)}
            />
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
