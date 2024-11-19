import { ListSitterIcon, MyPetIcon, PetScheduleIcon, PlacePetIcon, RegistrationIcon, WorkProfileIcon } from "@/assets/svgs";
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
        name: 'Danh sách trung tâm',
        svg: ListSitterIcon,
        screen: STACK_NAVIGATOR_SCREENS.LISTCENTERSCREEN
    },
    {
        id: 3,
        name: 'Thú cưng của tôi',
        svg: MyPetIcon,
        screen: STACK_NAVIGATOR_SCREENS.MYPETSCREEN
    },
    {
        id: 4,
        name: 'Lịch hẹn của tôi',
        svg: PetScheduleIcon,
        screen: STACK_NAVIGATOR_SCREENS.MYAPPOINTMENTSCREEN
    },
    {
        id: 6,
        name: 'Địa điểm thú cưng',
        svg: PlacePetIcon,
        screen: STACK_NAVIGATOR_SCREENS.PLACEFORPETSCREEN
    },
    
]