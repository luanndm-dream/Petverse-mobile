import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container, TextComponent } from '@/components'

const HomeScreen = () => {
  return (
    <Container back title='Home' right={<TextComponent text='Search'/>}>
        <View>
            <TextComponent text='11'/>
        </View>
    </Container>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})