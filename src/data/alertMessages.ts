import { colors } from "@/constants/colors";

export const alertMessages = {
    onlyImageAllowed: {
      title: 'Cảnh báo',
      description: 'Xin lỗi, ảnh đại diện chỉ được chấp nhận file ảnh.',
      iconName: 'alert-circle',
      iconColor: colors.yellow,
      buttonTitle: 'Đóng',
      buttonColor: colors.grey,
    },
    maxItemsExceeded: (maxItem: number) => ({
      title: 'Giới hạn ảnh',
      description: `Bạn chỉ có thể chọn tối đa ${maxItem} hình ảnh.`,
      iconName: 'alert-circle',
      iconColor: colors.yellow,
      buttonTitle: 'Đóng',
      buttonColor: colors.grey,
    }),
    videoTooLong: {
      title: 'Video quá dài',
      description: 'Video vượt quá 20 giây, vui lòng chọn video ngắn hơn.',
      iconName: 'alert-circle',
      iconColor: colors.yellow,
      buttonTitle: 'Đóng',
      buttonColor: colors.grey,
    },
  };