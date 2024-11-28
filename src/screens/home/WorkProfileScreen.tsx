import React, { useCallback, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import useLoading from '@/hook/useLoading';
import { apiGetJobByPetCenterId } from '@/api/apiJob';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';
import { useAppSelector } from '@/redux';
import { EditServiceIcon, PetBreedingIcon } from '@/assets/svgs';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const WorkProfileScreen = () => {
  const { navigate, goBack } = useCustomNavigation();
  const { showLoading, hideLoading } = useLoading();
  const petCenterId = useAppSelector(state => state.auth.petCenterId);
  const [petCenterData, setPetCenterData] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
      const getPetCenterJob = async () => {
        showLoading();
        try {
          const res:any = await apiGetJobByPetCenterId(petCenterId as never);
          if (res.statusCode === 200) {
            setPetCenterData(res.data);
          } else {
            console.log('Loading working profile failed');
          }
        } catch (error) {
          console.error('Error fetching pet center jobs:', error);
        } finally {
          hideLoading();
        }
      };
      getPetCenterJob();
    }, [petCenterId]),
  );

  const renderMenuItem = (
    icon: React.ReactNode, 
    title: string, 
    subtitle: string, 
    onPress: () => void,
    gradientColors: string[]
  ) => (
    <TouchableOpacity 
      style={styles.menuItemContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.menuItemGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
      >
        <View style={styles.menuItemContent}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <TextComponent
              text={title}
              size={18}
              color={colors.white}
              type='title'
            />
            <TextComponent
              text={subtitle}
              size={14}
              color={colors.white}
              styles={{opacity: 0.7, marginTop: 5}}
            />
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={26}
            color={colors.white}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCreateJob = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Image
          source={require('../../assets/images/FindJobBanner.jpg')}
          style={styles.image}
        />
        <TextComponent
          text="Chưa tìm thấy công việc của bạn"
          styles={styles.titleDescription}
          type="title"
        />
        <TextComponent
          text="Vui lòng tạo công việc để bắt đầu"
          styles={styles.subtitleDescription}
          type="description"
        />
        <TouchableOpacity 
          style={styles.createJobContainer} 
          onPress={() => navigate(STACK_NAVIGATOR_SCREENS.CREATEJOBSCREEN)}
        >
          <LinearGradient
            colors={['#FFC107', '#FF9800']}
            style={styles.createJobGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <MaterialCommunityIcons
              name="paw"
              size={24}
              color={colors.white}
              style={{marginRight: 12}}
            />
            <TextComponent
              text="Tạo công việc"
              color={colors.white}
              size={16}
              type='title'
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container
      title="Quản lý công việc"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
    >
     <SectionComponent>
        {petCenterData.length === 0 ? (
          renderCreateJob()
        ) : (
          <>
            {renderMenuItem(
              <EditServiceIcon width={45} height={45} />,
              "Quản lý dịch vụ",
              "Quản lý và chỉnh sửa dịch vụ của bạn",
              () => navigate(STACK_NAVIGATOR_SCREENS.SERVICESCREEN),
              ['#4A6BFF', '#8A4FFF'] 
            )}
            {renderMenuItem(
              <PetBreedingIcon width={45} height={45} />,
              "Quản lí giống",
              "Theo dõi và quản lí nguồn giống",
              () => navigate(STACK_NAVIGATOR_SCREENS.MANAGEPETBREEDINGSCREEN),
              ['#00BCD4', '#2196F3'] 
            )}
             {renderMenuItem(
              <PetBreedingIcon width={45} height={45} />,
              "Chỉnh sửa công việc",
              "Theo dõi và quản lý hoạt động sinh sản",
              () => navigate(STACK_NAVIGATOR_SCREENS.MANAGEPETBREEDINGSCREEN),
              ['#4CAF50', '#81C784'] 
            )}
          </>
        )}
     </SectionComponent>
    </Container>
  );
};

export default WorkProfileScreen;

const styles = StyleSheet.create({
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },
  titleDescription: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.dark,
    fontWeight: 'bold',
  },
  subtitleDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: colors.grey,
    textAlign: 'center',
  },
  menuItemContainer: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemGradient: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  createJobContainer: {
    width: '80%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  createJobGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});