import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Container, IconButtonComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import { apiGetPetByUserId } from '@/api/apiPet'
import { useAppSelector } from '@/redux'

const MyPetScreen = () => {
  const userId = useAppSelector(state => state.auth.userId)
  const {goBack, navigate} = useCustomNavigation()

  useEffect(()=>{
    apiGetPetByUserId(userId).then((res: any) =>{
      console.log(res)
    })
  },[])
  return (
    <Container title='Thú cưng của tôi'
    left={
      <IconButtonComponent
        name="chevron-left"
        size={30}
        color={colors.dark}
        onPress={goBack}
      />
    }>

    </Container>
  )
}

export default MyPetScreen

const styles = StyleSheet.create({})