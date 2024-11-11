import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AddImageComponent,
  Container,
  IconButtonComponent,
  SectionComponent,
  TextComponent,
  ButtonComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useRoute} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import { apiCreateSchedule } from '@/api/apiSchedule';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';

const UpdateTrackingScreen = () => {
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading();
  const route = useRoute<any>();
  const {scheduleId} = route.params;
  const [photos, setPhotos] = useState<any>([]);
  const [videos, setVideos] = useState<any>([]);

  const selectetPetPhotoHandle = (imagePath: any) => {
    const photo: any[] = [];
    const video: any[] = [];

    imagePath.forEach((path: any) => {
      if (path.endsWith('.mp4')) {
        video.push(path);
      } else {
        photo.push(path);
      }
    });

    setPhotos(photo);
    setVideos(video);
    formik.setFieldValue('photo', photo);
    formik.setFieldValue('video', video);
  };

  const validationSchema = yup.object().shape({
    photo: yup.array(),
    video: yup.array(),
    media: yup
      .mixed()
      .test(
        'at-least-one',
        'Vui lòng chọn ít nhất 1 ảnh hoặc video.',
        function () {
          const {photo, video} = this.parent;
          return (photo && photo.length > 0) || (video && video.length > 0);
        },
      ),
  });

  const formik = useFormik({
    initialValues: {
      photo: [],
      video: [],
      media: '', // This field is only for validation purposes
    },
    validationSchema,
    onSubmit:  values => {
      
      apiCreateSchedule(scheduleId, photos, videos).then((res: any)=>{
        hideLoading();
        console.log(scheduleId, res)
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Tạo theo dõi thành công',
            text2: 'Petverse chúc bạn thật nhiều sức khoẻ!',
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Tạo theo dõi thất bại',
            text2: `Xảy ra lỗi khi đăng kí ${res.error}`,
          });
        }
      })
    },
  });

  return (
    <>
      <Container
        title="Tạo theo dõi"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          <TextComponent text="Hình ảnh/video" type="title" />
          <AddImageComponent
          camera
            onSelected={(val: string | string[]) => selectetPetPhotoHandle(val)}
          />
          {formik.errors.media ? (
            <Text style={styles.errorText}>{formik.errors.media}</Text>
          ) : null}
        </SectionComponent>
      </Container>
      <ButtonComponent
        text="Gửi"
        type="primary"
        onPress={formik.handleSubmit}
      />
    </>
  );
};

export default UpdateTrackingScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
  },
  errorText: {
    color: colors.red,
    marginTop: 8,
  },
});
