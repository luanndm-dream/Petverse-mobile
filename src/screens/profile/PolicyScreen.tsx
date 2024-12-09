import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Container, IconButtonComponent, TextComponent, SectionComponent} from '@/components';
import {colors} from '@/constants/colors';
import {useCustomNavigation} from '@/utils/navigation';

const PolicyScreen = () => {
  const {goBack} = useCustomNavigation();

  return (
    <Container
      title="Điều khoản và chính sách"
      isScroll={true}
      left={
        <IconButtonComponent
          name="chevron-left"
          size={30}
          color={colors.dark}
          onPress={goBack}
        />
      }>
      <SectionComponent>
        {/* Tiêu đề */}
        <TextComponent text="QUY TẮC VÀ QUY ĐỊNH DÀNH CHO TRUNG TÂM" type="title" styles={styles.title} />

        {/* Nội dung */}
        <TextComponent text="1. Xác minh danh tính và thông tin cơ sở" type="subTitle" />
        <TextComponent
          text="• Bạn cam kết cung cấp đầy đủ và chính xác thông tin về trung tâm của mình, bao gồm tên trung tâm, địa chỉ, số điện thoại, email liên hệ và các giấy tờ pháp lý liên quan (giấy phép kinh doanh, giấy chứng nhận dịch vụ thú cưng)."
          type="description"
        />
        <TextComponent
          text="• Đồng ý để hệ thống xác minh thông tin qua các biện pháp cần thiết, bao gồm kiểm tra tính pháp lý và xác thực qua các dịch vụ bên thứ ba."
          type="description"
        />

        <TextComponent text="2. Trách nhiệm cung cấp dịch vụ" type="subTitle" />
        <TextComponent
          text="• Cam kết cung cấp các dịch vụ chất lượng cao, tuân thủ mô tả đã công bố trên hệ thống."
          type="description"
        />
        <TextComponent
          text="• Đảm bảo an toàn, sức khỏe, và sự thoải mái cho thú cưng trong suốt thời gian sử dụng dịch vụ tại trung tâm."
          type="description"
        />
        <TextComponent
          text="• Các hành vi thiếu trách nhiệm, ngược đãi thú cưng hoặc cung cấp dịch vụ kém chất lượng đều bị nghiêm cấm và có thể dẫn đến việc loại khỏi hệ thống."
          type="description"
        />
        <TextComponent
          text="• Đảm bảo đội ngũ nhân viên có chuyên môn, kinh nghiệm và tuân thủ các tiêu chuẩn về chăm sóc thú cưng."
          type="description"
        />

        <TextComponent text="3. Thông tin dịch vụ và chính sách minh bạch" type="subTitle" />
        <TextComponent
          text="• Cung cấp thông tin chi tiết về từng dịch vụ: giá cả, thời gian, yêu cầu đặc biệt, và các điều khoản đi kèm."
          type="description"
        />
        <TextComponent
          text="• Minh bạch về chính sách hoàn hủy dịch vụ để đảm bảo quyền lợi cho cả trung tâm và khách hàng."
          type="description"
        />

        <TextComponent text="4. Môi trường chăm sóc thú cưng" type="subTitle" />
        <TextComponent
          text="• Đảm bảo môi trường chăm sóc sạch sẽ, thoáng mát, an toàn và phù hợp với từng loại thú cưng."
          type="description"
        />
        <TextComponent
          text="• Chuẩn bị đầy đủ các vật dụng cần thiết như thức ăn, nước uống, chuồng trại, đồ chơi,... theo nhu cầu từng loại thú cưng."
          type="description"
        />
        <TextComponent
          text="• Kiểm tra kỹ lưỡng để đảm bảo không có vật dụng nguy hiểm hoặc các yếu tố môi trường gây hại cho thú cưng."
          type="description"
        />

        <TextComponent text="5. Giao tiếp và báo cáo tình trạng thú cưng" type="subTitle" />
        <TextComponent
          text="• Duy trì liên lạc và cập nhật thường xuyên với chủ thú cưng về tình trạng sức khỏe, hành vi, hoặc bất kỳ sự cố nào xảy ra trong thời gian thú cưng ở trung tâm."
          type="description"
        />
        <TextComponent
          text="• Thực hiện báo cáo định kỳ hoặc theo yêu cầu của hệ thống để đảm bảo tính minh bạch và đáng tin cậy."
          type="description"
        />

        <TextComponent text="6. Đảm bảo tuân thủ pháp luật và quy định địa phương" type="subTitle" />
        <TextComponent
          text="• Tuân thủ mọi quy định pháp luật liên quan đến dịch vụ chăm sóc thú cưng và hoạt động của trung tâm."
          type="description"
        />
        <TextComponent
          text="• Đảm bảo không có tiền án hoặc vi phạm pháp luật liên quan đến bạo hành động vật hoặc các hoạt động trái phép."
          type="description"
        />

        <TextComponent text="7. Hệ thống đánh giá và phản hồi" type="subTitle" />
        <TextComponent
          text="• Đồng ý nhận đánh giá từ khách hàng và cam kết cải thiện dịch vụ dựa trên các phản hồi."
          type="description"
        />
        <TextComponent
          text="• Hiểu rằng đánh giá tiêu cực liên tục có thể dẫn đến việc bị tạm ngưng hoặc loại khỏi hệ thống."
          type="description"
        />

        <TextComponent text="8. Hậu quả của việc vi phạm quy tắc" type="subTitle" />
        <TextComponent
          text="• Bất kỳ hành vi vi phạm nào đối với quy tắc và quy định này có thể dẫn đến việc cảnh cáo, tạm ngưng tài khoản hoặc cấm vĩnh viễn khỏi hệ thống."
          type="description"
        />
        <TextComponent
          text="• Trong trường hợp vi phạm nghiêm trọng, PetVerse có quyền yêu cầu bồi thường thiệt hại hoặc tiến hành các thủ tục pháp lý."
          type="description"
        />

        <TextComponent text="9. Cam kết điều khoản và điều kiện" type="subTitle" />
        <TextComponent
          text="• Đọc, hiểu và tuân thủ tất cả các điều khoản, điều kiện và chính sách của PetVerse liên quan đến việc sử dụng nền tảng, quản lý thông tin, và cung cấp dịch vụ."
          type="description"
        />

        <TextComponent text="10. Trách nhiệm của Petverse" type="subTitle" />
        <TextComponent
          text="• Petverse sẽ không chịu trách nhiệm trong trường hợp cả PetCenter và khách hàng bỏ qua cảnh báo của hệ thống ở các chức năng có đưa ra cảnh báo."
          type="description"
        />

        <TextComponent text="CAM KẾT CỦA TRUNG TÂM" type="title" styles={styles.commitmentTitle} />
        <TextComponent
          text="Tôi cam kết tuân thủ tất cả các quy tắc và quy định nêu trên khi đăng ký và cung cấp dịch vụ chăm sóc thú cưng thông qua PetVerse. Tôi hiểu rằng mọi vi phạm có thể dẫn đến hậu quả pháp lý hoặc loại khỏi hệ thống."
          type="description"
        />
      </SectionComponent>
    </Container>
  );
};

export default PolicyScreen;

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  commitmentTitle: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: colors.red,
  },
});