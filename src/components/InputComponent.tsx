import {
  View,
  Text,
  KeyboardType,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {colors} from '@/constants/colors';
import {globalStyles} from '@/styles/globalStyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  value: string;
  onChange: (value: string) => void;
  iconLeft?: ReactNode;
  placeholder?: string;
  iconRight?: ReactNode;
  isPassword?: boolean;
  allowClear?: boolean;
  type?: KeyboardType;
  onBlur?: (blur:any)=>void;
  onEnd?: () => void;
  multiline?: boolean;
  maxLength?: number;
  isEdit?: boolean
}

const InputComponent = (props: Props) => {
  const {
    onChange,
    value,
    allowClear,
    iconLeft,
    iconRight,
    isPassword,
    onEnd,
    placeholder,
    type,
    onBlur,
    multiline,
    maxLength,
    isEdit
  } = props;
  const [isShowPassword, setIsShowPassword] = useState(isPassword ?? false);
  
  return (
    <View style={styles.inputContainer}>
      {iconLeft}
      <View style={styles.inputWrapper}>
        <TextInput
          maxLength={maxLength}
          style={[styles.input, globalStyles.text, multiline && {paddingVertical: 6}]}
          value={value}
          placeholder={placeholder ?? ''}
          secureTextEntry={isShowPassword}
          onChangeText={val => onChange(val)}
          placeholderTextColor={'#747688'}
          keyboardType={type ?? 'default'}
          multiline={multiline}
          autoCapitalize={'none'}
          onEndEditing={onEnd}
          onBlur={onBlur}
          editable={isEdit}
        />
        {iconRight && iconRight}
        <TouchableOpacity
          onPress={() => {
            if (isPassword) {
              setIsShowPassword(!isShowPassword);
            } else if (allowClear && value.length > 0) {
              onChange('');
            }
          }}>
          {isPassword ? (
            <FontAwesome
              name={isShowPassword ? 'eye-slash' : 'eye'}
              size={22}
              color={colors.grey}
            />
          ) : (value.length > 0 && allowClear && (
            <AntDesign name="close" size={16} color={colors.text} />
          ))}
        </TouchableOpacity>
      </View>
      {maxLength && (
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Chuyển thành column để xếp chồng lên nhau
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey3,
    width: '100%',
    minHeight: 56,
    backgroundColor: colors.white,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  inputWrapper: {
    flexDirection: 'row', // Giữ nguyên để giữ các biểu tượng bên trái và phải
    alignItems: 'center',
    flex: 1,
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    paddingHorizontal: 14,
    color: colors.text,
  },
  charCount: {
    position: 'absolute',
    marginTop: 5,
    color: colors.grey,
    bottom: 10,
    right: 10,
    fontSize: 10
  },
});