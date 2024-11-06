import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container, IconButtonComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import useLoading from '@/hook/useLoading'

const ManagePetBreedingScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  return (
    <Container
    title="Quản lí giống thú cưng"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
      right={
        <IconButtonComponent
        name="plus"
        size={30}
        color={colors.dark}
        onPress={goBack}
      />
      }
      >
      
    </Container>
  )
}

export default ManagePetBreedingScreen

const styles = StyleSheet.create({})