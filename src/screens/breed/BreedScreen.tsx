import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Container,
  InputComponent,
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
import {apiGetPetSpecies} from '@/api/apiPet';

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
  const [selectedSpecies, setSelectedSpecies] = useState<any>(null);
  const [speciesData, setSpeciesData] = useState([]);
  const [filteredCenterBreed, setFilteredCenterBreed] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
      showLoading();

      const fetchData = async () => {
        try {
          const [speciesRes, centerBreedRes]: any = await Promise.all([
            apiGetPetSpecies(),
            apiGetCenterBreed(2),
          ]);

          if (speciesRes.statusCode === 200) {
            setSpeciesData(speciesRes.data.items);
          }

          if (centerBreedRes.statusCode === 200) {
            setCenterBreedData(centerBreedRes.data.items);
            setFilteredData(centerBreedRes.data.items);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          hideLoading();
        }
      };

      fetchData();

      return () => {
        setSpeciesData([]);
        setCenterBreedData([]);
        setFilteredData([]);
      };
    }, []),
  );
  const handleFilter = (speciesId: number | null) => {
    setSelectedSpecies(speciesId);

    const filtered = centerBreedData.filter(item => {
      const matchesSpecies = speciesId === null || item.speciesId === speciesId;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSpecies && matchesSearch;
    });

    setFilteredData(filtered);
  };

  const onPressItemHandle = (id: string, name: string) => {
    navigation.navigate(STACK_NAVIGATOR_SCREENS.BREEDDETAILSCREEN, {
      centerBreedId: id,
      breedName: name,
    });
  };
  const handleSearch = (text: string) => {
    setSearchTerm(text);

    const filtered = centerBreedData.filter(item => {
      const matchesSpecies =
        selectedSpecies === null || item.speciesId === selectedSpecies;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(text.toLowerCase());
      return matchesSpecies && matchesSearch;
    });

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
            <RowComponent>
              <TextComponent
                text={item.name}
                type="title"
                color={colors.dark}
              />
              {item.status === 2 && (
                <Verify size={24} color={colors.green} variant="Bold" />
              )}
            </RowComponent>

            <View style={styles.speciesBadge}>
              <TextComponent
                text={item.speciesName}
                type="title"
                color={colors.white}
                styles={styles.speciesText}
              />
            </View>
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
        <InputComponent
          onChange={handleSearch}
          value={searchTerm}
          placeholder="Nhập tên giống..."
          allowClear
        />

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedSpecies === null && styles.filterButtonActive,
              ]}
              onPress={() => handleFilter(null)}>
              <Text
                style={[
                  styles.filterText,
                  selectedSpecies === null && styles.filterTextActive,
                ]}>
                Tất cả
              </Text>
            </TouchableOpacity>
            {speciesData.map((species: any) => (
              <TouchableOpacity
                key={species.id}
                style={[
                  styles.filterButton,
                  selectedSpecies === species.id && styles.filterButtonActive,
                ]}
                onPress={() => handleFilter(species.id)}>
                <Text
                  style={[
                    styles.filterText,
                    selectedSpecies === species.id && styles.filterTextActive,
                  ]}>
                  {species.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <RowComponent styles={styles.resultContainer} justify="flex-start">
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 8
  },
  nameContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginVertical: 8,
  },
  approvedBadge: {
    marginLeft: 8,
  },
  speciesBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 6
  },
  speciesText: {
    fontSize: 13,
  },
  filterContainer: {
    paddingVertical: 6,
  },
  filterButton: {
    backgroundColor: colors.grey4,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 6,
    elevation: Platform.select({android: 2, ios: 0}),
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.white,
  },
});
