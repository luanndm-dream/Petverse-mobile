import { FlatList, Image, StyleSheet, View, Dimensions, TouchableOpacity, Modal, ScrollView, Text, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { Container, IconButtonComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import { Trash } from 'iconsax-react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const PHOTO_WIDTH = (SCREEN_WIDTH - 40) / 2

const PetAlbumScreen = () => {
  const route = useRoute<any>()
  const { navigate, goBack } = useCustomNavigation()
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

  const renderPetPhoto = ({ item, index }: any) => {
    return (
      <TouchableOpacity 
        style={styles.photoContainer}
        onPress={() => handlePhotoPress(index)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.url }} style={styles.photo} />
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
          renderItem={renderPetPhoto}
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
          {/* Tắt modal khi ấn vào vùng ngoài ảnh */}
          <TouchableOpacity 
            style={styles.modalOverlayTouchable} 
            activeOpacity={1} 
            onPress={() => setIsModalVisible(false)}
          />

          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
  
            </TouchableOpacity>
            
  
            <ScrollView 
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}  
              contentOffset={{ x: selectedPhotoIndex * SCREEN_WIDTH, y: 0 }}  
            >
              {petPhotos.map((photo: any, index: number) => (
                <Image
                  key={index}
                  source={{ uri: photo.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>

            {/* Hiển thị chỉ số ảnh hiện tại */}
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
    backgroundColor: colors.grey4,
  
    // Đổ bóng cho Android
    elevation: 5, // Tăng giá trị cho đổ bóng đậm hơn
  
    // Đổ bóng cho iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Tăng chiều cao để tạo đổ bóng nhiều hơn
    },
    shadowOpacity: 0.3, // Tăng độ mờ đổ bóng
    shadowRadius: 6, // Tăng bán kính đổ bóng
  },
  photo: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
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
    width: SCREEN_WIDTH,  // Full screen width for horizontal scrolling
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
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  paginationText: {
    position: 'absolute',
    bottom: 20,
    color: colors.grey,
    fontSize: 18,
    fontWeight: 'bold',
  },
})