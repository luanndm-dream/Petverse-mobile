import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Container, IconButtonComponent, SectionComponent, TextComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { apiGetPetByPetId } from '@/api/apiPet';
import useLoading from '@/hook/useLoading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import icon library
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';

const VaccineScreen = () => {
  const { goBack } = useCustomNavigation();
  const route = useRoute<any>();
  const navigation = useNavigation<any>()
  const { showLoading, hideLoading } = useLoading();
  const { petId, petName } = route.params;
  const [vaccinateds, setVaccinateds] = useState<any[]>([]);
  const [vaccinesRecommend, setVaccinesRecommend] = useState<any[]>([]);
  const [petBirthDate, setPetBirthDate] = useState<any>()
  useFocusEffect(
    
    useCallback(()=>{
      showLoading();
      apiGetPetByPetId(petId).then((res: any) => {
        if (res.statusCode === 200) {
          setVaccinateds(res?.data?.petVaccinateds || []);
          setVaccinesRecommend(res?.data?.vaccineRecommendations || []);
          setPetBirthDate(res.data.birthDate)
        } else {
          console.log('Không thể lấy ra thông tin vaccine pet từ API');
        }
        hideLoading();
      });
    },[])
  )
 

  const handleVaccinePress = (vaccine: any) => {

    navigation.navigate(STACK_NAVIGATOR_SCREENS.ADDVACCINESCREEN, {
      petId: petId,
      petBirthDate: petBirthDate,
      vaccineName: vaccine?.vaccineName,
      vaccineId: vaccine.id
    })
  };

  const renderVaccineItem = ({ item, isRecommendation = false }: any) => {
    const content = (
      <View style={styles.vaccineItem}>
        <View style={styles.vaccineHeader}>
          <TextComponent
            text={item.name || item.vaccineName}
            type="title"
            styles={styles.vaccineName}
          />
          {item.dateVaccinated && (
            <MaterialIcons
              name="check-circle"
              size={20}
              color={colors.green}
              style={styles.checkIcon}
            />
          )}
        </View>
        {item.dateVaccinated && (
          <TextComponent
            text={`Ngày tiêm: ${item.dateVaccinated}`}
            type="description"
            styles={styles.date}
          />
        )}
        {item.minAge !== undefined && (
          <TextComponent
            text={`Độ tuổi tối thiểu để tiêm: ${item.minAge} tháng`}
            type="description"
            styles={styles.ageText}
          />
        )}
      </View>
    );

    if (isRecommendation) {
      return (
        <TouchableOpacity
          onPress={() => handleVaccinePress(item)}
          style={styles.touchableWrapper}
          activeOpacity={0.7}>
          {content}
        </TouchableOpacity>
      );
    }
    return content;
  };

  return (
    <Container
      title={`Vaccine của ${petName}`}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
      right={
        <IconButtonComponent
          name="plus"
          size={30}
          color={colors.dark}
          onPress={() =>
            navigation.navigate(STACK_NAVIGATOR_SCREENS.ADDVACCINESCREEN, {
              petId: petId,
              petBirthDate: petBirthDate,
              vaccineName: null
            })
          }
        />
      }
      >
      {/* Vaccine đã tiêm */}
      <SectionComponent>
        <TextComponent text="Vaccine đã tiêm" type="title" styles={styles.sectionTitle} />
        {vaccinateds.length > 0 ? (
          <FlatList
            data={vaccinateds}
            renderItem={({ item }) => renderVaccineItem({ item })}
            keyExtractor={(item, index) => `vaccinated-${index}`}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <TextComponent
            text="Pet chưa tiêm bất kỳ vaccine nào"
            type="description"
            styles={styles.emptyText}
          />
        )}
      </SectionComponent>

      {/* Vaccine gợi ý */}
      <SectionComponent>
        <TextComponent text="Vaccine gợi ý" type="title" styles={styles.sectionTitle} />
        {vaccinesRecommend.length > 0 ? (
          <FlatList
            data={vaccinesRecommend}
            renderItem={({ item }) =>
              renderVaccineItem({ item, isRecommendation: true })
            }
            keyExtractor={(item, index) => `recommend-${index}`}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <TextComponent
            text="Hiện không có vaccine gợi ý"
            type="description"
            styles={styles.emptyText}
          />
        )}
      </SectionComponent>
    </Container>
  );
};

export default VaccineScreen;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.dark,
  },
  vaccineItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: colors.grey4,
    marginBottom: 8,
  },
  vaccineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touchableWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: colors.primary,
  },
  checkIcon: {
    marginLeft: 8,
  },
  date: {
    fontSize: 14,
    color: colors.dark,
  },
  ageText: {
    fontSize: 14,
    color: colors.grey,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.grey,
    fontSize: 14,
    marginVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
});