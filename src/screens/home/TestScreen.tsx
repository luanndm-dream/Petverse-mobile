import { StyleSheet, View } from 'react-native';
import React from 'react';
import VideoPlayer from 'react-native-video-player';

const TestScreen = () => {
  return (
   
      <VideoPlayer
        video={{ uri: 'https://firebasestorage.googleapis.com/v0/b/petverse-chatting.appspot.com/o/chats%2F1-2%2F1729869388506_VID_20241025_165939.mp4?alt=media&token=0857cf18-7f89-456f-98ca-a2394693d78d' }}
        videoWidth={1600}
        videoHeight={900}
        thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
        style={styles.video}
      />
 
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 300, // Chiều cao bạn muốn hiển thị
  },
});