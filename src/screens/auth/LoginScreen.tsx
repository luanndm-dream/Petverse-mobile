import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  Container,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(false);
  return (
 
    <Container>
      <SpaceComponent height={50} />
      <Image
        style={styles.logoImage}
        source={require('../../assets/images/LogoIcon.png')}
      />
      <SectionComponent styles={styles.welcomeContainer}>
        <TextComponent text="Chào mừng" size={30} />
        <RowComponent>
          <TextComponent text="đến với" size={30} />
          <TextComponent
            text=" PETVERSE"
            size={40}
            color={colors.primary}
            type={'bigTitle'}
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={30} />
      <SectionComponent>
        <TextComponent text="Tài khoản" />
        <InputComponent
          value={email}
          onChange={text => {
            setEmail(text);
          }}
          placeholder="Tài khoản"
          iconRight={
            <FontAwesome name="envelope" size={22} color={colors.grey} />
          }
        />
        <TextComponent text="Mật khẩu" />
        <InputComponent
          value={password}
          onChange={text => {
            setPassword(text);
          }}
          placeholder="Mật khẩu"
          isPassword={true}
        />
      </SectionComponent>
      {/* <View style={{flex: 1}}/> */}
      <ButtonComponent text="Đăng nhập" type="primary" onPress={() => {}} />
      <RowComponent>
        <TextComponent text="Nếu bạn chưa có tài khoản." />
        <ButtonComponent
          text=" Đăng kí ngay!"
          type="text"
          onPress={() => {}}
          textStyles={{fontSize: 16, color: colors.primary, fontWeight: 'bold'}}
        />
      </RowComponent>
    </Container>
   
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  logoImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
