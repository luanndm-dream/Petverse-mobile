import React, {useState} from 'react';
import {Keyboard, StyleSheet, View} from 'react-native';
import {
  Container,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
  ButtonComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {AirbnbRating, Rating} from 'react-native-ratings';
import { apiCreateAppointmentRate } from '@/api/apiAppointmentRate';
import { useRoute } from '@react-navigation/native';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const ReviewScreen = () => {
  const route = useRoute<any>()
  const {showLoading, hideLoading} = useLoading();
  const {goBack} = useCustomNavigation();
  const [rating, setRating] = useState(3); // Giá trị mặc định cho đánh giá
  const [review, setReview] = useState(''); // Nội dung review
  const {appointmentId} = route.params
  const handleSubmit = () => {
    showLoading()
    apiCreateAppointmentRate(appointmentId, rating, review).then((res: any) => {
        if(res.statusCode === 200){
            hideLoading();
            Toast.show({
              type: 'success',
              text1: 'Đánh giá thành công',
              text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
            });
            goBack();
          } else {
            hideLoading();
            Toast.show({
              type: 'error',
              text1: 'Đánh giá thất bại',
              text2: `Xảy ra lỗi khi đăng kí ${res.message}`,
            });
        }
    })
  };

  return (
    <>
      <Container
        title="Đánh giá dịch vụ"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }
  
      >
        <View onTouchStart={()=>Keyboard.dismiss()} style={{flex: 1}}>
        <SectionComponent styles={styles.section} >
          <TextComponent
            text="Đánh giá"
            type="title"
            styles={styles.sectionTitle}
          />
          <AirbnbRating
            count={5}
            reviews={[
              'Quá tệ',
              'Tệ',
              'Bình thường',
              'Tốt',
              'Quá tốt',
            ]}
            defaultRating={3}
            size={36}
            onFinishRating={(rate) => setRating(rate)}
          />
        </SectionComponent>

        {/* Viết đánh giá */}
        <SectionComponent styles={styles.section}>
          <TextComponent
            text="Viết đánh giá"
            type="title"
            styles={styles.sectionTitle}
          />
          <InputComponent
            onChange={val => setReview(val)}
            value={review}
            maxLength={500}
            multiline
            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
          />
        </SectionComponent>

        </View>
      </Container>

      <ButtonComponent
        text="Gửi đánh giá"
        type="primary"
        onPress={handleSubmit}
        styles={styles.submitButton}
      />
    </>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
  },
  rating: {
    alignSelf: 'center',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: colors.grey4,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.dark,
  },
  buttonContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  submitButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
});
