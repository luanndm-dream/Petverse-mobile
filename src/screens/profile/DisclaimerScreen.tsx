import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container, IconButtonComponent, SectionComponent, TextComponent } from '@/components'
import { colors } from '@/constants/colors'
import { useCustomNavigation } from '@/utils/navigation'

const DisclaimerScreen = () => {
  const {goBack} = useCustomNavigation();

  return (
    <Container
    title="Miễn trừ trách nhiệm"
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
    <SectionComponent>
      <TextComponent
        text="Kính gửi Quý người dùng,"
        type="title"
        styles={styles.sectionTitle}
      />
      <TextComponent
        text="Chúng tôi xin trân trọng thông báo rằng quyết định phối giống giữa các thú cưng có nguy cơ cận huyết có thể dẫn đến các vấn đề nghiêm trọng về sức khỏe và chất lượng giống nòi của thú cưng, bao gồm một số hậu quả điển hình như:"
        type="description"
        styles={styles.paragraph}
      />
      <TextComponent text="1. Các bệnh di truyền hoặc dị tật bẩm sinh." type="description" styles={styles.bulletPoint} />
      <TextComponent text="2. Suy giảm hệ miễn dịch hoặc khả năng phát triển của thế hệ sau." type="description" styles={styles.bulletPoint} />
      <TextComponent
        text="Mặc dù hệ thống PetVerse đã cảnh báo về nguy cơ này, nếu quý người dùng và trung tâm vẫn quyết định tiếp tục, xin vui lòng lưu ý:"
        type="description"
        styles={styles.paragraph}
      />
      <TextComponent
        text="1. PetVerse không chịu trách nhiệm về bất kỳ vấn đề nào phát sinh nào sau quá trình phối giống, bao gồm sức khỏe, khả năng sinh sản, hoặc tranh chấp liên quan."
        type="description"
        styles={styles.bulletPoint}
      />
      <TextComponent
        text="2. Quyết định tiến hành phối giống hoàn toàn là do người dùng và trung tâm lựa chọn, và chịu toàn bộ trách nhiệm về kết quả và các hệ lụy sau đó."
        type="description"
        styles={styles.bulletPoint}
      />
      <TextComponent
        text="Bằng cách nhấn 'Đồng ý', Quý người dùng xác nhận đã đọc, hiểu và chấp nhận các điều khoản miễn trừ trách nhiệm này."
        type="description"
        styles={styles.paragraph}
      />
      <TextComponent
        text="Chúng tôi hy vọng Quý người dùng cân nhắc kỹ lưỡng trước khi tiếp tục. Mọi thắc mắc, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi để được tư vấn thêm."
        type="description"
        styles={styles.paragraph}
      />
      <TextComponent text="Trân trọng," type="description" styles={styles.paragraph} />
      <TextComponent text="Đội ngũ PetVerse" type="title" styles={styles.sectionTitle} />
    </SectionComponent>
  </Container>
  )
}

export default DisclaimerScreen

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: colors.dark,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 16,
    color: colors.dark,
  },
})