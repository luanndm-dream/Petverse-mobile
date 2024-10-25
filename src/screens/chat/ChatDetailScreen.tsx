import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '@/constants/colors';
import firestore from '@react-native-firebase/firestore';
import {useAppSelector} from '@/redux';
import moment from 'moment';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {Back, Send} from 'iconsax-react-native';
import {IconButtonComponent, RowComponent} from '@/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const ChatDetailScreen = () => {
  const route = useRoute<any>();
  const {chatId, name, avatar} = route.params;
  const navigation = useNavigation();
  // const userId = useAppSelector(state => state.auth.userId);
  const userId = Platform.OS === 'ios' ? '2' : '1';
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const initChat = async () => {
      const chatRef = firestore().collection('chats').doc(chatId);

      try {
        // Kiểm tra xem document của chat đã tồn tại chưa
        const chatDoc = await chatRef.get();

        // Nếu chưa có, tạo mới document với dữ liệu cơ bản
        if (!chatDoc.exists) {
          await chatRef.set({
            createdAt: firestore.FieldValue.serverTimestamp(),
            participants: [userId], // Bạn có thể thêm ID của những người dùng khác nếu cần
          });
        }

        // Sau khi tạo hoặc nếu đã có, kiểm tra và khởi tạo sub-collection 'messages'
        const unsubscribe = chatRef
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .onSnapshot(snapshot => {
            if (!snapshot.empty) {
              const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              setMessages(messagesData);
            } else {
              // Xử lý khi không có tin nhắn
              setMessages([]);
            }
          });

        return () => unsubscribe();
      } catch (error) {
        console.error('Lỗi khi khởi tạo chat:', error);
      }
    };

    initChat();
  }, [chatId]);
  const sendMessage = async (urlImage?: string) => {
    if (!urlImage && newMessage.trim().length === 0) {
      return;
    }
  
    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: urlImage ? '' : newMessage, // Để trống nếu là hình ảnh
          imageUrl: urlImage || '', // Lưu link hình ảnh nếu có
          senderId: userId,
          timestamp: firestore.FieldValue.serverTimestamp(),
          isRead: false,
        });
  
      setNewMessage('');
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .update({isRead: true});
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const uploadMediaToStorage = async (media: any) => {
    const fileName = `${new Date().getTime()}_${media.path.split('/').pop()}`;
    const storageRef = storage().ref(`chats/${chatId}/${fileName}`);
    await storageRef.putFile(media.path);
    return await storageRef.getDownloadURL();
  };

  const pickMedia = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    })
      .then(async media => {
        const downloadUrl: any = await uploadMediaToStorage(media);
        console.log('downloadUrl',downloadUrl)
        await sendMessage(downloadUrl);
      })
      .catch(error => {
        console.error('Lỗi khi chọn media:', error);
      });
  };

  const renderMessageItem = useCallback(
    ({item}: any) => {
      const timestamp =
        item.timestamp && item.timestamp.toDate
          ? item.timestamp.toDate()
          : null;
  
      if (item.senderId !== userId && !item.isRead) {
        markMessageAsRead(item.id);
      }
  
      const isMyMessage = item.senderId === userId;
  
      return (
        <Animated.View
          entering={FadeInUp}
          style={[
            styles.messageItem,
            isMyMessage ? styles.myMessage : styles.otherMessage,
            !item.isRead && !isMyMessage ? styles.unreadMessage : {},
          ]}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.imageMessage}
              resizeMode="cover"
            />
          ) : (
            <Text
              style={[
                styles.messageText,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}>
              {item.text}
            </Text>
          )}
          <Text
            style={[
              styles.timestamp,
              isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
            ]}>
            {timestamp ? moment(timestamp).format('HH:mm') : ''}
          </Text>
        </Animated.View>
      );
    },
    [userId],
  );
  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có tin nhắn nào</Text>
      </View>
    ),
    [],
  );

  const renderSendButton = (isDisabled: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.sendButton, isDisabled && styles.sendButtonDisabled]}
      onPress={onPress}
      disabled={isDisabled}>
      <Send size={24} color={isDisabled ? colors.grey : colors.white} />
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <RowComponent>
              <MaterialCommunityIcons
                name="chevron-left"
                size={32}
                color={colors.dark}
              />
              <Image source={{uri: avatar}} style={styles.avatar} />
              <Text style={styles.title}>{name}</Text>
            </RowComponent>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          style={styles.flatList}
          removeClippedSubviews={false}
          inverted={true}
          ListEmptyComponent={ListEmptyComponent}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={30}
          initialNumToRender={10}
          onEndReachedThreshold={0.5}
        />
        <View style={styles.inputContainer}>
          <IconButtonComponent
            name="plus-circle"
            color={colors.primary}
            size={32}
            onPress={pickMedia}
          />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              placeholderTextColor={colors.grey}
            />
            {renderSendButton(!newMessage.trim(), sendMessage)}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatList: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    backgroundColor: colors.white,
  },
  messageItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '80%',
  },
  iconButton: {
    marginRight: 12, // Space between the icon and input field
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  imageMessage: {
    width: 200, // Đặt chiều rộng tùy ý
    height: 200, // Đặt chiều cao tùy ý
    borderRadius: 8,
    marginBottom: 10,
  },
  otherMessage: {
    backgroundColor: colors.grey4,
    alignSelf: 'flex-start',
  },
  unreadMessage: {
    borderColor: colors.red,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.dark,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  myTimestamp: {
    color: colors.white,
  },
  otherTimestamp: {
    color: colors.grey,
  },
  inputContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.grey4,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center', // Align icon and input horizontally
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.grey4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1, // Make sure it takes the available width
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 8,
    color: colors.dark,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.grey4,
  },
  sendIcon: {
    transform: [{rotate: '-45deg'}],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: colors.grey,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: 16,
    marginTop: Platform.OS === 'android' ? 32 : 0,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: colors.dark,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
    // shadowColor: colors.dark,
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 2,
  },
});
