import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { colors } from '@/constants/colors';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonComponent from './ButtonComponent';


interface AlertPopupComponentProps {
    iconName: string;
    iconColor: string;
    title: string;
    description: string;
    isVisible: boolean;
    buttonTitle: string;
    buttonColor?: string;
    onButtonPress: () => void;
    onClose: () => void;
  }

  const AlertPopupComponent = ({
    iconName,
    iconColor,
    title,
    description,
    isVisible=true,
    buttonTitle,
    buttonColor = colors.primary,
    onButtonPress,
    onClose,
  }: AlertPopupComponentProps) => {
    const modalRef = useRef<Modalize>(null);
    const screenHeight = Dimensions.get('window').height;
  
    useEffect(() => {
      if (isVisible) {
        modalRef.current?.open();
      } else {
        modalRef.current?.close();
      }
    }, [isVisible]);
  
    return (
      <Portal>
        <Modalize
          ref={modalRef}
          onClose={onClose}
          adjustToContentHeight={true}
          modalStyle={[
            styles.modal,
            {
              marginTop: (screenHeight - 300) / 2,
            },
          ]}
          handlePosition="inside"
          withHandle={false}
          overlayStyle={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={iconName} size={40} color={iconColor} />
            </View>
  
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
  
         
          </View>
          <ButtonComponent
              text={buttonTitle}
              onPress={onButtonPress}
              type="primary"
              color={buttonColor}
            />
        </Modalize>
      </Portal>
    );
  };
  
  export default AlertPopupComponent;
  
  const styles = StyleSheet.create({
    modal: {
      backgroundColor: 'white',
      borderRadius: 20,
      width: '90%',
      alignSelf: 'center',
      position: 'absolute',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      height: '80%',
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    container: {
      padding: 24,
      alignItems: 'center',
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    contentContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 12,
      color: '#1A1A1A',
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      color: '#666666',
      paddingHorizontal: 8,
    },
    button: {
      width: '100%',
      minHeight: 48,
      borderRadius: 12,
    },
  });