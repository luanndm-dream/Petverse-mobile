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
  ActivityIndicator,
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
import VideoPlayer from 'react-native-video-player';

const ChatDetailScreen = () => {
  const route = useRoute<any>();
  const {chatId, name, avatar,toUserId} = route.params;
  const navigation = useNavigation();
  const userId = useAppSelector((state) => state.auth.userId)
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    const chatRef = firestore().collection('chats').doc(chatId);
    
    const unsubscribe = chatRef
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });

    return () => unsubscribe();
  }, [chatId]);

  const createNewChat = async () => {
    const chatRef = firestore().collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();

    if (!chatDoc.exists) {
      await chatRef.set({
        createdAt: firestore.FieldValue.serverTimestamp(),
        participants: [userId, toUserId],
      });
    }
    return chatRef;
  };

  const sendMessage = async (urlImage?: string, videoUrl?: string) => {
    if (!urlImage && !videoUrl && newMessage.trim().length === 0) {
      return;
    }
  
    try {
      const chatRef = await createNewChat();
      
      await chatRef.collection('messages').add({
        text: newMessage.trim().length > 0 ? newMessage : '',
        imageUrl: urlImage || '',
        videoUrl: videoUrl || '',
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
      // cropping: true,
      width: 800,
      height: 800,
      compressImageMaxWidth: 800, // Kích thước tối đa 800px
      compressImageMaxHeight: 800,
    })
      .then(async media => {
        const downloadUrl = await uploadMediaToStorage(media);
        if (media.mime.startsWith('video/')) {
          await sendMessage(undefined, downloadUrl);
        } else {
          await sendMessage(downloadUrl);
        }
      })
      .catch(error => {
        console.error('Lỗi khi chọn media:', error);
      });
  };

  const renderMessageItem = useCallback(
    ({ item }: any) => {
      const timestamp =
        item.timestamp && item.timestamp.toDate ? item.timestamp.toDate() : null;
  
      if (item.senderId !== userId && !item.isRead) {
        markMessageAsRead(item.id);
      }
  
      const isMyMessage = item.senderId === userId;
      const hasImage = !!item.imageUrl;
  
      return (
        <Animated.View
          entering={FadeInUp}
          style={[
            styles.messageItem,
            isMyMessage
              ? [styles.myMessage, hasImage && { backgroundColor: 'transparent' }]
              : [styles.otherMessage, hasImage && { backgroundColor: 'transparent' }],
            !item.isRead && !isMyMessage ? styles.unreadMessage : {},
            item.videoUrl ? styles.videoMessageContainer : {},
          ]}
        >
          {item.videoUrl ? (
            <View style={styles.videoContainer}>
              {loadingVideo && (
                <ActivityIndicator
                  style={styles.loadingIndicator}
                  size="large"
                  color={colors.primary}
                />
              )}
              <VideoPlayer
                video={{ uri: item.videoUrl }}
                thumbnail={require('../../assets/images/BannerVideo.png')}
                videoHeight={250}
                videoWidth={200}
                resizeMode="cover"
                onError={(error) => {
                  console.error('Lỗi khi phát video:', error)
                }}
                onStart={() => {
                  setLoadingVideo(true);
                }}
                onLoad={() => {
                  setLoadingVideo(false);
                }}
              />
            </View>
          ) : item.imageUrl ? (
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
              ]}
            >
              {item.text}
            </Text>
          )}
          <Text
            style={[
              styles.timestamp,
              isMyMessage ? styles.myTimestamp : styles.otherTimestamp,
            ]}
          >
            {timestamp ? moment(timestamp).format('HH:mm') : ''}
          </Text>
        </Animated.View>
      );
    },
    [userId, loadingVideo]
  );

  const renderSendButton = (isDisabled: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={[styles.sendButton, isDisabled && styles.sendButtonDisabled]}
      onPress={onPress}
      disabled={isDisabled}>
      <Send size={24} color={isDisabled ? colors.grey : colors.white}
       style={{ transform: [{ rotate: '-45deg' }] }} />
    </TouchableOpacity>
  );
  const getAvatar = (avatar: string | null) => {
    if (avatar && avatar.trim() !== '') {
      return {uri: avatar};
    }
    // Avatar mặc định từ mạng
    return require('../../assets/images/DefaultAvatar.jpg')
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
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
              <Image source={getAvatar(avatar)} style={styles.avatar} />
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
          inverted
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có tin nhắn</Text>
            </View>
          }
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
            {renderSendButton(!newMessage.trim(), () => sendMessage())}
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
  videoContainer: {
    flex: 1,
    width: 200, 
    height: 250, 
    maxHeight: 250,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: colors.grey4
  },
  videoMessageContainer: {
    backgroundColor: 'transparent', 
  },
  messageItem: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  videoMessage: {
    width: 200,
    height: 200,
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
    alignItems: 'center',
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
    flex: 1,
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
    marginTop: Platform.OS === 'android' ? 32 : 0,
    borderBottomWidth: 1,
    borderColor: colors.grey4
  },
  backButton: {
    padding: 8,
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
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12, 
    marginTop: -12, 
    zIndex: 1,
  },
});
