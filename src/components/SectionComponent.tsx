import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { globalStyles } from '@/styles/globalStyles'

interface Props {
    children : ReactNode,
    styles? : StyleProp<ViewStyle>
}
const SectionComponent = (props: Props) => {
    const {children, styles} = props
  return (
    <View  style={[globalStyles.sectionStyle, styles]}>
      {children}
    </View>
  )
}

export default SectionComponent

