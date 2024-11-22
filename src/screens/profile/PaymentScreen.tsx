import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {ButtonComponent, Container, IconButtonComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {paymentOptions} from '@/constants/app';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {apiCreatePayment} from '@/api/apiPayment';
import {useAppSelector} from '@/redux';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import useLoading from '@/hook/useLoading';

const {width} = Dimensions.get('window');
const itemWidth = (width - 48) / 3;
const PaymentScreen = () => {
  const userId = useAppSelector(state => state.auth.userId);
  const {goBack, navigate} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading()
  const navigation = useNavigation<any>();
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const predefinedAmounts = [
    {value: 50000, label: '50.000₫'},
    {value: 100000, label: '100.000₫'},
    {value: 200000, label: '200.000₫'},
    {value: 500000, label: '500.000₫'},
    {value: 1000000, label: '1.000.000₫'},
    {value: 2000000, label: '2.000.000₫'},
  ];

  const handleSelectAmount = (value: any) => {
    setSelectedAmount(value);
    setAmount(value.toString());
  };

  const handleSelectPaymentMethod = (id: any) => {
    setSelectedPaymentMethod(id);
  };

  const handlePayment = () => {
    showLoading()
    apiCreatePayment(userId, 'Nạp tiền', 'Nạp tiền', Number(amount)).then(
      (res: any) => {
        if (res.statusCode === 200) {
          hideLoading()
          const checkoutUrl = res.data.checkoutUrl;
          const paymentId = res.data.id
          navigation.navigate(STACK_NAVIGATOR_SCREENS.CHECKOUTSCREEN, {
            checkoutUrl,
            paymentId
          });
        }else{
          hideLoading()
          Toast.show({
            type: 'error',
            text1: 'Thanh toán thất bại',
            text2: `Xảy ra lỗi khi thanh toán ${res.message}`,
          }); 
        }
      },
    );
  };

  const formatNumber = (num: any) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <>
      <Container
        title="Nạp tiền"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <ScrollView style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Số tiền nạp</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Nhập số tiền"
                placeholderTextColor={colors.grey}
              />
              <Text style={styles.currency}>VNĐ</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn nhanh số tiền</Text>
            <View style={styles.amountGrid}>
              {predefinedAmounts.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.amountButton,
                    selectedAmount === item.value && styles.selectedAmount,
                  ]}
                  onPress={() => handleSelectAmount(item.value)}>
                  <Text
                    style={[
                      styles.amountText,
                      selectedAmount === item.value &&
                        styles.selectedAmountText,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            {paymentOptions.map(option => (
              <TouchableOpacity
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === option.id &&
                    styles.selectedPaymentMethod,
                ]}
                onPress={() => handleSelectPaymentMethod(option.id)}
                key={option.id}>
                <View style={styles.paymentIcon}>
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={20}
                    color={colors.dark}
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentTitle}>{option.paymentTitle}</Text>
                  <Text style={styles.paymentDesc}>{option.paymentDesc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Container>
      <ButtonComponent
        text={`Nạp ${amount ? `${formatNumber(amount)}₫` : 'tiền'}`}
        type="primary"
        disable={!amount || !selectedPaymentMethod}
        onPress={handlePayment}
      />
    </>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.dark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.dark,
    padding: Platform.select({android: 0}),
  },
  currency: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: itemWidth - 8,
    height: 44,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: 'white',
  },
  selectedAmount: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  amountText: {
    fontSize: 14,
    color: colors.dark,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  selectedAmountText: {
    color: 'white',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 20,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark,
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 14,
    color: colors.grey,
  },
  payButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedPaymentMethod: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#f5f5f5',
  },
});
