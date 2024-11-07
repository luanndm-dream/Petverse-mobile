import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, IconButtonComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import { useRoute } from '@react-navigation/native'
import { apiGetCenterBreedByCenterBreedId } from '@/api/apiCenterBreed'
import useLoading from '@/hook/useLoading'

const BreedDetailScreen = () => {
  const {goBack, navigate} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>()
  const {centerBreedId, breedName} = route.params
  const [breedCenterData, setBreedCenterData] = useState()
  console.log(breedCenterData)
  useEffect(()=>{
    showLoading()
    apiGetCenterBreedByCenterBreedId(centerBreedId).then((res: any)=>{
      if(res.statusCode === 200){
        hideLoading()
        setBreedCenterData(res.data)
      }else{
      console.log('get center breed thất bại')
      }
    })
  },[])
  return (
    <Container
    title={breedName}
    left={
      <IconButtonComponent
        name="chevron-left"
        size={30}
        color={colors.dark}
        onPress={goBack}
      />
    }
    >

    </Container>
  )
}

export default BreedDetailScreen

const styles = StyleSheet.create({})