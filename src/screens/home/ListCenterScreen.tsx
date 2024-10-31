import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  Container,
  IconButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {Filter, Pet, SearchNormal1, Star} from 'iconsax-react-native';
import {priceFormater} from '@/utils/priceFormater';
import {VertifyIcon} from '@/assets/svgs';
import {apiGetPetCenter} from '@/api/apiPetCenter';
import useLoading from '@/hook/useLoading';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';
import { useNavigation } from '@react-navigation/native';

const ListCenterScreen = () => {
  const {goBack, navigate} = useCustomNavigation();
  const navigation = useNavigation<any>()
  const {showLoading, hideLoading} = useLoading();
  const [searchTerm, setSearchTerm] = useState('');
  const [petCenter, setPetCenter] = useState([]);
  const serviceColors = ['#FFCDD2', '#FFF9C4', '#BBDEFB', '#C8E6C9',  '#FFCCBC', '#D1C4E9'];
  useEffect(() => {
    showLoading();
    apiGetPetCenter().then((res: any) => {
      if (res.statusCode === 200) {
        hideLoading();
        setPetCenter(res.data.items);
      } else {
        console.log('Lấy dữ liệu petcenter thất bại');
      }
    });
  }, []);

  const filteredData = petCenter?.filter((item: any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const onPressItemHandle = (item:any) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.PETCENTERDETAILSCREEN, {
      petCenterId: item.id,
      petCenterName: item.name
    })
  }

  const renderSitterCard = (item: any) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={()=>onPressItemHandle(item)}>
        <View style={{width: '40%'}}>
          <Image source={{uri: item.avatar}} style={styles.avatar} />
          <View style={styles.servicesContainer}>
          {item.petCenterServices?.map((service: string, index: number) => (
            <TextComponent 
              key={index}
              text={service}
              type="description"
              styles={[
                styles.serviceText,
                { backgroundColor: serviceColors[index % serviceColors.length] }
              ]}
            />
          ))}
        </View>

        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <RowComponent styles={styles.nameContainer}>
              <TextComponent
                text={item.name}
                type="title"
                styles={styles.nameText}
              />
              
            </RowComponent>
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.primary} variant="Bold" />
              <TextComponent
                text={item.rate.toFixed(2)}
                styles={styles.rateText}
              />
            </View>
          </View>

          <TextComponent
            text={item.address}
            numOfLine={2}
            type="description"
            styles={styles.addressText}
          />

          <View style={styles.detailsContainer}>
            <View style={styles.experienceContainer}>
              <TextComponent text="Kinh nghiệm: " styles={styles.labelText} />
              <TextComponent
                text={`${item.yoe} năm`}
                styles={styles.valueText}
              />
            </View>

            <View style={styles.petsContainer}>
              <Pet size={16} color={colors.primary} variant="Bold" />
              <TextComponent
                text={item.pets.join(', ') || 'Chưa xác định'}
                styles={styles.petsText}
              />
            </View>
          </View>

          <View style={styles.footerContainer}>
            {/* <View style={styles.priceContainer}>
              <TextComponent
                text={
                  item.petCenterServices?.length > 0
                    ? priceFormater(item.petCenterServices[0]?.price || 0)
                    : 'N/A'
                }
                type="title"
                styles={styles.priceText}
              />
            </View> */}
            {item.isVerified ? (
                <View style={styles.verifiedContainer}>
                  <VertifyIcon width={30} height={30} />
                  {/* <TextComponent text='Xác minh' type='description'/> */}
                </View>
              ): <View/>}
            <TouchableOpacity style={styles.bookButton}>
              <TextComponent
                text="Xem ngay"
                styles={styles.bookButtonText}
                type="title"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
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
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color={colors.grey} />
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
          renderItem={({item}) => renderSitterCard(item)}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </SectionComponent>
    </Container>
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
    padding: 12,
    backgroundColor: colors.grey4,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
    justifyContent: 'center'
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
    marginVertical: 8,
  },
  serviceText: {
    backgroundColor: colors.grey4,
    color: colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 3,
    marginBottom: 2,
    fontSize: 10,
  },
});
