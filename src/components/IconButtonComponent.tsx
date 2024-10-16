import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  name: string; 
  size?: number;
  color?: string; 
  label?: string; 
  onPress?: () => void;
  backgroundColor?: string; 
}

const IconButtonComponent: React.FC<Props> = ({ 
  name, 
  size = 24, 
  color = '#000', 
  label, 
  onPress, 
  backgroundColor 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {backgroundColor ? (
        <View style={[styles.circle, { backgroundColor }]}>
          <MaterialCommunityIcons name={name} size={size} color={color} />
        </View>
      ) : (
        <MaterialCommunityIcons name={name} size={size} color={color} />
      )}
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default IconButtonComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  circle: {
    width: 40, 
    height: 40,
    borderRadius: 20, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
});