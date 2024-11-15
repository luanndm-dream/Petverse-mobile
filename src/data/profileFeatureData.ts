import { STACK_NAVIGATOR_SCREENS } from "@/constants/screens";

export const profileFeatureData = [
  {
    id: 1,
    title: 'Chỉnh sửa thông tin',
    backgroundColor: '#002ebe',
    iconName: "account",
    screen: STACK_NAVIGATOR_SCREENS.EDITPROFILESCREEN,
  },
  // {
  //   id: 2,
  //   title: 'Lịch hẹn của tôi',
  //   backgroundColor: '#F3B580',
  //   iconName: "clock-outline",
  //   screen: '',
  // },
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
    title: 'Chính sách & bảo mật',
    backgroundColor: '#ffda00',
    iconName: "book-open",
    screen: STACK_NAVIGATOR_SCREENS.POLICYSCREEN,
  },
  {
    id: 6,
    title: 'Về chúng tôi',
    backgroundColor: '#3ea2f5',
    iconName: "information",
    screen: STACK_NAVIGATOR_SCREENS.ABOUTUSSCREEN,
  },
];
