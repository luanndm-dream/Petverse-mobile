import { ListSitterIcon, MyPetIcon, PetScheduleIcon, RegistrationIcon, WorkProfileIcon } from "@/assets/svgs";
import { STACK_NAVIGATOR_SCREENS } from "@/constants/screens";

export const homeFeatureData = [
    {
        id: 1,
        name: 'Đăng ký nhân viên',
        svg: RegistrationIcon,
        screen: STACK_NAVIGATOR_SCREENS.EMPLOYEEREGISTRATIONSCREEN
    },
    {
        id: 2,
        name: 'Danh sách Sitter',
        svg: ListSitterIcon,
        screen: STACK_NAVIGATOR_SCREENS.SITTERSCREEN
    },
    {
        id: 3,
        name: 'Thú cưng của tôi',
        svg: MyPetIcon,
        screen: STACK_NAVIGATOR_SCREENS.MYPETSCREEN
    },
    {
        id: 4,
        name: 'Lịch trình thú cưng',
        svg: PetScheduleIcon,
        screen: STACK_NAVIGATOR_SCREENS.EMPLOYEEREGISTRATIONSCREEN
    },
    {
        id: 5,
        name: 'Làm việc',
        svg: WorkProfileIcon,
        screen: STACK_NAVIGATOR_SCREENS.EMPLOYEEREGISTRATIONSCREEN
    },
]