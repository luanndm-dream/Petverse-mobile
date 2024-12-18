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
        {/* <TextComponent text="QUY TẮC VÀ QUY ĐỊNH CHUNG" type="title" styles={styles.title} /> */}

        {/* 1. Trách nhiệm thông tin */}
        <TextComponent text="1. Trách nhiệm cung cấp thông tin" type="subTitle" />
        <TextComponent
          text="• Trung tâm và khách hàng phải cung cấp thông tin đầy đủ, chính xác về trung tâm, dịch vụ, thú cưng và mọi yếu tố liên quan. Bao gồm: tên, địa chỉ, giấy phép pháp lý và lịch sử sức khỏe của thú cưng."
          type="description"
        />
        <TextComponent
          text="• PetVerse chỉ là nền tảng kết nối và không chịu trách nhiệm xác minh thông tin ngoài các biện pháp hỗ trợ cơ bản."
          type="description"
        />

        {/* 2. Trách nhiệm cung cấp dịch vụ */}
        <TextComponent text="2. Trách nhiệm cung cấp dịch vụ" type="subTitle" />
        <TextComponent
          text="• Trung tâm chịu trách nhiệm hoàn toàn về chất lượng dịch vụ và sự an toàn của thú cưng trong thời gian trung tâm nhận nuôi."
          type="description"
        />
        <TextComponent
          text="• Trung tâm phải kiểm tra tình trạng sức khỏe của thú cưng trước khi nhận và báo cáo ngay cho chủ nuôi nếu phát hiện bất kỳ vấn đề gì."
          type="description"
        />
        <TextComponent
          text="• Trung tâm chỉ được trễ báo cáo tối đa 1 giờ so với thời gian đã cam kết. Việc vi phạm có thể bị xử lý theo quy định của PetVerse."
          type="description"
        />

        {/* 3. Thông tin về thú cưng */}
        <TextComponent text="3. Thông tin và sức khỏe của thú cưng" type="subTitle" />
        <TextComponent
          text="• Chủ thú cưng phải cung cấp thông tin chính xác về thú cưng (bao gồm giống, tuổi, tình trạng sức khỏe)."
          type="description"
        />
        <TextComponent
          text="• Sau khi lịch hẹn hoàn thành 72 giờ, PetVerse và Trung tâm sẽ không chịu trách nhiệm về bất kỳ sự cố nào liên quan đến thú cưng."
          type="description"
        />
        <TextComponent
          text="• PetVerse không đảm bảo thành công 100% đối với các dịch vụ phối giống hoặc thụ tinh nhân tạo. Tỷ lệ thành công thông thường là ~90% dựa trên dữ liệu thống kê."
          type="description"
        />

        {/* 4. Giới hạn trách nhiệm */}
        <TextComponent text="4. Giới hạn trách nhiệm của PetVerse" type="subTitle" />
        <TextComponent
          text="• PetVerse là nền tảng kết nối trung tâm dịch vụ và khách hàng, không tham gia trực tiếp vào giao dịch và không chịu trách nhiệm pháp lý về chất lượng dịch vụ, các thỏa thuận, hoặc sự cố phát sinh trong quá trình thực hiện dịch vụ."
          type="description"
        />
        <TextComponent
          text="• Mọi tranh chấp giữa Trung tâm và khách hàng phải được giải quyết giữa hai bên. PetVerse chỉ cung cấp thông tin hỗ trợ nếu cần."
          type="description"
        />
        <TextComponent
          text="• PetVerse không chịu trách nhiệm trong các trường hợp: thông tin sai lệch từ các bên liên quan, sự cố sức khỏe phát sinh không báo trước, hoặc các vấn đề nằm ngoài quyền kiểm soát của nền tảng."
          type="description"
        />

        {/* 5. Cam kết của Trung tâm */}
        <TextComponent text="5. Cam kết của Trung tâm" type="subTitle" />
        <TextComponent
          text="• Trung tâm chịu trách nhiệm về giống và quy trình thụ tinh nhân tạo nếu cung cấp dịch vụ phối giống. Trung tâm đảm bảo quy trình này được thực hiện đúng tiêu chuẩn kỹ thuật và an toàn."
          type="description"
        />
        <TextComponent
          text="• Trung tâm phải đảm bảo môi trường sạch sẽ, an toàn, và phù hợp với từng loại thú cưng."
          type="description"
        />
        <TextComponent
          text="• Trung tâm không được thực hiện các hành vi thiếu trách nhiệm hoặc gây tổn hại đến thú cưng dưới bất kỳ hình thức nào."
          type="description"
        />

        {/* 6. Khiếu nại và giải quyết tranh chấp */}
        <TextComponent text="6. Khiếu nại và giải quyết tranh chấp" type="subTitle" />
        <TextComponent
          text="• Mọi khiếu nại từ khách hàng hoặc trung tâm cần được gửi đến bộ phận hỗ trợ của PetVerse trong vòng 72 giờ kể từ khi hoàn thành lịch hẹn."
          type="description"
        />
        <TextComponent
          text="• PetVerse sẽ hỗ trợ giải quyết tranh chấp trên tinh thần trung lập và chỉ cung cấp thông tin cần thiết để các bên tự giải quyết."
          type="description"
        />

        {/* 7. Hậu quả vi phạm */}
        <TextComponent text="7. Hậu quả của việc vi phạm" type="subTitle" />
        <TextComponent
          text="• Trung tâm hoặc khách hàng vi phạm điều khoản sẽ bị cảnh cáo, tạm ngưng hoạt động hoặc loại bỏ vĩnh viễn khỏi hệ thống."
          type="description"
        />
        <TextComponent
          text="• PetVerse có quyền áp dụng các biện pháp xử lý thích hợp và tiến hành thủ tục pháp lý nếu phát hiện vi phạm nghiêm trọng."
          type="description"
        />

        {/* 8. Cam kết của các bên */}
        <TextComponent text="8. Cam kết của các bên" type="subTitle" />
        <TextComponent
          text="• Khi sử dụng dịch vụ của PetVerse, cả Trung tâm và khách hàng cam kết đọc, hiểu và tuân thủ đầy đủ các điều khoản và chính sách này."
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
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginTop: 12,
  },
});