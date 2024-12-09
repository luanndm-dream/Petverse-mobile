import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from '@/redux';
import {Notification} from 'iconsax-react-native';
import {
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import moment from 'moment';
import 'moment/locale/vi';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';

const NotificationItem = ({item, userId, onPress}: any) => {
  const isUnread = item.participants[userId]?.isRead === false;

  const getLeftBarColor = () => {
    switch (item.status) {
      case 1:
        return '#FF9500'; // Warmer orange
      case 2:
        return colors.primary;
      default:
        return colors.grey4;
    }
  };

  const getStatusBackground = () => {
    switch (item.status) {
      case 1:
        return 'rgba(255, 149, 0, 0.1)';
      case 2:
        return `${colors.primary}1A`; // Adding 10% opacity
      default:
        return colors.grey4;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={[
        styles.notificationItem,
        isUnread && styles.unreadItem,
      ]}
      activeOpacity={0.7}>
      <View style={[styles.leftBar, {backgroundColor: getLeftBarColor()}]} />
      <View
        style={[
          styles.mainContent,
          {backgroundColor: isUnread ? getStatusBackground() : colors.white},
        ]}>
        <View style={styles.itemHeader}>
          {isUnread && <View style={styles.unreadDot} />}
          <Text style={styles.timestamp}>
            {moment(item.timestamp.seconds * 1000).fromNow()}
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text
            style={[styles.title, isUnread && styles.unreadTitle]}
            numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotificationScreen = () => {
  const roleName = useAppSelector(state => state.auth.roleName);
  const id = useAppSelector(state =>
    roleName === 'Customer' ? state.auth.userId : state.auth.petCenterId,
  );
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .where(`participants.${id}`, '!=', null)
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const updatedNotifications = snapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              }))
              .sort(
                (a: any, b: any) =>
                  (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0),
              );

            setNotifications(updatedNotifications);
          } else {
            setNotifications([]);
          }
          setLoading(false);
        },
        error => {
          console.error('Lỗi khi lắng nghe thông báo:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [id]);

  const markNotificationAsRead = async (notification: any, id: string) => {
    try {
      if (notification.participants[id]?.isRead) {
        console.log(
          `Thông báo ${notification.id} đã được đọc trước đó, không cần cập nhật.`,
        );
        return;
      }

      await firestore()
        .collection('notifications')
        .doc(notification.id)
        .update({
          [`participants.${id}.isRead`]: true,
        });

      console.log(`Thông báo ${notification.id} đã được đánh dấu là đã đọc.`);
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo là đã đọc:', error);
    }
  };

  const handleNotificationPress = (notification: any) => {
    markNotificationAsRead(notification, id as never);
    navigation.navigate(STACK_NAVIGATOR_SCREENS.REPORTAPPLICATIONDETAIL, {
      reportId: notification.reportId,
    });
  };

  const getUnreadCount = () => {
    return notifications.filter(
      (n: any) => !n.participants[id as never]?.isRead,
    ).length;
  };

  if (loading) {
    return (
      <Container>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Container>
    );
  }

  return (
    <Container isScroll>
      <SectionComponent>
        {notifications.length > 0 ? (
          <>
            <View style={styles.headerContainer}>
              {getUnreadCount() > 0 && (
                <View style={styles.countContainer}>
                  <Text style={styles.notificationCount}>
                    {getUnreadCount()} chưa đọc
                  </Text>
                </View>
              )}
            </View>
            {notifications.map((notification: any) => (
              <NotificationItem
                key={notification.id}
                item={notification}
                userId={id}
                onPress={handleNotificationPress}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Notification size={48} color={colors.grey4} variant="Bold" />
            <TextComponent
              text="Chưa có thông báo nào"
              styles={styles.emptyText}
            />
            <Text style={styles.emptySubText}>
              Các thông báo của bạn sẽ xuất hiện ở đây
            </Text>
          </View>
        )}
      </SectionComponent>
    </Container>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark,
  },
  countContainer: {
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  notificationCount: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  unreadItem: {
    transform: [{scale: 1}],
  },
  leftBar: {
    width: 4,
  },
  mainContent: {
    flex: 1,
    padding: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  textContainer: {
    gap: 6,
  },
  title: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  unreadTitle: {
    color: colors.primary,
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});