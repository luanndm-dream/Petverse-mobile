import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, Modal, ScrollView, Text, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { Container, IconButtonComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import VideoPlayer from 'react-native-video-player'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PHOTO_WIDTH = (SCREEN_WIDTH - 40) / 2

const PetAlbumScreen = () => {
  const route = useRoute<any>()
  const { goBack } = useCustomNavigation()
  const { petName, petPhotos } = route.params
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0)

  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsModalVisible(true)
  }

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(offsetX / SCREEN_WIDTH)
    setSelectedPhotoIndex(currentIndex)
  }

  const renderMediaItem = ({ item, index }: any) => {
    const isVideo = item.type === 1
    return (
      <TouchableOpacity 
        style={styles.photoContainer}
        onPress={() => handlePhotoPress(index)}
        activeOpacity={0.9}
      >
        {isVideo ? (
          <VideoPlayer
            video={{ uri: item.url }}
            videoWidth={PHOTO_WIDTH}
            videoHeight={150}
            pauseOnPress
            thumbnail={require('../../assets/images/BannerVideo.png')} 
            style={[styles.photo, { backgroundColor: colors.grey3}]}
            resizeMode="cover"
            onError={(error) => console.log(error)}
          />
        ) : (
          <Image source={{ uri: item.url }} style={styles.photo} />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar 
        barStyle={isModalVisible ? "light-content" : "dark-content"} 
        translucent 
        backgroundColor={isModalVisible ? 'rgba(0, 0, 0, 0.8)' : 'transparent'}
      />
      <Container 
        isScroll={true}
        title={`Album của ${petName}`}
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={() => goBack()}
          />
        }
      >
        <FlatList
          scrollEnabled={false}
          data={petPhotos}
          renderItem={renderMediaItem}
          keyExtractor={(item: any, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
        />
      </Container>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalOverlayTouchable} 
            activeOpacity={1} 
            onPress={() => setIsModalVisible(false)}
          />

          <View style={styles.modalView}>
            <ScrollView 
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}  
              contentOffset={{ x: selectedPhotoIndex * SCREEN_WIDTH, y: 0 }}  
            >
              {petPhotos.map((media: any, index: number) => {
                const isVideo = media.type === 1
                return isVideo ? (
                  <VideoPlayer
                    key={index.toString()}
                    video={{ uri: media.url }}
                    videoWidth={SCREEN_WIDTH}
                    videoHeight={400}
                    controls
                    fullscreen
                    pauseOnPress
                    style={styles.modalImage}
                    thumbnail={require('../../assets/images/BannerVideo.png')}
                    // resizeMode="contain"
                  />
                ) : (
                  <Image
                    key={index}
                    source={{ uri: media.url }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )
              })}
            </ScrollView>
            <Text style={styles.paginationText}>{selectedPhotoIndex + 1} / {petPhotos.length}</Text>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default PetAlbumScreen

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    flex: 1,
  },
  photoContainer: {
    width: PHOTO_WIDTH,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
   
  },
  photo: {
    width: '100%',
    height: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayTouchable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalView: {
    width: SCREEN_WIDTH,
    height: 400,
    backgroundColor: colors.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  paginationText: {
    position: 'absolute',
    bottom: 20,
    color: colors.grey,
    fontSize: 18,
    fontWeight: 'bold',
  },
})