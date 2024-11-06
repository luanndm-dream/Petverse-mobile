import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { TextComponent, RowComponent } from '@/components';
import { Star, Pet } from 'iconsax-react-native';
import { colors } from '@/constants/colors';
import { VertifyIcon } from '@/assets/svgs';

interface Props {
  item: any;
  onPress: (item: any) => void;
  serviceColors: string[];
}

const PetCenterCardComponent: React.FC<Props> = ({ item, onPress, serviceColors }) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onPress(item)}>
      <View style={{ width: '40%' }}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
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
            <TextComponent text={item.name} type="title" styles={styles.nameText} />
          </RowComponent>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.primary} variant="Bold" />
            <TextComponent text={item.rate.toFixed(2)} styles={styles.rateText} />
          </View>
        </View>
        <TextComponent text={item.address} numOfLine={2} type="description" styles={styles.addressText} />
        <View style={styles.detailsContainer}>
          <View style={styles.experienceContainer}>
            <TextComponent text="Kinh nghiệm: " styles={styles.labelText} />
            <TextComponent text={`${item.yoe} năm`} styles={styles.valueText} />
          </View>
          <View style={styles.petsContainer}>
            <Pet size={16} color={colors.primary} variant="Bold" />
            <TextComponent text={item.pets.join(', ') || 'Chưa xác định'} styles={styles.petsText} />
          </View>
        </View>
        <View style={styles.footerContainer}>
          {item.isVerified ? (
            <View style={styles.verifiedContainer}>
              <VertifyIcon width={30} height={30} />
            </View>
          ) : (
            <View />
          )}
          <TouchableOpacity style={styles.bookButton}>
            <TextComponent text="Xem ngay" styles={styles.bookButtonText} type="title" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PetCenterCardComponent;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 120,
    borderRadius: 12,
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
  verifiedContainer: {
    marginTop: 2,
    justifyContent: 'center',
  },
  bookButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});