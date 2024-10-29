import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Filter,
  Pet,
  SearchNormal,
  SearchNormal1,
  Star,
} from 'iconsax-react-native';
import {priceFormater} from '@/utils/priceFormater';
import { VertifyIcon } from '@/assets/svgs';

const ListCenterScreen = () => {
  const {goBack, navigate} = useCustomNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const data = [
    {
      id: 1,
      name: 'Pet house',
      address: 'Quận 9, TP Hồ Chí Minh',
      phoneNumber: '0123456789',
      avatar: require('../../assets/images/pethouseavatar.jpg'),
      price: 200000,
      rate: 4.5,
      pet: ['Chó', 'Mèo'],
      services: 'Trông thú cưng',
      isVerify: true,
      yoe: 3,
    },
    {
      id: 2,
      name: 'Nhà thú KO',
      address: 'Khu phố 2, Dân Thuân,Quận 2, TP Hồ Chí Minh',
      phoneNumber: '0123456789',
      avatar: require('../../assets/images/pethouseavatar.jpg'),
      price: 250000,
      rate: 4.1,
      pet: ['Chó'],
      services: 'Huấn luyện',
      isVerify: false,
      yoe: 2,
    },
  ];
  const filteredData = data?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const renderSitterCard = (item: any) => {
    return (
      <RowComponent styles={styles.itemContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={{flex: 1, width: '70%', marginLeft: 12}}>
          <RowComponent styles={{justifyContent: 'flex-start'}}>
          <TextComponent text={item.name} type="title" styles={{marginRight: 6}}/>
          {
            item.isVerify && <VertifyIcon width={18} height={18}/>
          }
          
          </RowComponent>
         
          <TextComponent
            text={item.services}
            numOfLine={2}
            type="description"
          />
          <RowComponent styles={{justifyContent: 'flex-start'}}>
            <TextComponent text="Số năm kinh nghiệm: " />
            <TextComponent text={item.yoe} />
          </RowComponent>
          <RowComponent styles={{justifyContent: 'flex-start', paddingTop: 6}}>
            <Star size={18} color={colors.primary} variant="Bold" />
            <TextComponent text={item.rate} styles={{marginRight: 12}} />
            <Pet size={18} color={colors.primary} variant="Bold" />
            <TextComponent text={item?.pet?.join(', ')}/>
          </RowComponent>
        </View>
        <View style={styles.buttonPriceTextContainer}>
          <TextComponent text={priceFormater(item.price)} type="title" />
          <TouchableOpacity style={styles.buttonContainer}>
            <TextComponent
              text="Đặt ngay"
              color={colors.primary}
              styles={{padding: 4, textAlign: 'center'}}
              type="title"
            />
          </TouchableOpacity>
        </View>
      </RowComponent>
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
      <SectionComponent>
        <RowComponent>
          <View style={{flex: 1}}>
            <InputComponent
              onChange={(val: string) => setSearchTerm(val)}
              value={searchTerm}
              placeholder="Nhập tên trung tâm..."
              iconLeft={<SearchNormal1 size={24} color={colors.grey} />}
              allowClear
            />
          </View>
          <SpaceComponent width={10} />
          <Filter size={30} color={colors.grey} style={styles.iconContainer} />
        </RowComponent>
        <RowComponent styles={{justifyContent: 'flex-start'}}>
          <TextComponent
            text={filteredData?.length.toString()}
            type="title"
            color={colors.grey}
          />
          <TextComponent text=" kết quả" type="title" color={colors.grey} />
        </RowComponent>
      </SectionComponent>
      <SectionComponent>
        <FlatList data={filteredData} renderItem={({item}) => renderSitterCard(item)} />
      </SectionComponent>
    </Container>
  );
};

export default ListCenterScreen;

const styles = StyleSheet.create({
  searchTextContainer: {
    width: '80%',
  },
  iconContainer: {
    marginBottom: 15,
    height: 'auto',
  },
  avatar: {
    width: 60,
    height: 80,
    borderRadius: 6,
    // resizeMode: 'cover',
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 10,
    paddingHorizontal: 10,
    height: 100,
    backgroundColor: colors.grey4,
    borderRadius: 6,
  },
  buttonContainer: {
    position: 'absolute',
    right: 5,
    bottom: -30,
    borderWidth: 0.5,
    borderRadius: 6,
    borderColor: colors.primary,
  },
  buttonPriceTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
