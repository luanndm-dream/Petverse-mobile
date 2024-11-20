import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  InputComponent,
  PetCenterCardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {CloseCircle, Filter, SearchNormal1} from 'iconsax-react-native';
import {apiGetPetCenter} from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useNavigation} from '@react-navigation/native';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {Rating} from 'react-native-ratings';
import {apiGetPetServices} from '@/api/apiPetServices';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ListCenterScreen = () => {
  const {goBack} = useCustomNavigation();
  const navigation = useNavigation<any>();
  const {showLoading, hideLoading} = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [petCenter, setPetCenter] = useState([]);
  const [petServices, setPetServices] = useState([]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isVerifiedFilter, setIsVerifiedFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [tempSelectedServices, setTempSelectedServices] = useState<string[]>(
    [],
  );
  const [tempIsVerifiedFilter, setTempIsVerifiedFilter] = useState(false);
  const [tempRatingFilter, setTempRatingFilter] = useState(0);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<Modalize>();

  useEffect(() => {
    if (isVisible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isVisible]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoading();
        const [servicesRes, centersRes]: any = await Promise.all([
          apiGetPetServices(),
          apiGetPetCenter(),
        ]);

        if (servicesRes?.statusCode === 200) {
          setPetServices(servicesRes?.data?.items || []);
        } else {
          console.log('Lấy dữ liệu petservices thất bại');
        }

        if (centersRes?.statusCode === 200) {
          setPetCenter(centersRes?.data?.items || []);
        } else {
          console.log('Lấy dữ liệu petcenter thất bại');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      } finally {
        hideLoading();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newFilteredData = petCenter.filter((item: any) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesVerified = !isVerifiedFilter || item.isVerified;
      const matchesServices =
        selectedServices.length === 0 ||
        (item.petCenterServices &&
          selectedServices.some(service =>
            item.petCenterServices.includes(service),
          ));

      const matchesRating =
        item.rate !== undefined && item.rate >= ratingFilter;

      return (
        matchesSearch && matchesVerified && matchesServices && matchesRating
      );
    });
    setFilteredData(newFilteredData);
  }, [petCenter, searchTerm, selectedServices, isVerifiedFilter, ratingFilter]);

  const onPressSearch = () => {
    setSelectedServices(tempSelectedServices);
    setIsVerifiedFilter(tempIsVerifiedFilter);
    setRatingFilter(tempRatingFilter);
    setIsVisible(false); // Đóng Modal
  };

  const onPressItemHandle = (item: any) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETCENTERDETAILSCREEN, {
      petCenterId: item.id,
      petCenterName: item.name,
      isBook: false
    });
  };
  const onPressBookHandle = (item: any) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETCENTERDETAILSCREEN, {
      petCenterId: item.id,
      petCenterName: item.name,
      isBook: true
    });
  };

  const toggleServiceSelection = (service: string) => {
    setTempSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service],
    );
  };

  const renderServiceTags = () => {
    return (
      <View style={styles.tagsContainer}>
        {petServices.map((service: any) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceTag,
              tempSelectedServices.includes(service.name) &&
                styles.serviceTagActive,
            ]}
            onPress={() => toggleServiceSelection(service.name)}>
            <Text
              style={[
                styles.serviceTagText,
                tempSelectedServices.includes(service.name) &&
                  styles.serviceTagTextActive,
              ]}>
              {service.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <>
      <Container
        isScroll={false}
        title="Danh sách trung tâm"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent styles={styles.searchSection}>
          <RowComponent>
            <View style={styles.searchInputContainer}>
              <InputComponent
                onChange={(val: string) => setSearchTerm(val)}
                value={searchTerm}
                placeholder="Nhập tên trung tâm..."
                iconLeft={<SearchNormal1 size={24} color={colors.grey} />}
                allowClear
              />
            </View>
            <SpaceComponent width={14} />
            <TouchableOpacity
              style={[
                styles.filterButton,
                (selectedServices.length > 0 ||
                  isVerifiedFilter ||
                  ratingFilter > 0) &&
                  styles.filterButtonActive, // Đổi màu khi filter được áp dụng
              ]}
              onPress={() => {
                setTempSelectedServices(selectedServices);
                setTempIsVerifiedFilter(isVerifiedFilter);
                setTempRatingFilter(ratingFilter);
                setIsVisible(true);
              }}>
   
                <Filter
                  size={24}
                  color={
                    selectedServices.length > 0 ||
                    isVerifiedFilter ||
                    ratingFilter > 0
                      ? colors.white // Màu icon khi filter được áp dụng
                      : colors.grey // Màu mặc định của icon
                  }
                />
                {/* Nút Clear Filter */}
                {(selectedServices.length > 0 ||
                  isVerifiedFilter ||
                  ratingFilter > 0) && (
                  <TouchableOpacity
                    onPress={() => {
                      // Xóa toàn bộ filter
                      setSelectedServices([]);
                      setIsVerifiedFilter(false);
                      setRatingFilter(0);
                    }}
                    style={{position: 'absolute', top: 5, right: 0}}>
                    <MaterialCommunityIcons size={18} color={colors.white} name='close-circle' />
                  </TouchableOpacity>
                )}
          
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={12} />
          <RowComponent styles={styles.resultContainer}>
            <TextComponent
              text={filteredData?.length.toString()}
              type="title"
              color={colors.primary}
              styles={styles.resultCount}
            />
            <TextComponent text=" kết quả" type="title" color={colors.grey} />
          </RowComponent>
        </SectionComponent>

        <SectionComponent styles={styles.listSection}>
          <FlatList
            data={filteredData}
            renderItem={({item}) => (
              <PetCenterCardComponent
                item={item}
                onPressBookNow={()=>onPressBookHandle(item)}
                onPress={()=>onPressItemHandle(item)}
                serviceColors={[
                  '#FFCDD2',
                  '#FFF9C4',
                  '#BBDEFB',
                  '#C8E6C9',
                  '#FFCCBC',
                  '#D1C4E9',
                ]}
              />
            )}
            keyExtractor={(item: any) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </SectionComponent>
      </Container>
      <Portal>
        <Modalize
          ref={modalRef}
          handlePosition="inside"
          adjustToContentHeight
          onClose={() => setIsVisible(false)}>
          <View style={{paddingTop: 24, flex: 1}}>
            <SectionComponent>
              <RowComponent justify="space-between">
                <TextComponent text="Dịch vụ" type="title" />
                {renderServiceTags()}
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent justify="space-between">
                <TextComponent text="Đánh giá" type="title" />
                <Rating
                  type="star"
                  imageSize={24}
                  startingValue={tempRatingFilter || 0} // Đặt giá trị ban đầu
                  onFinishRating={(rate: number) => setTempRatingFilter(rate)} // Cập nhật tạm thời
                />
              </RowComponent>
            </SectionComponent>
            <SectionComponent>
              <RowComponent justify="space-between">
                <TextComponent text="Đã được xác thực?" type="title" />
                <Switch
                  value={tempIsVerifiedFilter}
                  onValueChange={setTempIsVerifiedFilter}
                  thumbColor={colors.primary}
                  trackColor={{false: '#D3D3D3', true: colors.secondary}}
                />
              </RowComponent>
            </SectionComponent>

            <ButtonComponent
              text="Tìm kiếm"
              type="primary"
              onPress={onPressSearch}
            />
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

export default ListCenterScreen;

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  searchInputContainer: {
    flex: 1,
  },
  filterButton: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  filterButtonActive: {
    backgroundColor: colors.primary, // Màu nền khi filter được áp dụng
  },
  resultContainer: {
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  resultCount: {
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 120,
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  verifiedContainer: {
    marginTop: 2,
    // width: '50%',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  rateText: {
    marginLeft: 4,
    color: colors.primary,
    fontWeight: '600',
  },
  addressText: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: colors.grey,
    lineHeight: 18,
  },
  detailsContainer: {
    gap: 8,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 13,
    color: colors.grey,
  },
  valueText: {
    fontSize: 13,
    fontWeight: '500',
  },
  petsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petsText: {
    marginLeft: 6,
    fontSize: 13,
    flex: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginVertical: 16,
  },
  serviceText: {
    backgroundColor: colors.grey,
    color: colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 3,
    marginBottom: 2,
    fontSize: 10,
  },
  tagsContainer: {
    width: '65%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  serviceTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceTagActive: {
    backgroundColor: colors.primary, // Màu khi được chọn
  },
  serviceTagText: {
    fontSize: 14,
    color: '#888',
  },
  serviceTagTextActive: {
    color: '#fff',
  },
  
});
