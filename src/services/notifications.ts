import firestore from '@react-native-firebase/firestore';

interface NotificationData {
  title: string;
  sender: string;
  status: number
  appointmentId: string
  message?: string;
  timestamp?: Date;
}

export const pushNotification = async (
  participantIds: string[],
  data: NotificationData
) => {
  try {
    // Sắp xếp danh sách participantIds để đảm bảo thứ tự thống nhất
    const sortedParticipantIds = participantIds.sort();

    // Tạo một đối tượng `participantsStatus` với `isRead: false`
    const participantsStatus = sortedParticipantIds.reduce((acc: any, id) => {
      acc[id] = { isRead: false };
      return acc;
    }, {});

    // Chuẩn bị dữ liệu cho thông báo
    const notificationData = {
      ...data,
      participants: participantsStatus,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    // Thêm thông báo mới vào collection 'notifications'
    await firestore().collection('notifications').add(notificationData);

    console.log('Thông báo đã được gửi thành công!');
  } catch (error) {
    console.error('Lỗi khi gửi thông báo:', error);
  }
};

  export const getNotificationsByUserIdRealtime = (userId: string, callback: (notifications: any[]) => void) => {
    try {
      const unsubscribe = firestore()
        .collection('notifications')
        .where(`participants.${userId}`, '==', true)
        .orderBy('timestamp', 'desc')
        .onSnapshot(
          snapshot => {
            // Kiểm tra nếu snapshot hợp lệ
            if (snapshot && !snapshot.empty) {
              const notifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
              }));
              callback(notifications); // Trả dữ liệu về qua callback
            } else {
              console.log('Không có thông báo hoặc snapshot rỗng');
              callback([]); // Trả danh sách rỗng nếu không có thông báo
            }
          },
          error => {
            console.error('Lỗi khi lắng nghe thông báo:', error);
            callback([]); // Trả danh sách rỗng nếu có lỗi
          }
        );
  
      return unsubscribe;
    } catch (error) {
      console.error('Lỗi ngoài khi lấy thông báo realtime:', error);
      return null;
    }
  };