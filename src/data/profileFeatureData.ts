import { colors } from "@/constants/colors";
import { STACK_NAVIGATOR_SCREENS } from "@/constants/screens";

export const profileFeatureData = [
  {
    id: 1,
    title: 'Chỉnh sửa thông tin',
    backgroundColor: '#002ebe',
    iconName: "account",
    screen: STACK_NAVIGATOR_SCREENS.EDITPROFILESCREEN,
  },
  {
    id: 2,
    title: 'Báo cáo',
    backgroundColor: '#F3B580',
    iconName: "clock-outline",
    screen: STACK_NAVIGATOR_SCREENS.REPORTAPPLICATIONSCREEN,
  },
  {
    id: 3,
    title: 'Nạp tiền',
    backgroundColor: '#51829B',
    iconName: "credit-card-outline",
    screen: STACK_NAVIGATOR_SCREENS.PAYMENTSCREEN,
  },
  {
    id: 4,
    title: 'Lịch sử giao dịch',
    backgroundColor: '#39a6b8',
    iconName: "history",
    screen: STACK_NAVIGATOR_SCREENS.TRANSACTIONHISTORYSCREEN,
  },
  {
    id: 5,
    title: 'Điều khoản & điều kiện',
    backgroundColor: '#ffda00',
    iconName: "security",
    screen: STACK_NAVIGATOR_SCREENS.POLICYSCREEN,
  },
  // {
  //   id: 6,
  //   title: 'Chỉnh sách & bảo mật',
  //   backgroundColor: colors.green,
  //   iconName: "book-open",
  //   screen: STACK_NAVIGATOR_SCREENS.POLICYSCREEN,
  // },
 
  {
    id: 7,
    title: 'Đổi mật khẩu',
    backgroundColor: colors.orange,
    iconName: "lock-reset",
    screen: STACK_NAVIGATOR_SCREENS.CHANGEPASSWORDSCREEN,
  },
  {
    id: 8,
    title: 'Về chúng tôi',
    backgroundColor: '#3ea2f5',
    iconName: "information",
    screen: STACK_NAVIGATOR_SCREENS.ABOUTUSSCREEN,
  },
];
