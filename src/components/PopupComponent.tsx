import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {ButtonComponent, RowComponent} from '@/components';
import {colors} from '@/constants/colors';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface PopupComponentProps {
  iconName: string;
  iconColor: string;
  title: string;
  description: string;
  isVisible: boolean;
  onLeftPress: () => void;
  onRightPress: () => void;
  onSinglePress?: () => void;
  singleButton?: boolean;
}

const PopupComponent = (props: PopupComponentProps) => {
  const {
    iconColor,
    iconName,
    title,
    description,
    isVisible,
    onLeftPress,
    onRightPress,
    onSinglePress,
    singleButton,
  } = props;
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
        modalHeight={300}
        modalStyle={[
          styles.modal,
          {
            marginTop: (screenHeight - 400) / 2,
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

          <View style={styles.buttonContainer}>
            {singleButton ? (
              <ButtonComponent
                text="OK"
                onPress={onSinglePress}
                type="primary"
                color={colors.primary}
                // containerStyle={styles.singleButton}
              />
            ) : (
              <RowComponent styles={{marginHorizontal:24}}>
                <ButtonComponent
                  text="Cancel"
                  onPress={onLeftPress}
                  type="primary"
                  color={colors.red}
                  //   containerStyle={styles.button}
                />
                <ButtonComponent
                  text="Confirm"
                  onPress={onRightPress}
                  type="primary"
                  color={colors.green}
                  //   containerStyle={styles.button}
                />
              </RowComponent>
            )}
          </View>
        </View>
      </Modalize>
    </Portal>
  );
};

export default PopupComponent;

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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: 12,
  },
  singleButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
  },
});
