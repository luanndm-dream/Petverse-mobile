import { STACK_NAVIGATOR_SCREENS } from "@/constants/screens";

export const appointmentData = [
    {
        id: 1,
        title: 'Đang chờ',
        icon: 'clipboard-clock-outline',
        status: 0,
        screen: STACK_NAVIGATOR_SCREENS.APPOINTMENTSTATUSSCREEN
    },
    {
        id: 2,
        title: 'Đã nhận',
        icon: 'clipboard-text-outline',
        status: 1,
        screen: STACK_NAVIGATOR_SCREENS.APPOINTMENTSTATUSSCREEN
    },
    {
        id: 3,
        title: 'Hoàn thành',
        icon: 'clipboard-check-outline',
        status: 2,
        screen: STACK_NAVIGATOR_SCREENS.APPOINTMENTSTATUSSCREEN
    },
    {
        id: 4,
        title: 'Đã huỷ',
        icon: 'file-document-outline',
        status: 3,
        screen: STACK_NAVIGATOR_SCREENS.APPOINTMENTSTATUSSCREEN
    },
]