import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import {Container, IconButtonComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {apiGetPetSpecies} from '@/api/apiPet';
import {apiGetPlaceForPet} from '@/api/apiPlace';
import useLoading from '@/hook/useLoading';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const IMAGE_WIDTH = CARD_WIDTH * 0.4;

const PlaceForPetScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const [speciesData, setSpeciesData] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState<any>(null);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    showLoading();
    Promise.all([apiGetPetSpecies(), apiGetPlaceForPet()])
      .then(([speciesRes, placeRes]: any) => {
        if (speciesRes.statusCode === 200) {
          setSpeciesData(speciesRes.data.items);
        }
        if (placeRes.statusCode === 200) {
          setPlacesData(placeRes.data.items);
          setFilteredPlaces(placeRes.data.items);
        }
      })
      .finally(() => {
        hideLoading();
      });
  }, []);
 // console.log(placesData);
  const handleFilter = (speciesId: any) => {
    setSelectedSpecies(speciesId);
    if (speciesId === null) {
      setFilteredPlaces(placesData);
    } else {
      const filtered = placesData.filter((place: any) =>
        place.species.some((species: any) => species.id === speciesId),
      );
      setFilteredPlaces(filtered);
    }
  };

  const getPlaceTypeLabel = (type: number) => {
    switch (type) {
      case 1:
        return 'Công viên';
      case 2:
        return 'Quán café';
      case 3:
        return 'Pet shop';
      default:
        return 'Khác';
    }
  };

  const renderPlaceItem = ({item, index}: any) => {
    const scale = scrollY.interpolate({
      inputRange: [-1, 0, index * 220, (index + 1) * 220],
      outputRange: [1, 1, 1, 0.9],
    });

    const openGoogleMaps = (lat: string, lng: string) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(url).catch(err =>
        console.error('Error opening Google Maps:', err),
      );
    };

    return (
      <Animated.View style={[styles.card, {transform: [{scale}]}]}>
        <Image source={{uri: item.image}} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.placeName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>
                {getPlaceTypeLabel(item.type)}
              </Text>
            </View>
          </View>
          <Text style={styles.placeAddress} numberOfLines={2}>
            {item.address}
          </Text>
          <Text style={styles.placeDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={[styles.headerRow, {marginTop: 8}]}>
            <View style={styles.freeTagContainer}>
              <Text
                style={[
                  styles.freeTag,
                  item.isFree ? styles.freeTagActive : styles.freeTagInactive,
                ]}>
                {item.isFree ? 'Miễn phí' : 'Không miễn phí'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => openGoogleMaps(item.lat, item.lng)}>
              <Text style={styles.directionText}>Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Container
      title="Địa điểm vui chơi"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
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

      <Animated.FlatList
        data={filteredPlaces}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderPlaceItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
      />
    </Container>
  );
};

export default PlaceForPetScreen;

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: 12,
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
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: Platform.select({android: 4, ios: 0}),
    shadowColor: colors.dark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: IMAGE_WIDTH,
    // height: 180,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  placeAddress: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
    lineHeight: 20,
  },
  placeDescription: {
    fontSize: 13,
    color: colors.grey,
    lineHeight: 18,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  freeTagContainer: {
    marginRight: 8, // Tạo khoảng cách với các thành phần khác
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeTag: {
    fontSize: 10, // Kích thước chữ nhỏ
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 6, // Giảm padding ngang
    paddingVertical: 2, // Giảm padding dọc
    borderRadius: 6, // Bo góc
  },
  freeTagActive: {
    backgroundColor: '#E8F5E9', // Xanh nhạt
    color: '#2E7D32', // Xanh đậm
  },
  freeTagInactive: {
    backgroundColor: '#FFEBEE', // Đỏ nhạt
    color: '#C62828', // Đỏ đậm
  },
  directionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  directionText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
