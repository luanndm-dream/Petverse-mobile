import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {Container, IconButtonComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useRoute} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';
import {STACK_NAVIGATOR_SCREENS} from '@/constants/screens';
import {apiUpdatePayment} from '@/api/apiPayment';

const CheckoutScreen = () => {
  const route = useRoute<any>();
  const {goBack, navigate} = useCustomNavigation();
  const {checkoutUrl, paymentId} = route.params;
  const {hideLoading, showLoading} = useLoading();

  // URL thành công và thất bại để kiểm tra
  const successUrl = 'http://112.213.87.177:3000/success-transaction';
  const failUrl = 'http://112.213.87.177:3000/fail-transaction';

  const handleNavigationStateChange = (navState: any) => {
    console.log(navState);

    // Kiểm tra nếu URL là trang thành công
    if (navState.url.startsWith(successUrl)) {
      apiUpdatePayment(paymentId, 2).then((res: any) => {
        if (res.statusCode === 200) {
          hideLoading();
          navigate('ProfileScreen');
          Toast.show({
            type: 'success',
            text1: 'Thanh toán thành công',
            text2: 'Cảm ơn bạn đã sử dụng dịch vụ!',
          });
        }
      });
    }
    // Kiểm tra nếu URL là trang thất bại
    if (navState.url.startsWith(failUrl)) {
      hideLoading(); // Ẩn loading nếu có
      goBack(); // Quay về màn hình trước
      Toast.show({
        type: 'error',
        text1: 'Thanh toán thất bại',
        text2: 'Vui lòng thử lại sau!',
      });
    }
  };

  return (
    <Container
      title="Thanh toán"
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <WebView
        source={{uri: checkoutUrl}}
        onLoadStart={() => showLoading()} // Hiển thị loading khi bắt đầu tải
        onLoadEnd={() => hideLoading()} // Ẩn loading khi tải xong
        onNavigationStateChange={handleNavigationStateChange} // Kiểm tra điều hướng
      />
    </Container>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
