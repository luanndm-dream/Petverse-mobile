import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container, IconButtonComponent } from '@/components'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors } from '@/constants/colors'

const ChatDetailScreen = () => {
    const route = useRoute<any>();
    const {chatId, name} = route.params
    const navigation = useNavigation();
  return (
    <Container
      title={name}
      isScroll={false}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={()=>navigation.goBack()}
        />
      }>

    </Container>
  )
}

export default ChatDetailScreen

const styles = StyleSheet.create({})