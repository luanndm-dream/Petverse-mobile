import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, IconButtonComponent } from '@/components'
import { useRoute } from '@react-navigation/native'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import { apiGetAppointmentByAppointmentId } from '@/api/apiAppoinment'
import { useAppSelector } from '@/redux'

const MyAppointmentDetailScreen = () => {
  const route = useRoute<any>()
  const {goBack} = useCustomNavigation();
  const {appointmentId, appointmentType} = route.params
  const [appointmentData, setAppointmentData] = useState()
  const roleName = useAppSelector((state) => state.auth.roleName)
  useEffect(()=>{
    apiGetAppointmentByAppointmentId(appointmentId).then((res:any)=>{
      console.log(res)
    })
  },[])
  return (
    <Container  
    title='Chi tiết lịch hẹn'
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

export default MyAppointmentDetailScreen

const styles = StyleSheet.create({})