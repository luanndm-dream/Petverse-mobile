import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Container, IconButtonComponent, SectionComponent, TextComponent } from '@/components';
import { useCustomNavigation } from '@/utils/navigation';
import { colors } from '@/constants/colors';

const AboutUsScreen = () => {
  const { goBack } = useCustomNavigation();

  return (
    <Container
      title="Về chúng tôi"
      isScroll={true}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }
    >
      <SectionComponent styles={styles.section}>
        <TextComponent text="PetVerse là một ứng dụng kết nối người dùng với các trung tâm chăm sóc thú cưng, mang lại trải nghiệm thuận tiện và hiện đại cho cộng đồng yêu thú cưng." type="text" styles={styles.paragraph} />
      </SectionComponent>

      <SectionComponent styles={styles.section}>
        <TextComponent text="Ứng dụng tập trung vào ba tính năng nổi bật:" type="subTitle" styles={styles.subTitle} />
        <TextComponent text="1. Tạo hồ sơ cho thú cưng:" type="title" styles={styles.itemTitle} />
        <TextComponent text="Người dùng có thể tạo profile riêng cho thú cưng, lưu trữ và chia sẻ hình ảnh hoặc video ngắn, giúp ghi lại những khoảnh khắc đáng yêu." type="text" styles={styles.paragraph} />
        <TextComponent text="2. Đặt lịch sử dụng dịch vụ:" type="title" styles={styles.itemTitle} />
        <TextComponent text="Dựa trên các dịch vụ được cung cấp bởi các trung tâm thú cưng, người dùng dễ dàng đặt lịch chăm sóc, grooming, khám sức khỏe, và nhiều dịch vụ khác." type="text" styles={styles.paragraph} />
        <TextComponent text="3. Tìm đối tác phối giống:" type="title" styles={styles.itemTitle} />
        <TextComponent text="Hỗ trợ kết nối và lựa chọn giống phù hợp để phối cho thú cưng, đảm bảo tính tương thích và sức khỏe của thú cưng." type="text" styles={styles.paragraph} />
      </SectionComponent>

      <SectionComponent styles={styles.section}>
        <TextComponent text="PetVerse hướng đến việc xây dựng một cộng đồng gắn kết, nơi thú cưng được yêu thương và chăm sóc toàn diện." type="text" styles={styles.paragraph} />
      </SectionComponent>
    </Container>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.dark,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 12,
    marginBottom: 4,
  },
});