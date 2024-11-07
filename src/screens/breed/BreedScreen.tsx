import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Container,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {SearchNormal1, Verify} from 'iconsax-react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useLoading from '@/hook/useLoading';
import {apiGetCenterBreed} from '@/api/apiCenterBreed';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';

interface CenterBreed {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  petCenterId: string;
  speciesId: number;
  status: number;
  image: string;
  cancelReason: string;
}

const BreedScreen = () => {
  const {showLoading, hideLoading} = useLoading();
  const navigation = useNavigation<any>();
  const [centerBreedData, setCenterBreedData] = useState<CenterBreed[]>([]);
  const [filteredData, setFilteredData] = useState<CenterBreed[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useFocusEffect(
    useCallback(() => {
      showLoading();
      apiGetCenterBreed(2).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          setCenterBreedData(res?.data?.items);
          setFilteredData(res?.data?.items);
        }
      });
    }, []),
  );

  const onPressItemHandle = (id: string, name: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.BREEDDETAILSCREEN, {
      centerBreedId: id,
      breedName: name,
    });
  };
  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const filtered = centerBreedData.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPressItemHandle(item.id, item.name)}>
      <RowComponent>
        <View style={styles.imageContainer}>
          {item.images.length > 0 ? (
            <Image source={{uri: item.images[0].image}} style={styles.image} />
          ) : (
            <Image
              source={require('../../assets/images/DefaultPetAvatar.jpg')}
              style={styles.image}
            />
          )}
        </View>
        <SpaceComponent width={16} />
        <View style={styles.contentContainer}>
          <RowComponent styles={styles.nameContainer}>
            <TextComponent text={item.name} type="title" color={colors.dark} />
            {item.status === 2 && (
              <Verify size={24} color={colors.green} variant="Bold" />
            )}
          </RowComponent>
          <TextComponent
            text={item.description}
            color={colors.grey}
            styles={styles.description}
          />
          <TextComponent
            text={`Giá: ${item.price.toLocaleString()} VND`}
            color={colors.primary}
          />
        </View>
      </RowComponent>
    </TouchableOpacity>
  );

  return (
    <Container title="Phối giống">
      <SectionComponent>
        <RowComponent styles={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm theo tên giống..."
              value={searchTerm}
              onChangeText={handleSearch}
              placeholderTextColor={colors.grey}
            />
            <View style={styles.searchIconContainer}>
              <SearchNormal1 size={24} color={colors.grey} />
            </View>
          </View>
        </RowComponent>
        <RowComponent styles={styles.resultContainer} justify='flex-start'>
          <TextComponent
            text={filteredData?.length.toString()}
            type="title"
            color={colors.primary}
            styles={styles.resultCount}
          />
          <TextComponent text=" kết quả" type="title" color={colors.grey} />
        </RowComponent>
      </SectionComponent>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};
export default BreedScreen;
const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey4,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: colors.dark,
  },
  searchIconContainer: {
    marginRight: 8,
    paddingVertical: 12,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCount: {
    marginRight: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  nameContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginVertical: 4,
  },
  approvedBadge: {
    marginLeft: 8,
  },
});


