import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container, IconButtonComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { useNavigation } from '@react-navigation/native';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';
import firestore from '@react-native-firebase/firestore';
import { useAppSelector } from '@/redux';

const ListChatScreen = () => {
  const { goBack } = useCustomNavigation();
  const navigation = useNavigation<any>();
  const [chatData, setChatData] = useState([]); // Khởi tạo state cho chatData
  const userId = useAppSelector(state => state.auth.userId);

  // Dữ liệu mẫu cho người dùng
  const users = [
    { id: "1", name: "Bạn", avatar: "https://via.placeholder.com/50" }, // Avatar của bạn
    { id: "2", name: "User 2", avatar: "https://randomuser.me/api/portraits/men/2.jpg" }, // Avatar của User 2
    { id: "3", name: "User 3", avatar: "https://randomuser.me/api/portraits/women/3.jpg" }, // Avatar của User 3
  ];

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('users', 'array-contains', userId)
      .onSnapshot(snapshot => {
        if (snapshot && !snapshot.empty) {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Lọc ra userId khác với userId của bạn
          const filteredUserIds = items.flatMap(item => 
            item.users.filter(user => user !== userId)
          );

          console.log(filteredUserIds); // In ra danh sách userId khác

          // Cập nhật chatData với thông tin người dùng
          const updatedChatData = items.map(item => {
            const otherUserId = item.users.find(user => user !== userId);
            const userInfo = users.find(user => user.id === otherUserId);
            return {
              ...item,
              name: userInfo ? userInfo.name : "Không xác định", // Tên người dùng
              avatar: userInfo ? userInfo.avatar : null, // Avatar người dùng
            };
          });

          setChatData(updatedChatData); // Cập nhật state với danh sách chat
        }
      });

    return () => unsubscribe();
  }, [userId]);

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate(STACK_NAVIGATOR_SCREENS.CHATDETAILSCREEN, {
          chatId: item.id,
          name: item.name,
        })
      }>
      {item.avatar && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} /> // Hiển thị avatar
      )}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatLastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container
      title="Đoạn chat"
      isScroll={false}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <FlatList
        data={chatData} // Sử dụng chatData từ Firestore
        renderItem={renderChatItem}
        keyExtractor={item => item.id} // Đảm bảo keyExtractor sử dụng id của document
      />
    </Container>
  );
};

export default ListChatScreen;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  chatTime: {
    fontSize: 12,
    color: colors.grey,
  },
  chatLastMessage: {
    fontSize: 14,
    color: colors.grey,
  },
});