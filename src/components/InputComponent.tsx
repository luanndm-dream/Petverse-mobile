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
  onBlur?: (blur:any)=>void
  onEnd?: () => void;
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
    onBlur
  } = props;
  const [isShowPassword, setIsShowPassword] = useState(isPassword ?? false);
  return (
    <View style={[styles.inputContainer]}>
      {iconLeft ?? iconLeft}
      <TextInput
        style={[styles.input, globalStyles.text]}
        value={value}
        placeholder={placeholder ?? ''}
        secureTextEntry={isShowPassword}
        onChangeText={val => onChange(val)}
        placeholderTextColor={'#747688'}
        keyboardType={type ?? 'default'}
        autoCapitalize={'none'}
        onEndEditing={onEnd}
        onBlur={onBlur}
      />
      {iconRight && iconRight}
      <TouchableOpacity
        onPress={() => {
          if (isPassword) {
            setIsShowPassword(!isShowPassword); // Chỉ thay đổi hiển thị mật khẩu
          } else if (allowClear && value.length > 0) {
            onChange(''); // Xóa nội dung nếu có cho phép và input không rỗng
          }
        }}>
            {isPassword? (
                 <FontAwesome
                 name={isShowPassword ? 'eye-slash' : 'eye'}
                 size={22}
                 color={colors.grey}
               />
            ):(value.length > 0 && allowClear && (
                <AntDesign name="close" size={22} color={colors.text} />
            ))}
        </TouchableOpacity>
    </View>
  );
};

export default InputComponent;
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey3,
    width: '100%',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    marginBottom: 19,
  },
  input: {
    padding: 0,
    margin: 0,
    flex: 1,
    paddingHorizontal: 14,
    color: colors.text,
  },
});
