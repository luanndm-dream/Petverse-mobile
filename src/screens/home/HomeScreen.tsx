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
  LeaderBoardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import LinearGradient from 'react-native-linear-gradient';
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
import {WorkProfileIcon, WorkTableIcon} from '@/assets/svgs';
import {useNavigation} from '@react-navigation/native';
// đảm bảo import icon đúng

const HomeScreen = () => {
  const {goBack, navigate} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {hideLoading, showLoading} = useLoading();
  const userId = useAppSelector(state => state.auth.userId);
  const [userData, setUserData] = useState<any>();
  const [roles, setRoles] = useState([]);
  const [homeFeatureData, setHomeFeatureData] = useState(initialFeatureData);
  // const appointment
  const getPreviousMonth = () => {
    const now = new Date();
    const previousMonth = now.getMonth(); 
    return previousMonth === 0 ? 12 : previousMonth; 
  };

  const previousMonth = getPreviousMonth(); // Tính tháng trước
  const monthText = `Trung tâm nổi bật tháng ${previousMonth}`;

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
              svg: WorkTableIcon,
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
  }, [userId]); 

  const onPressFeature = (screen: string) => {
    navigate(screen);
  };
  const handleServicePress = (id: number, name: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETCENTERSERVICESCREEN, {
      idService: id,
      nameService: name,
    });
  };

  const renderFeatureGrid = () => {
    const itemWidth = '25%';

    return (
      <View style={styles.featureGrid}>
        {homeFeatureData.map(item => (
          <View key={item.id} style={[styles.featureItem, {width: itemWidth}]}>
            <FeatureItem
              name={item.name}
              svgIcon={item.svg}
              onPress={() => onPressFeature(item.screen)}
            />
          </View>
        ))}
      </View>
    );
  };
  return (
    <>
      <Container isScroll={true}>
        <SectionComponent>
          <RowComponent styles={styles.header}>
            <RowComponent>
              <TextComponent text="Xin chào" />
              <TextComponent text={`, ${userData?.fullName}`} type="title" />
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
          <TextComponent
            text="Trung tâm nổi bật"
            type="title"
            styles={{marginBottom: 8}}
          />
          <LinearGradient
            colors={['#A18CD1', '#FF758C']}
            style={{
              flex: 1,
              borderRadius: 12,
              padding: 12,
            }}>
            <LeaderBoardComponent />
            <TextComponent
              text={monthText}
              type="title"
              color={colors.white}
              styles={{textAlign: 'center', marginTop: 6}}
            />
          </LinearGradient>
        </SectionComponent>
        <SectionComponent>
          <TextComponent text="Tính năng nổi bật" type="title" />
          {renderFeatureGrid()}
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
    </>
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
    // marginBottom: 12,
  },
  contentContainer: {
    paddingVertical: 6,
    justifyContent: 'space-between',
    flex: 1,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 6,
  },
  featureItem: {
    marginTop: 12,
  },
  serviceItem: {
    marginBottom: 12,
  },
});
