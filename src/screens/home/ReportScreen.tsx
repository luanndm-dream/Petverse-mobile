import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {
  AddImageComponent,
  ButtonComponent,
  Container,
  IconButtonComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {globalStyles} from '@/styles/globalStyles';
import {apiCreateReport} from '@/api/apiReport';
import {mediaUpload} from '@/utils/mediaUpload';
import useLoading from '@/hook/useLoading';
import Toast from 'react-native-toast-message';
import { pushNotification } from '@/services/notifications';
import { managerId } from '@/constants/app';
import { useAppSelector } from '@/redux';

const ReportScreen = () => {
  const route = useRoute<any>();
  const userId = useAppSelector((state) => state.auth.userId)
  const {goBack} = useCustomNavigation();
  const {showLoading, hideLoading} = useLoading()
  const {appointmentId, petCenterId} = route.params;
  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .min(10, 'Lý do phải ít nhất 10 chữ')
      .max(500, 'Lý do phải tối đa 500 chữ')
      .required('Lý do bắt buộc phải có'),
  });
  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema,
    onSubmit: vals => {
      showLoading();
      apiCreateReport(appointmentId, 'Report', vals.reason, photos, videos).then((res: any) => {
        console.log('res', res);
        if (res.statusCode === 200) {
          hideLoading();
          Toast.show({
            type: 'success',
            text1: 'Báo cáo thành công',
            text2: 'Vui lòng chờ quản lí phản hồi!',
          });
          pushNotification([petCenterId, managerId], {
            title: 'Báo cáo dịch vụ',
            message: vals.reason,
            appointmentId: appointmentId,
            sender: userId,
            status: 1,
            reportId: res.data.id
          });
          goBack();
        } else {
          hideLoading();
          Toast.show({
            type: 'error',
            text1: 'Báo cáo thất bại',
            text2: `Xảy ra lỗi ${res.message}`,
          });
        }
      });
    },});

  const selectetedMediaHandle = (mediaPath: any) => {
    const photos: any[] = [];
    const videos: any[] = [];
    
    console.log('mediaPath',mediaPath)

    mediaPath.forEach((path: any) => {
      if (path.endsWith('.mp4')) {
        videos.push(path);
      } else {
        photos.push(path);
      }
    });

    setPhotos(photos);
    setVideos(videos);
  };
  return (
    <>
      <Container
        title="Báo cáo"
        left={
          <IconButtonComponent
            name="chevron-left"
            size={30}
            color={colors.dark}
            onPress={goBack}
          />
        }>
        <SectionComponent>
          {/* <TextComponent text='Tiêu đề' type='title'/>
        <TextComponent text={`Báo cáo lịch hẹn ${appointmentId}`}/>
        <SpaceComponent height={16}/> */}
          <TextComponent text="Viết nội dung report" type="title" required />
          <InputComponent
            onChange={formik.handleChange('reason')}
            value={formik.values.reason}
            onBlur={formik.handleBlur('reason')}
            allowClear
            maxLength={500}
            multiline
            placeholder="Vui lòng nhập chi tiết nội dung của report"
          />
          {formik.touched.reason && formik.errors.reason ? (
            <Text style={globalStyles.errorText}>{formik.errors.reason}</Text>
          ) : null}

          <TextComponent text="Thêm ảnh hoặc video" type="title" />
          <AddImageComponent
            onSelected={(url: string | string[]) => selectetedMediaHandle(url)}
          />
        </SectionComponent>
      </Container>
      <ButtonComponent
        text="Gửi báo cáo"
        type="primary"
        color={colors.red}
        onPress={formik.handleSubmit}
      />
    </>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({});
