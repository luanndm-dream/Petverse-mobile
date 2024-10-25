import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Container, IconButtonComponent } from '@/components';
import { colors } from '@/constants/colors';
import { useCustomNavigation } from '@/utils/navigation';
import { useNavigation } from '@react-navigation/native';
import { STACK_NAVIGATOR_SCREENS } from '@/constants/screens';
import firestore from '@react-native-firebase/firestore';
import { useAppSelector } from '@/redux';
import moment from 'moment';

const ListChatScreen = () => {
  const { goBack } = useCustomNavigation();
  const navigation = useNavigation<any>();
  const [chatData, setChatData] = useState<any>([]);
  // const userId = useAppSelector(state => state.auth.userId);
  const userId = Platform.OS === 'ios' ? '2': '1'

  // Dữ liệu mẫu cho người dùng
  const users = [
    { id: "1", name: "User 1", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: "2", name: "User 2", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: "3", name: "User 3", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  ];

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', userId)
      .onSnapshot(async (snapshot) => {
        if (snapshot && !snapshot.empty) {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          console.log('items', items);
  
          const unsubscribes = items.map((item:any) => 
            firestore()
              .collection('chats')
              .doc(item.id)
              .collection('messages')
              .orderBy('timestamp', 'desc')
              .limit(1)
              .onSnapshot(messagesSnapshot => {
                const lastMessageData = messagesSnapshot.docs.length > 0 ? messagesSnapshot.docs[0].data() : null;
  
                const timestamp = lastMessageData && lastMessageData.timestamp 
                  ? lastMessageData.timestamp.toDate ? lastMessageData.timestamp.toDate() : lastMessageData.timestamp 
                  : null;
  
                const otherUserId = item.participants.find((user:any) => user !== userId);
                const userInfo = users.find(user => user.id === otherUserId);
  
                setChatData((prevChatData:any) => {
                  const updatedChatData = prevChatData.map((chat:any) => 
                    chat.id === item.id
                      ? {
                          ...chat,
                          name: userInfo ? userInfo.name : "Không xác định",
                          avatar: userInfo ? userInfo.avatar : null,
                          lastMessage: lastMessageData ? lastMessageData.text : "Chưa có tin nhắn",
                          timestamp,
                          isRead: lastMessageData ? lastMessageData.isRead : true,
                        }
                      : chat
                  );
  
                  if (!prevChatData.find((chat:any) => chat.id === item.id)) {
                    return [...prevChatData, {
                      ...item,
                      name: userInfo ? userInfo.name : "Không xác định",
                      avatar: userInfo ? userInfo.avatar : null,
                      lastMessage: lastMessageData ? lastMessageData.text : "Chưa có tin nhắn",
                      timestamp,
                      isRead: lastMessageData ? lastMessageData.isRead : true,
                    }];
                  }
  
                  return updatedChatData;
                });
              })
          );
  
          return () => unsubscribes.forEach(unsub => unsub());
        }
      });
  
    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp: Date) => {
    if (moment().isSame(timestamp, 'day')) {
      return moment(timestamp).format('HH:mm');
    }
    return moment(timestamp).format('DD/MM/YYYY HH:mm');
  };

  const renderChatItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate(STACK_NAVIGATOR_SCREENS.CHATDETAILSCREEN, {
          chatId: item.id,
          name: item.name,
          avatar: item.avatar
        })
      }>
      {item.avatar && (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      )}
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, !item.isRead && styles.unreadText]}>
            {item.name}
          </Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.messageContainer}>
          <Text style={[styles.chatLastMessage, !item.isRead && styles.unreadText]}>
            {item.lastMessage}
          </Text>
          {item.timestamp && (
            <Text style={styles.chatTime}>
              {formatTimestamp(item.timestamp)}
            </Text>
          )}
        </View>
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
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
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
    backgroundColor: colors.white,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    // shadowColor: colors.dark,
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 2,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    width: 80, // Chiều ngang cố định cho khung thời gian
    textAlign: 'right',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatLastMessage: {
    fontSize: 14,
    color: colors.grey,
    flex: 1,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: 'bold',
    color: colors.dark,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  chatList: {
    paddingVertical: 8,
  },
});