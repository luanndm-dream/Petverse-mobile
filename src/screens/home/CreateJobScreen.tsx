import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container, IconButtonComponent, SectionComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'
import { useAppSelector } from '@/redux'

const CreateJobScreen = () => {
  const {navigate, goBack} = useCustomNavigation();
  const petCenterId = useAppSelector((state => state.auth.petCenterId))
  
  return (
    <Container
    title="Tạo công việc"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
    <SectionComponent>

    </SectionComponent>
    </Container>
  )
}

export default CreateJobScreen

const styles = StyleSheet.create({
    
})