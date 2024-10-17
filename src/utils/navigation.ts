import { useNavigation, NavigationProp } from "@react-navigation/native";

// Hàm điều hướng tùy chỉnh
export function useCustomNavigation() {
    const navigation = useNavigation<NavigationProp<any>>(); 

    // Hàm để điều hướng tới một màn hình cụ thể
    const navigate = (screen: string) => {
        navigation.navigate(screen);
    };

    // Hàm để quay lại màn hình trước
    const goBack = () => {
        navigation.goBack();
    };

    return {
        goBack,
        navigate
    };
}