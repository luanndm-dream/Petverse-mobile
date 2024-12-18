import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Container, IconButtonComponent, InputComponent, SectionComponent, TextComponent } from '@/components'
import { colors } from '@/constants/colors'
import { apiGetPetByPetId } from '@/api/apiPet'
import useLoading from '@/hook/useLoading'
import { useFormik } from 'formik'

const EditPetScreen = () => {
    const route = useRoute<any>()
    const {showLoading, hideLoading} = useLoading()
    const navigation = useNavigation<any>()
    const {petId, petName} = route.params
    // const 
    useEffect(()=>{
        showLoading()
        apiGetPetByPetId(petId).then((res:any) => {
            if(res.statusCode === 200){
                hideLoading()
               // console.log(res)
            }else{
                hideLoading()
                console.log('lấy dữ liệu pet thất bại')
            }
        })
    },[petId])
    const formik = useFormik({
        initialValues: {
            petName: '',
            description: '',
            weight: 0,
            
        },
        onSubmit: vals => console.log(vals)
    })
  return (
    <Container
    isScroll={true}
    title={petName}
    left={
      <IconButtonComponent
        name="chevron-left"
        size={30}
        color={colors.dark}
        onPress={() => navigation.goBack()}
      />
    }>
        <SectionComponent>
            <TextComponent text='Tên thú cưng' type='title' required/>
            {/* <InputComponent 
            
            /> */}
        </SectionComponent>
    </Container>
  )
}

export default EditPetScreen

const styles = StyleSheet.create({})